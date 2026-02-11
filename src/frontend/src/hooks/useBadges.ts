import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import { type SkillBadge } from '../backend';

export function useGetCallerBadges() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<SkillBadge[]>({
    queryKey: ['callerBadges', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getBadgesForUser(identity.getPrincipal());
    },
    enabled: !!actor && !!identity && !actorFetching,
  });
}

export function useGetBadgeById(badgeId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<SkillBadge | null>({
    queryKey: ['badge', badgeId],
    queryFn: async () => {
      if (!actor) return null;
      try {
        const id = BigInt(badgeId);
        return actor.verifyBadge(id);
      } catch (error) {
        console.error('Invalid badge ID:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching && !!badgeId,
  });
}

