import type { CustomerInfoInterface } from '../interfaces/customerInfo';
import type {
  OrderInterface,
  OrderPayloadSourcesInterface,
} from '../interfaces/order';

// The only customer details an order keeps
const CONTACT_FIELDS = [
  'email',
  'firstName',
  'lastName',
  'phoneNumber',
  'address',
  'city',
  'country',
] as const;

const pickContactDetails = (
  source?: CustomerInfoInterface | null,
): CustomerInfoInterface =>
  CONTACT_FIELDS.reduce<CustomerInfoInterface>((details, field) => {
    const value = source?.[field];
    return value === undefined ? details : { ...details, [field]: value };
  }, {});

/**
 * Reads the details saved by the checkout step. Returns null when there are
 * none or the stored value isn't valid JSON, so a bad value never blocks checkout.
 */
export const parseCheckoutInfo = (
  raw: string | null,
): CustomerInfoInterface | null => {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
};

/**
 * Builds the order from what the customer entered during this checkout.
 * Contact details: saved details < checkout step. Card: only the cardholder
 * name and the last 4 digits from the payment form, never the full number or CVV.
 */
export const buildOrderPayload = ({
  customerInfo,
  checkoutInfo,
  paymentForm,
  userId,
  items,
}: OrderPayloadSourcesInterface): OrderInterface => ({
  ...pickContactDetails(customerInfo),
  ...pickContactDetails(checkoutInfo),
  cardholderName: paymentForm.name,
  cardLast4: paymentForm.cardNumber.replace(/\D/g, '').slice(-4),
  userId,
  items,
});
