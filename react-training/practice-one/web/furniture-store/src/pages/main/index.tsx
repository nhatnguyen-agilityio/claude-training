import { AlignJustify } from 'lucide-react';
import { Toaster } from '../../components/ui/sonner';
import Image from '../../components/common/Image';
import GetStarted from '../../components/GetStarted';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Link, Outlet } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useState, Suspense } from 'react';
import { useAuth } from '../../hooks/useAuth';
import SiteMetadata from '../../components/SiteMetadata';
import UserButton from '../../components/UserButton';
import CartButton from '../../components/CartButton';
import MobileSidebar from '../../components/MobileSidebar';
import Loading from '../../components/Loading';
import Login from '../../components/Login';
import Cart from '../../components/Cart';
import Checkout from '../../components/Checkout';
import Payment from '../../components/Payment';
import OrderSuccess from '../../components/OrderSuccess';
import SignUp from '../../components/SignUp';

const Main = () => {
  const [step, setStep] = useState<
    | 'closed'
    | 'cart'
    | 'checkout'
    | 'payment'
    | 'orderSuccess'
    | 'login'
    | 'signup'
    | 'mobileSidebar'
  >('closed');

  const { user } = useAuth();

  return (
    <>
      <SiteMetadata />
      <header className="flex justify-between items-center container">
        <h1>
          <Link to="/">
            <Image
              src="https://ucarecdn.com/1394912f-7999-4eae-ad41-8f21805d50bd/-/format/auto/"
              alt="logo"
            />
          </Link>
        </h1>
        <div className="hidden lg:block">
          <Navbar />
        </div>
        <div className="hidden lg:flex">
          <Sidebar
            open={step !== 'closed'}
            onOpenChange={(open) => {
              if (!open) setStep('closed');
            }}
            button={
              <nav className="flex items-center" aria-label="User actions">
                {user && (
                  <CartButton
                    onClick={(e) => {
                      e.preventDefault();
                      setStep('cart');
                    }}
                  />
                )}
                {user ? (
                  <UserButton />
                ) : (
                  <GetStarted
                    onClick={(e) => {
                      e.preventDefault();
                      setStep('login');
                    }}
                  />
                )}
              </nav>
            }
            title={
              step === 'cart'
                ? 'Cart'
                : step === 'checkout'
                  ? 'Checkout'
                  : step === 'payment'
                    ? 'Payment'
                    : ''
            }
          >
            <Suspense fallback={<Loading />}>
              {step === 'cart' && (
                <Cart
                  onNext={() => setStep('checkout')}
                  onLogin={() => setStep('login')}
                />
              )}
              {step === 'checkout' && (
                <Checkout
                  onNext={() => setStep('payment')}
                  onLogin={() => setStep('login')}
                />
              )}
              {step === 'payment' && (
                <Payment onNext={() => setStep('orderSuccess')} />
              )}
              {step === 'orderSuccess' && (
                <OrderSuccess onBack={() => setStep('closed')} />
              )}
              {step === 'login' && (
                <Login
                  onNext={() => setStep('signup')}
                  onBack={() => setStep('closed')}
                />
              )}
              {step === 'signup' && <SignUp onNext={() => setStep('login')} />}
              {step === 'mobileSidebar' && (
                <MobileSidebar
                  onClose={() => setStep('closed')}
                  onCartClick={() => setStep('cart')}
                  onLoginClick={() => setStep('login')}
                />
              )}
            </Suspense>
          </Sidebar>
        </div>
        <AlignJustify
          className="w-6 h-6 lg:hidden"
          onClick={() => setStep('mobileSidebar')}
        />
      </header>
      <Outlet />
      <Footer />
      <Toaster />
    </>
  );
};

export default Main;
