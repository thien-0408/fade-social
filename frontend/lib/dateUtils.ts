export function formatLastActive(lastActiveAt: string | null | undefined): string {
  if (!lastActiveAt) return 'Offline';

  const date = new Date(lastActiveAt);
  const now = new Date();
  
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  
  if (diffInMinutes < 2) {
    return 'Online';
  } else if (diffInMinutes < 60) {
    return `Active ${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) { // less than 24 hours
    const hours = Math.floor(diffInMinutes / 60);
    return `Active ${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `Active ${days}d ago`;
  }
}

export function isOnline(lastActiveAt: string | null | undefined): boolean {
  if (!lastActiveAt) return false;
  const date = new Date(lastActiveAt);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  return diffInMinutes < 2;
}
