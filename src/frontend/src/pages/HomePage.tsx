import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Shield, Wallet } from 'lucide-react';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Decentralized Learning Certificate Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Earn, verify, and showcase blockchain-based skill badges. Build your professional portfolio with verifiable credentials.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Award className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Skill NFTs</CardTitle>
              <CardDescription>
                Earn blockchain-verified skill badges that prove your expertise
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Shield className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Employer Verification</CardTitle>
              <CardDescription>
                Employers can instantly verify the authenticity of your credentials
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Wallet className="h-10 w-10 text-primary mb-2" />
              <CardTitle>Portfolio Wallet</CardTitle>
              <CardDescription>
                Manage and share your skill badges in one secure location
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isAuthenticated ? (
            <>
              <Button size="lg" onClick={() => navigate({ to: '/portfolio' })}>
                View My Portfolio
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate({ to: '/verify' })}>
                Verify a Badge
              </Button>
            </>
          ) : (
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">Sign in to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

