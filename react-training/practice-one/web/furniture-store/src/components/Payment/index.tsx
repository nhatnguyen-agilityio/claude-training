import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { object, string, boolean } from 'zod';
import type { infer as zodInfer } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import { useAddPayment } from '../../apis/add-payment';
import { useGetUserCart } from '../../apis/user-cart';
import type { CartInterface } from '../../interfaces/cart';
import { useAddOrder } from '../../apis/add-order';
import { useDeleteCart } from '../../apis/delete-cart';
import { useGetPayment } from '../../apis/get-payment';
import { useUpdatePayment } from '../../apis/update-payment';
import { useUpdateStock } from '../../apis/update-stock';

const cardNumberCheck = (cardNumber: string) => {
  let sum = 0;
  let shouldDouble = false;

  // ex: 378282246310005

  // Remove spaces/dashes
  const digits = cardNumber.replace(/[\s-]/g, '');

  // Process digits from right to left
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  return sum % 10 === 0;
};

const paymentFormSchema = object({
  name: string()
    .min(2, { message: 'Cardholder name is required' })
    .max(100, { message: 'Name must be at most 100 characters' })
    .regex(/^[A-Za-z\s]+$/, {
      message: 'Name can only contain letters and spaces',
    }),

  cardNumber: string()
    .min(13, { message: 'Card number must be at least 13 digits' })
    .max(19, { message: 'Card number must be at most 19 digits' })
    .regex(/^[0-9\s-]+$/, {
      message: 'Card number can only contain digits, spaces, or dashes',
    })
    .refine((val) => cardNumberCheck(val), {
      message: 'Invalid card number',
    }),

  cvv: string().regex(/^[0-9]{3,4}$/, { message: 'CVV must be 3 or 4 digits' }),

  expirationDate: string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2}|[0-9]{4})$/, {
      message: 'Expiration date must be MM/YY or MM/YYYY',
    })
    .refine(
      (date) => {
        const [month, year] = date.split('/');
        if (!month || !year) return false;

        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const expMonth = parseInt(month, 10);
        const expYear =
          year.length === 2 ? 2000 + parseInt(year, 10) : parseInt(year, 10);

        return (
          expYear > currentYear ||
          (expYear === currentYear && expMonth >= currentMonth)
        );
      },
      { message: 'Card has expired' },
    ),
  useShippingAddress: boolean(),
  rememberMe: boolean(),
});

const Payment = ({ onNext }: { onNext: () => void }) => {
  const { user, customerInfo, removeCustomerInfo, setCustomerInfo } = useAuth();

  const form = useForm<zodInfer<typeof paymentFormSchema>>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      name: customerInfo?.name || '',
      cardNumber: customerInfo?.cardNumber || '',
      cvv: customerInfo?.cvv || '',
      expirationDate: customerInfo?.expirationDate || '',
      useShippingAddress: false,
      rememberMe: false,
    },
  });

  const { mutate: addPayment } = useAddPayment();
  const { mutate: updatePayment } = useUpdatePayment();
  const { mutate: addOrder } = useAddOrder();
  const { mutate: deleteCart } = useDeleteCart();
  const { mutate: updateStock } = useUpdateStock();

  const { data: userCart } = useGetUserCart(Number(user?.id), !!user?.id);
  const { data: payment } = useGetPayment(Number(user?.id), !!user?.id);

  const handleSubmit = (data: zodInfer<typeof paymentFormSchema>) => {
    if (data.rememberMe && user) {
      let paymentPayload = { ...customerInfo, ...data, userId: user.id };

      const checkoutInformation = localStorage.getItem('checkout');
      if (checkoutInformation) {
        paymentPayload = {
          ...paymentPayload,
          ...JSON.parse(checkoutInformation),
        };
      }
      if (payment && payment.length > 0) {
        updatePayment(
          { paymentId: payment[0].id, paymentPayload },
          {
            onSuccess: (data) => {
              removeCustomerInfo();
              setCustomerInfo(data);
            },
          },
        );
      } else {
        addPayment(paymentPayload, {
          onSuccess: (data) => {
            removeCustomerInfo();
            setCustomerInfo(data);
          },
        });
      }
      localStorage.removeItem('checkout');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...customerPayload } = customerInfo || {};
    const orderPayload = {
      ...customerPayload,
      userId: user?.id,
      items: userCart?.flatMap((cart: CartInterface) => cart.item) || [],
    };
    addOrder(orderPayload, {
      onSuccess: () => {
        // Update stock inventory by reducing stock for each ordered item
        const stockUpdates =
          userCart?.flatMap((cart: CartInterface) => ({
            variantId: cart.item.variantId,
            quantity: cart.item.quantity,
          })) || [];

        if (stockUpdates.length > 0) {
          updateStock({ items: stockUpdates });
        }

        deleteCart({ userId: String(user?.id) });
        onNext();
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="px-2 lg:px-7 md:w-3/5 md:mx-auto ml-3 mr-4 mt-6">
          <FormField
            name="cardNumber"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormControl>
                  <Input
                    className="pl-5 h-15 rounded-3xl"
                    type="number"
                    placeholder="Card number"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-4 mb-5">
            <FormField
              name="expirationDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="pl-5 h-15 rounded-3xl"
                      type="text"
                      placeholder="Expiration date"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="cvv"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="pl-5 h-15 rounded-3xl"
                      type="number"
                      placeholder="CVV"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormControl>
                  <Input
                    className="pl-5 h-15 rounded-3xl"
                    type="text"
                    placeholder="Cardholder name"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="useShippingAddress"
            control={form.control}
            render={({ field }) => (
              <FormItem className="mb-5 flex items-center">
                <FormControl>
                  <Checkbox
                    id="useShippingAddress"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    ref={field.ref}
                    className="data-[state=checked]:bg-app-primary data-[state=checked]:opacity-30"
                  />
                </FormControl>
                <FormLabel
                  htmlFor="useShippingAddress"
                  className="text-base/6 font-light text-lef !text-inherit"
                >
                  Use shipping address as billing address
                </FormLabel>
              </FormItem>
            )}
          />
          <div className="mr-15 mt-10">
            <p className="mb-3 text-xl text-body-sub">Remember me</p>
            <FormField
              name="rememberMe"
              control={form.control}
              render={({ field }) => (
                <FormItem className="mb-5 flex items-center">
                  <FormControl>
                    <Checkbox
                      id="rememberMe"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      ref={field.ref}
                      className="data-[state=checked]:bg-app-primary data-[state=checked]:opacity-30"
                    />
                  </FormControl>
                  <FormLabel
                    htmlFor="rememberMe"
                    className="text-base/6 font-light text-lef !text-inherit"
                  >
                    Save my information for faster checkout
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          <div className="fixed bottom-0 left-0 right-0">
            <Button
              type="submit"
              className="w-full h-14 bg-app-primary rounded-none text-white text-lg font-semibold hover:bg-app-tertiary"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? 'Processing...' : 'Pay Now'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default Payment;
