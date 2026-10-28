import Image from '../common/Image';
import Button from '../common/Button';

const OrderSuccess = ({ onBack }: { onBack: () => void }) => {
  return (
    <div className="px-2 lg:px-7 md:w-3/5 lg:w-4/5 md:mx-auto ml-3 mr-4 mt-6 flex flex-col items-center">
      <div className="w-2/5 h-2/5">
        <Image
          src="https://ucarecdn.com/e16a953e-9f0b-4842-987d-da9496c6e677/-/format/auto/"
          alt="Squircle"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="text-center mt-4">
        <p className="text-lg font-semibold mb-4 text-heading-main">
          Your Order is Confirmed!
        </p>
        <p className="text-body-sub">
          Thank you for shopping with us! Your beautiful new furniture is on its
          way and will be with you soon. Get ready to transform your space!
        </p>
      </div>
      <Button
        onClick={onBack}
        className="h-12 mt-20 w-full bg-app-primary rounded-3xl font-semibold hover:bg-app-tertiary"
      >
        Done
      </Button>
    </div>
  );
};

export default OrderSuccess;
