import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { useVerifyBadge } from '../hooks/useVerifyBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatTimestamp, formatPrincipal } from '../utils/format';
import { CheckCircle2, XCircle, Search, Loader2, Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function EmployerVerificationPage() {
  const search = useSearch({ from: '/verify' });
  const [badgeId, setBadgeId] = useState('');
  const { mutate: verifyBadge, data: badge, isPending, isSuccess, isError } = useVerifyBadge();

  // Auto-verify if badgeId is in URL
  useEffect(() => {
    const urlBadgeId = (search as any)?.badgeId;
    if (urlBadgeId && !isSuccess && !isPending) {
      setBadgeId(urlBadgeId);
      verifyBadge(urlBadgeId);
    }
  }, [search, isSuccess, isPending, verifyBadge]);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeId.trim()) {
      toast.error('Please enter a badge ID');
      return;
    }
    verifyBadge(badgeId.trim());
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Verify Badge</h1>
          <p className="text-muted-foreground text-lg">
            Enter a badge ID to verify its authenticity on the blockchain
          </p>
        </div>

        {/* Verification Form */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Verification</CardTitle>
            <CardDescription>
              Enter the badge ID provided by the credential holder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="badgeId">Badge ID</Label>
                <Input
                  id="badgeId"
                  placeholder="Enter badge ID (e.g., 1, 2, 3...)"
                  value={badgeId}
                  onChange={(e) => setBadgeId(e.target.value)}
                  disabled={isPending}
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Verify Badge
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Verification Result - Success */}
        {isSuccess && badge && (
          <Card className="border-primary/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-primary">Badge Verified</CardTitle>
                  <CardDescription>This badge is authentic and verified on the blockchain</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Badge Visual */}
              <div
                className="relative h-48 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
                style={{
                  backgroundImage: 'url(/assets/generated/badge-card-bg.dim_1600x900.png)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <img
                  src="/assets/generated/badge-icons-set.dim_1024x1024.png"
                  alt={badge.skillName}
                  className="h-24 w-24 object-contain drop-shadow-2xl"
                />
                {badge.verified && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="default" className="gap-1 bg-primary/90">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>
                )}
              </div>

              <Separator />

              {/* Badge Information */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-xl mb-1">{badge.skillName}</h3>
                  {badge.level && (
                    <Badge variant="secondary" className="mb-2">
                      {badge.level}
                    </Badge>
                  )}
                  {badge.description && (
                    <p className="text-muted-foreground">{badge.description}</p>
                  )}
                </div>

                <Separator />

                <div className="grid gap-3">
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground font-medium">Badge ID:</span>
                    <span className="font-mono text-sm">{badge.id.toString()}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground font-medium">Issue Date:</span>
                    <span className="text-sm">{formatTimestamp(badge.issueTimestamp)}</span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground font-medium">Owner:</span>
                    <button
                      onClick={() => copyToClipboard(badge.owner.toString(), 'Owner Principal')}
                      className="font-mono text-sm hover:text-primary transition-colors flex items-center gap-1 text-right"
                    >
                      {formatPrincipal(badge.owner.toString())}
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground font-medium">Issuer:</span>
                    <button
                      onClick={() => copyToClipboard(badge.issuer.toString(), 'Issuer Principal')}
                      className="font-mono text-sm hover:text-primary transition-colors flex items-center gap-1 text-right"
                    >
                      {formatPrincipal(badge.issuer.toString())}
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Result - Not Found */}
        {isSuccess && !badge && (
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-destructive">Badge Not Found</CardTitle>
                  <CardDescription>
                    No badge exists with ID "{badgeId}". Please verify the ID and try again.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Verification Result - Error */}
        {isError && (
          <Card className="border-destructive/50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-destructive">Verification Failed</CardTitle>
                  <CardDescription>
                    Unable to verify the badge. Please check the badge ID and try again.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  );
}

