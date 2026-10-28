import { ShoppingCart } from 'lucide-react';
import { forwardRef, memo } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useGetUserCart } from '../../apis/user-cart';
import Button from '../common/Button';

const CartButton = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  // DrawerTrigger asChild clones its child and injects things like onClick, role, aria - expanded, and ref.
  // If your component doesn’t accept / pass these props → the trigger is broken.
  // forwardRef + spreading ...props ensures your button behaves just like a normal<button>, so the drawer opens.
  const { user } = useAuth();
  const { data: userCart } = useGetUserCart(Number(user?.id), !!user?.id);

  const cartCount = userCart?.length || 0;

  return (
    <Button
      ref={ref}
      aria-label="Cart"
      className={`relative w-16 h-16 [&_svg:not([class*='size-'])]:size-6 p-5 mr-5 bg-app-secondary rounded-full hover:bg-gray-200 transition ${className ?? ''}`}
      {...props}
    >
      <ShoppingCart className="w-6 h-6 text-app-primary" />
      {cartCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Button>
  );
});

// When you wrap a component with forwardRef, React changes its default displayName to just "ForwardRef".
// Without setting displayName, if you inspect it in React DevTools, it will show as <ForwardRef>

CartButton.displayName = 'CartButton';

export default memo(CartButton);
