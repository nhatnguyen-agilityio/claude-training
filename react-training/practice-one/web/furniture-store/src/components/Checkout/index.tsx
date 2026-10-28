import { object, string } from 'zod';
import type { infer as zodInfer } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';

const checkoutFormSchema = object({
  email: string()
    .email({ message: 'Invalid email address' })
    .min(1, { message: 'Email is required' }),
  firstName: string()
    .trim()
    .min(1, { message: 'First name is required' })
    .max(50, { message: 'First name must be at most 50 characters' })
    .regex(/^[a-zA-ZÀ-ỹ' -]+$/, {
      message:
        'First name can only contain letters, spaces, apostrophes, or hyphens',
    }),
  lastName: string()
    .trim()
    .min(1, { message: 'Last name is required' })
    .max(50, { message: 'Last name must be at most 50 characters' })
    .regex(/^[a-zA-ZÀ-ỹ' -]+$/, {
      message:
        'Last name can only contain letters, spaces, apostrophes, or hyphens',
    }),
  phoneNumber: string()
    .trim()
    .min(1, { message: 'Phone number is required' })
    .regex(/^\+?[0-9]{8,15}$/, {
      message: 'Phone number must be 8–15 digits and may start with +',
    }),
  address: string()
    .trim()
    .min(1, { message: 'Address is required' })
    .max(200, { message: 'Address must be at most 200 characters' })
    .regex(/^[a-zA-Z0-9À-ỹ\s,.'-/#]+$/, {
      message: 'Address contains invalid characters',
    }),
  city: string()
    .trim()
    .min(1, { message: 'City is required' })
    .max(100, { message: 'City must be at most 100 characters' })
    .regex(/^[a-zA-ZÀ-ỹ\s.'-]+$/, {
      message: 'City can only contain letters, spaces, apostrophes, or hyphens',
    }),
  country: string()
    .trim()
    .min(1, { message: 'Country is required' })
    .max(100, { message: 'Country must be at most 100 characters' })
    .regex(/^[a-zA-ZÀ-ỹ\s.'-]+$/, {
      message:
        'Country can only contain letters, spaces, apostrophes, or hyphens',
    }),
});

const Checkout = ({ onNext }: { onNext: () => void; onLogin: () => void }) => {
  const { customerInfo } = useAuth();

  const form = useForm<zodInfer<typeof checkoutFormSchema>>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: customerInfo?.email || '',
      firstName: customerInfo?.firstName || '',
      lastName: customerInfo?.lastName || '',
      phoneNumber: customerInfo?.phoneNumber || '',
      address: customerInfo?.address || '',
      city: customerInfo?.city || '',
      country: customerInfo?.country || '',
    },
  });

  const onSubmit = (data: zodInfer<typeof checkoutFormSchema>) => {
    localStorage.setItem('checkout', JSON.stringify(data));
    onNext();
  };

  return (
    <>
      <div className="px-5 flex flex-col items-start md:w-3/5 mx-auto lg:px-7">
        <p className="text-lg font-semibold text-body-sub">
          Customer Information
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="px-2 lg:px-7 md:w-3/5 md:mx-auto ml-3 mr-4 mt-6">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Email"
                      className="pl-5 h-15 rounded-3xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className="text-lg font-semibold mt-3 text-body-sub mb-4">
              Shipping Address
            </p>
            <FormField
              name="firstName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      className="pl-5 h-15 rounded-3xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastName"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormControl>
                    <Input
                      placeholder="Last Name"
                      className="pl-5 h-15 rounded-3xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Phone Number"
                      className="pl-5 h-15 rounded-3xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="address"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormControl>
                    <Input
                      placeholder="Address"
                      className="pl-5 h-15 rounded-3xl"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="City"
                        className="pl-5 h-15 rounded-3xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="country"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Country"
                        className="pl-5 h-15 rounded-3xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="fixed bottom-0 left-0 right-0">
            <Button
              type="submit"
              className="w-full h-14 bg-app-primary rounded-none text-white text-lg font-semibold hover:bg-app-tertiary"
            >
              Proceed to payment
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default Checkout;
