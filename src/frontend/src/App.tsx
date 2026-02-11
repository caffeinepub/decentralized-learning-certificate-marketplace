import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import StudentPortfolioPage from './pages/StudentPortfolioPage';
import BadgeDetailPage from './pages/BadgeDetailPage';
import EmployerVerificationPage from './pages/EmployerVerificationPage';
import IssuerMintPage from './pages/IssuerMintPage';
import HomePage from './pages/HomePage';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const portfolioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/portfolio',
  component: StudentPortfolioPage,
});

const badgeDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/badge/$badgeId',
  component: BadgeDetailPage,
});

const verifyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/verify',
  component: EmployerVerificationPage,
});

const mintRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/mint',
  component: IssuerMintPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  portfolioRoute,
  badgeDetailRoute,
  verifyRoute,
  mintRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

