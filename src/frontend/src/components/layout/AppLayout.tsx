import { Outlet } from '@tanstack/react-router';
import AppHeader from './AppHeader';
import ProfileSetupModal from '../auth/ProfileSetupModal';
import { SiCaffeine } from 'react-icons/si';
import { Heart } from 'lucide-react';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            © 2026. Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground transition-colors font-medium"
            >
              <SiCaffeine className="h-4 w-4" />
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      <ProfileSetupModal />
    </div>
  );
}

