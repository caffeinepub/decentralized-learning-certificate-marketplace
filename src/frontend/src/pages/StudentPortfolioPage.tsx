import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerBadges } from '../hooks/useBadges';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import BadgeCard from '../components/badges/BadgeCard';
import { Award, LogIn } from 'lucide-react';

export default function StudentPortfolioPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: badges, isLoading } = useGetCallerBadges();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                Please sign in to view your skill badge portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Button onClick={() => navigate({ to: '/' })}>Go to Home</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">My Portfolio</h1>
          <p className="text-muted-foreground text-lg">
            Your verified skill badges and credentials
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && badges && badges.length === 0 && (
          <Card>
            <CardHeader className="text-center py-12">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <Award className="h-8 w-8 text-muted-foreground" />
              </div>
              <CardTitle>No Badges Yet</CardTitle>
              <CardDescription>
                You haven't earned any skill badges yet. Start learning and earning credentials!
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Badge Grid */}
        {!isLoading && badges && badges.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge) => (
              <BadgeCard key={badge.id.toString()} badge={badge} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

