import { object, string, boolean } from 'zod';
import type { infer as zodInfer } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import Button from '../common/Button';
import Image from '../common/Image';
import { Checkbox } from '../ui/checkbox';
import { useSignUp } from '../../apis/signup';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const loginFormSchema = object({
  username: string()
    .min(8, { message: 'Username must be at least 8 characters.' })
    .max(20, { message: 'Username must be at most 20 characters.' })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d._@-]{2,20}$/,
      'Username must include letters, numbers, and may contain . _ @ -',
    ),
  password: string()
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[._@#$%^&*!?])[A-Za-z\d._@#$%^&*!?]{8,}$/,
      'Password must include uppercase, lowercase, number, and special character',
    ),
  acceptTerms: boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions.',
  }),
});

const SignUp = ({ onNext }: { onNext: () => void }) => {
  const form = useForm<zodInfer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
      acceptTerms: false,
    },
  });

  const { mutate, isLoading } = useSignUp();

  const handleSubmit = (data: zodInfer<typeof loginFormSchema>) => {
    const { username, password } = data;

    mutate(
      { username, password },
      {
        onSuccess: () => {
          toast(
            '🎉 Account created successfully. Please login to continue.',
            {},
          );
          onNext();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="w-full md:w-1/2 md:mx-auto lg:w-3/5">
      <div className=" w-1/3 mx-auto">
        <Image
          src="https://ucarecdn.com/093e2ab7-3038-4752-9691-833462c4116b/-/format/auto/"
          alt="Accessories"
        />
      </div>
      <p className="mt-4 text-center md:text-left md:ml-3 md:text-2xl text-lg font-semibold">
        Let's get your account set up
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
                  <div className="min-h-5">
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
            <FormField
              name="acceptTerms"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-start space-x-4 mt-2">
                    <FormControl>
                      <Checkbox
                        id="acceptTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        ref={field.ref}
                        name={field.name}
                        className="mt-1 h-6 w-6 aria-[invalid=true]:border-input aria-[invalid=true]:ring-0"
                      />
                    </FormControl>
                    <FormLabel
                      htmlFor="acceptTerms"
                      className="text-base/6 font-light text-lef !text-inherit"
                    >
                      <p>
                        I agree to the{' '}
                        <span
                          className="underline underline-offset-1 hover:text-app-tertiary cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toast.error(
                              'Terms and Conditions is not available yet.',
                            );
                          }}
                        >
                          Terms and Conditions
                        </span>{' '}
                        of Furniture and acknowledge the{' '}
                        <span
                          className="underline underline-offset-1 hover:text-app-tertiary cursor-pointer"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toast.error('Privacy Policy is not available yet.');
                          }}
                        >
                          Privacy Policy
                        </span>
                      </p>
                    </FormLabel>
                  </div>
                  <div className="min-h-5">
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-start mt-6">
              <Button
                type="submit"
                className="bg-app-primary w-full h-15 rounded-3xl text-base font-semibold hover:bg-app-tertiary"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  'Create account'
                )}
              </Button>
            </div>
          </form>
        </Form>
        <p className="text-center mt-6 text-lg font-normal">
          Already have an account?{' '}
          <span
            onClick={onNext}
            className="text-app-primary hover:underline hover:underline-offset-1"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
