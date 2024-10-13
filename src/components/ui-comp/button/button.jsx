import { forwardRef } from 'react';
import { cn } from '../../../lib/utils';
import { buttonVariants } from './button-variants';

// eslint-disable-next-line
const Button = forwardRef(({ className, variant, onClick, size, asChild = false, ...props }, ref) => {
  return <button onClick={onClick} className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});

Button.displayName = 'Button';

export { Button };
