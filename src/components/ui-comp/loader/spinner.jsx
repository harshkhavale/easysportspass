import clsx from 'clsx';
import { Loader2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

// eslint-disable-next-line
export const Icons = {
  spinner: Loader2,
};

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// eslint-disable-next-line
const Spinner = ({ className }) => {
  return <Icons.spinner className={cn(`h-[1.25rem] w-[1.25rem] animate-spin`, className)} />;
};

export default Spinner;
