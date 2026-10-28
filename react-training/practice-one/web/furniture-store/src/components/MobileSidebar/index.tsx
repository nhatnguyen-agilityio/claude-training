import Navbar from '../Navbar';
import CartButton from '../CartButton';
import UserButton from '../UserButton';
import GetStarted from '../GetStarted';
import { useAuth } from '../../hooks/useAuth';

interface MobileSidebarProps {
  onClose?: () => void;
  onCartClick?: () => void;
  onLoginClick?: () => void;
}

const MobileSidebar = ({
  onClose,
  onCartClick,
  onLoginClick,
}: MobileSidebarProps) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 mb-4 border-gray-200">
        {user && (
          <CartButton
            onClick={(e) => {
              e.preventDefault();
              onCartClick?.();
            }}
          />
        )}
        {user ? (
          <UserButton />
        ) : (
          <GetStarted
            onClick={(e) => {
              e.preventDefault();
              onLoginClick?.();
            }}
          />
        )}
      </div>
      <Navbar onClose={onClose} />
    </div>
  );
};

export default MobileSidebar;
