import { MoveRight } from 'lucide-react';
import { forwardRef } from 'react';
import Button from '../common/Button';

const GetStarted = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  // DrawerTrigger asChild clones its child and injects things like onClick, role, aria - expanded, and ref.
  // If your component doesn’t accept / pass these props → the trigger is broken.
  // forwardRef + spreading ...props ensures your button behaves just like a normal<button>, so the drawer opens.

  return (
    <Button
      ref={ref}
      className={`bg-app-primary px-7 w-44 py-4 h-auto text-white flex items-center text-base font-semibold rounded-4xl hover:bg-app-tertiary [text-shadow:0_1px_2px_rgba(0,0,0,0.6)] ${className ?? ''}`}
      {...props}
    >
      Get Started
      <MoveRight className="inline-block w-4 h-4 ml-4 font-semibold" />
    </Button>
  );
});

// When you wrap a component with forwardRef, React changes its default displayName to just "ForwardRef".
// Without setting displayName, if you inspect it in React DevTools, it will show as <ForwardRef>
GetStarted.displayName = 'GetStarted';

export default GetStarted;
