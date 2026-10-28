import { cva } from 'class-variance-authority';
import { Button as ButtonUI } from '../../ui/button';

const buttonVariants = cva('cursor-pointer flex items-center font-semibold', {
  variants: {
    variant: {
      primary: 'bg-app-primary text-white hover:bg-app-tertiary',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      outline:
        'border border-app-primary text-app-primary hover:bg-app-primary hover:text-white',
      ghost: 'bg-transparent text-gray-600 hover:bg-gray-300 text-black',
    },
    size: {
      default: 'px-7 py-4 h-auto text-base rounded-4xl',
      sm: 'px-4 py-2 h-8 text-sm rounded-md',
      lg: 'px-6 py-3 h-10 text-lg rounded-md',
      icon: 'p-2 h-10 w-10 rounded-full',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <ButtonUI
      className={`${buttonVariants({ variant, size })} ${className || ''} cursor-pointer`}
      {...props}
    />
  );
};

export default Button;
