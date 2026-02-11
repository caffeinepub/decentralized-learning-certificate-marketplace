import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetBadgeById } from '../hooks/useBadges';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { formatTimestamp, formatPrincipal } from '../utils/format';
import { ArrowLeft, CheckCircle2, Copy, ExternalLink, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BadgeDetailPage() {
  const { badgeId } = useParams({ from: '/badge/$badgeId' });
  const navigate = useNavigate();
  const { data: badge, isLoading } = useGetBadgeById(badgeId);

  const verificationUrl = `${window.location.origin}/#/verify?badgeId=${badgeId}`;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-10 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  if (!badge) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="text-center py-12">
              <CardTitle>Badge Not Found</CardTitle>
              <CardDescription>The badge you're looking for doesn't exist.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate({ to: '/portfolio' })}>Back to Portfolio</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate({ to: '/portfolio' })} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Portfolio
        </Button>

        {/* Badge Detail Card */}
        <Card>
          <CardHeader className="space-y-6">
            {/* Badge Visual */}
            <div
              className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center"
              style={{
                backgroundImage: 'url(/assets/generated/badge-card-bg.dim_1600x900.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <img
                src="/assets/generated/badge-icons-set.dim_1024x1024.png"
                alt={badge.skillName}
                className="h-32 w-32 object-contain drop-shadow-2xl"
              />
              {badge.verified && (
                <div className="absolute top-4 right-4">
                  <Badge variant="default" className="gap-1 text-base px-3 py-1 bg-primary/90">
                    <CheckCircle2 className="h-4 w-4" />
                    Verified
                  </Badge>
                </div>
              )}
            </div>

            {/* Badge Title */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-3xl">{badge.skillName}</CardTitle>
                {badge.level && (
                  <Badge variant="secondary" className="text-sm">
                    {badge.level}
                  </Badge>
                )}
              </div>
              {badge.description && (
                <CardDescription className="text-base">{badge.description}</CardDescription>
              )}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Separator />

            {/* Badge Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Badge Details</h3>
              <div className="grid gap-3">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Badge ID:</span>
                  <span className="font-mono text-sm">{badge.id.toString()}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Issued:</span>
                  <span className="text-sm">{formatTimestamp(badge.issueTimestamp)}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Owner:</span>
                  <button
                    onClick={() => copyToClipboard(badge.owner.toString(), 'Owner Principal')}
                    className="font-mono text-sm hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {formatPrincipal(badge.owner.toString())}
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Issuer:</span>
                  <button
                    onClick={() => copyToClipboard(badge.issuer.toString(), 'Issuer Principal')}
                    className="font-mono text-sm hover:text-primary transition-colors flex items-center gap-1"
                  >
                    {formatPrincipal(badge.issuer.toString())}
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>

            <Separator />

            {/* Share & Verify */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Share & Verify</h3>
              <p className="text-sm text-muted-foreground">
                Share this verification link with employers to prove your credential authenticity.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => copyToClipboard(verificationUrl, 'Verification link')}
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => window.open(verificationUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Verification
                </Button>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-mono break-all">{verificationUrl}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

