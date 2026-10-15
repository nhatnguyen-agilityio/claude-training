import { object, string } from 'zod';
import type { infer as zodInfer } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from '../common/Image';
import Button from '../common/Button';

import GoogleLogo from '../../assets/images/google_logo.svg';
import AppleLogo from '../../assets/images/apple_logo.svg';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { useState } from 'react';
import { useLogin } from '../../apis/login';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

const loginFormSchema = object({
  username: string()
    .min(8, {
      message: 'Username must be at least 8 characters.',
    })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d._@-]{2,20}$/,
      'Username must include letters and numbers',
    ),
  password: string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[._@#$%^&*!?])[A-Za-z\d._@#$%^&*!?]{8,}$/,
      'Password must include uppercase, lowercase, number, and special character',
    ),
});

const Login = ({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const { setUser } = useAuth();
  const form = useForm<zodInfer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { mutate, isLoading, error } = useLogin();

  const handleSubmit = (data: zodInfer<typeof loginFormSchema>) => {
    mutate(data, {
      onSuccess: (data) => {
        setUser(data.user);
        onBack();
      },
      onError: () => {
        setOpen(true);
      },
    });
  };

  return (
    <>
      <div className="w-full md:w-1/2 md:mx-auto lg:w-3/5">
        <div className=" w-1/3 mx-auto">
          <Image
            src="https://ucarecdn.com/e0cf545f-60e1-4fb0-bf22-e22c6198b08d/-/format/auto/"
            alt="Accessories"
          />
        </div>
        <p className="mt-4 text-center md:text-left md:ml-3 md:text-2xl text-lg font-semibold">
          Welcome back
        </p>
        <div className="ml-3 mr-4 mt-7">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-1">
                    <div className="relative">
                      <FormControl>
                        <Input
                          id="username"
                          {...field}
                          className="pl-5 h-15 rounded-3xl"
                          placeholder="Username"
                        />
                      </FormControl>
                    </div>
                    <div className="min-h-5 py-2">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="mb-1">
                    <div className="relative">
                      <FormControl>
                        <Input
                          id="password"
                          {...field}
                          type="password"
                          className="pl-5 h-15 rounded-3xl"
                          placeholder="Password"
                        />
                      </FormControl>
                    </div>
                    <div className="min-h-5">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <p
                className="text-app-tertiary font-semibold hover:underline hover:underline-offset-1 text-right mr-2"
                onClick={() => {
                  toast.error(
                    'Forgot password is not available yet. Please contact support to reset your password.',
                  );
                }}
              >
                Forgot password?
              </p>
              <div className="flex justify-start mt-4">
                <Button
                  type="submit"
                  className="bg-app-primary w-full h-15 rounded-3xl text-base font-semibold hover:bg-app-tertiary"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Logging in...
                    </span>
                  ) : (
                    'Login'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
        <div className="flex items-center w-full my-6">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-4 text-gray-500 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div className="flex flex-col gap-6 ml-3 mr-4">
          <Button
            variant={'ghost'}
            className="border-1 rounded-3xl py-3 font-semibold hover:bg-gray-100"
            onClick={() => {
              toast.error(
                'Google login is not available yet. Please use email/password to login.',
              );
            }}
          >
            <Image src={GoogleLogo} alt="Google Logo" className="w-6 h-6" />
            Continue with Google
          </Button>
          <Button
            variant={'ghost'}
            className="border-1 rounded-3xl py-3 font-semibold hover:bg-gray-100"
            onClick={() => {
              toast.error(
                'Apple login is not available yet. Please use email/password to login.',
              );
            }}
          >
            <Image src={AppleLogo} alt="Apple Logo" className="w-6 h-6" />
            Continue with Apple
          </Button>
        </div>
        <p className="text-center mt-6 text-lg font-normal">
          First time here?{' '}
          <span
            onClick={onNext}
            className="text-app-primary hover:underline hover:underline-offset-1"
          >
            Create an account
          </span>
        </p>
      </div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Error</AlertDialogTitle>
            <AlertDialogDescription>{error || ''}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="rounded-3xl"
              onClick={() => setOpen(false)}
            >
              OK
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Login;
