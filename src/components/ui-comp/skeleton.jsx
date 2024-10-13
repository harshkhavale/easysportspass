import { cn } from '@/lib/utils';

// eslint-disable-next-line
function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-md bg-primary/10', className)} {...props} />;
}

export { Skeleton };
