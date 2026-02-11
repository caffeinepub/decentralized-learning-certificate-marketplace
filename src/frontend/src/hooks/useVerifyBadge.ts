import { useMutation } from '@tanstack/react-query';
import { useActor } from './useActor';
import { type SkillBadge } from '../backend';

export function useVerifyBadge() {
  const { actor } = useActor();

  return useMutation<SkillBadge | null, Error, string>({
    mutationFn: async (badgeId: string) => {
      if (!actor) throw new Error('Actor not available');
      
      try {
        const id = BigInt(badgeId);
        return await actor.verifyBadge(id);
      } catch (error) {
        throw new Error('Invalid badge ID format');
      }
    },
  });
}

