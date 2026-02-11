import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../hooks/useCurrentUser';
import { useIssueBadge } from '../hooks/useIssueBadge';
import { useNavigate } from '@tanstack/react-router';
import AccessDeniedScreen from '../components/auth/AccessDeniedScreen';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Principal } from '@dfinity/principal';

export default function IssuerMintPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const issueBadge = useIssueBadge();

  const [ownerPrincipal, setOwnerPrincipal] = useState('');
  const [skillName, setSkillName] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('');
  const [mintedBadgeId, setMintedBadgeId] = useState<string | null>(null);

  const isAuthenticated = !!identity;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!ownerPrincipal.trim()) {
      toast.error('Please enter the student Principal ID');
      return;
    }

    if (!skillName.trim()) {
      toast.error('Please enter the skill name');
      return;
    }

    // Validate Principal format
    try {
      Principal.fromText(ownerPrincipal.trim());
    } catch (error) {
      toast.error('Invalid Principal ID format');
      return;
    }

    try {
      const badgeId = await issueBadge.mutateAsync({
        owner: Principal.fromText(ownerPrincipal.trim()),
        skillName: skillName.trim(),
        description: description.trim() || null,
        level: level.trim() || null,
      });

      setMintedBadgeId(badgeId.toString());
      toast.success('Badge issued successfully!');

      // Reset form
      setOwnerPrincipal('');
      setSkillName('');
      setDescription('');
      setLevel('');
    } catch (error: any) {
      console.error('Mint error:', error);
      toast.error(error.message || 'Failed to issue badge. Please try again.');
    }
  };

  // Loading state
  if (adminLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Access denied
  if (!isAuthenticated || !isAdmin) {
    return <AccessDeniedScreen />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-primary" />
            Issue Badge
          </h1>
          <p className="text-muted-foreground text-lg">
            Mint a new skill badge for a student
          </p>
        </div>

        {/* Success Message */}
        {mintedBadgeId && (
          <Card className="border-primary/50 bg-primary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-primary">Badge Issued Successfully!</CardTitle>
                  <CardDescription>Badge ID: {mintedBadgeId}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Mint Form */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Details</CardTitle>
            <CardDescription>
              Enter the student's information and badge details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="owner">
                  Student Principal ID <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="owner"
                  placeholder="e.g., aaaaa-aa..."
                  value={ownerPrincipal}
                  onChange={(e) => setOwnerPrincipal(e.target.value)}
                  required
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  The Internet Identity Principal of the student receiving this badge
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillName">
                  Skill Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="skillName"
                  placeholder="e.g., Machine Learning Fundamentals"
                  value={skillName}
                  onChange={(e) => setSkillName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level (optional)</Label>
                <Input
                  id="level"
                  placeholder="e.g., Beginner, Intermediate, Advanced"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the skill or achievement..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full gap-2" disabled={issueBadge.isPending}>
                {issueBadge.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Issuing Badge...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Issue Badge
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">About Badge Issuance</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              • Badges are permanently recorded on the blockchain and cannot be deleted
            </p>
            <p>
              • Each badge is automatically verified and linked to the issuer's Principal
            </p>
            <p>
              • Students can share verification links with employers to prove authenticity
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

