import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Data Types
  type BadgeId = Nat;

  public type SkillBadge = {
    id : BadgeId;
    owner : Principal;
    skillName : Text;
    issuer : Principal;
    issueTimestamp : Time.Time;
    description : ?Text;
    level : ?Text;
    verified : Bool;
  };

  public type UserProfile = {
    name : Text;
    email : ?Text;
    organization : ?Text;
  };

  module SkillBadge {
    public func compare(badge1 : SkillBadge, badge2 : SkillBadge) : Order.Order {
      Nat.compare(badge1.id, badge2.id);
    };
  };

  let badges = Map.empty<BadgeId, SkillBadge>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Access control for issuer management
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Badge counters and persistent state
  var nextId = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile or must be admin");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Issue (mint) new badge - Admin only
  public shared ({ caller }) func issueBadge(
    owner : Principal,
    skillName : Text,
    description : ?Text,
    level : ?Text,
  ) : async BadgeId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can issue badges");
    };

    let badge : SkillBadge = {
      id = nextId;
      owner;
      skillName;
      issuer = caller;
      issueTimestamp = Time.now();
      description;
      level;
      verified = true;
    };

    badges.add(nextId, badge);
    nextId += 1;
    badge.id;
  };

  // Employer verification - Public access (no auth required)
  public query func verifyBadge(badgeId : BadgeId) : async ?SkillBadge {
    badges.get(badgeId);
  };

  // Public access for transparency and verification
  public query func getBadgesForUser(user : Principal) : async [SkillBadge] {
    badges.values().toArray().filter(func(badge) { badge.owner == user }).sort();
  };

  // Public access for transparency
  public query func getAllBadges() : async [SkillBadge] {
    badges.values().toArray().sort();
  };
};
