import notFoundImage from '../../assets/images/not-found.png';
import Image from '../common/Image';
import { NavLink } from 'react-router-dom';
import Button from '../common/Button';

const NotFound = () => {
  return (
    <div className="mt-4 md:mt-10 flex flex-col items-center justify-center min-h-180">
      <h2 className="text-4xl md:text-6xl">OOPs</h2>
      <Image src={notFoundImage} alt="Not Found" className="w-100 h-auto" />
      <p className="text-4xl md:text-6xl">404 - Page Not Found</p>
      <NavLink to="/">
        <Button
          variant="ghost"
          className="w-35 h-12 mt-10 text-xl text-black font-medium rounded-3xl border-1"
        >
          Home
        </Button>
      </NavLink>
    </div>
  );
};

export default NotFound;
