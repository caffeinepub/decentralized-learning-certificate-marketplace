import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUser';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { Award, Shield, Sparkles } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AppHeader() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const isAuthenticated = !!identity;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/generated/app-mark.dim_512x512.png"
              alt="SkillChain"
              className="h-10 w-10"
            />
            <div className="flex flex-col items-start">
              <span className="text-xl font-bold tracking-tight">SkillChain</span>
              <span className="text-xs text-muted-foreground">Verified Learning</span>
            </div>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/portfolio' })}
                  className="gap-2"
                >
                  <Award className="h-4 w-4" />
                  <span className="hidden sm:inline">My Portfolio</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/verify' })}
                  className="gap-2"
                >
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Verify Badge</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/mint' })}
                  className="gap-2"
                >
                  <Sparkles className="h-4 w-4" />
                  <span className="hidden sm:inline">Issue Badge</span>
                </Button>

                {/* User Menu */}
                {userProfile && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                        <Avatar>
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(userProfile.name)}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium">{userProfile.name}</p>
                          {userProfile.organization && (
                            <p className="text-xs text-muted-foreground">{userProfile.organization}</p>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate({ to: '/portfolio' })}>
                        My Portfolio
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate({ to: '/verify' })}>
                        Verify Badge
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}

                <LoginButton />
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/verify' })}
                  className="gap-2"
                >
                  <Shield className="h-4 w-4" />
                  Verify Badge
                </Button>
                <LoginButton />
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

