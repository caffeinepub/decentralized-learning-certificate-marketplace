import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type Principal } from '@dfinity/principal';
import { type BadgeId } from '../backend';

interface IssueBadgeParams {
  owner: Principal;
  skillName: string;
  description: string | null;
  level: string | null;
}

export function useIssueBadge() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<BadgeId, Error, IssueBadgeParams>({
    mutationFn: async ({ owner, skillName, description, level }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.issueBadge(owner, skillName, description, level);
    },
    onSuccess: () => {
      // Invalidate badge queries so students see newly minted badges
      queryClient.invalidateQueries({ queryKey: ['callerBadges'] });
      queryClient.invalidateQueries({ queryKey: ['badge'] });
    },
  });
}

