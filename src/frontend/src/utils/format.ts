import { type Principal } from '@dfinity/principal';

/**
 * Format a timestamp (nanoseconds) to a human-readable date string
 */
export function formatTimestamp(timestamp: bigint): string {
  const milliseconds = Number(timestamp / BigInt(1_000_000));
  const date = new Date(milliseconds);
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format a Principal to a shortened, human-friendly display
 */
export function formatPrincipal(principal: string): string {
  if (principal.length <= 16) return principal;
  return `${principal.slice(0, 8)}...${principal.slice(-6)}`;
}

/**
 * Format a badge ID for display
 */
export function formatBadgeId(badgeId: bigint): string {
  return `#${badgeId.toString()}`;
}

