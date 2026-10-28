import { memo } from 'react';
import { NavLink } from 'react-router-dom';

interface NavbarProps {
  onClose?: () => void;
}

const Navbar = ({ onClose }: NavbarProps) => {
  return (
    <ul className="flex items-center flex-col md:flex-row w-full">
      <li className="lg:py-0 bg-gray-50 lg:bg-transparent w-full pl-3 lg:pl-0 border-b lg:border-b-0 border-gray-200 text-center">
        <NavLink
          to="/"
          className="block w-full h-full p-4 hover:bg-gray-300"
          onClick={onClose}
        >
          Home
        </NavLink>
      </li>
      <li className="lg:py-0 bg-gray-50 lg:bg-transparent w-full pl-3 lg:pl-0 border-b lg:border-b-0 border-gray-200 text-center">
        <NavLink
          to="/products"
          className="block w-full h-full p-4 hover:bg-gray-300"
          onClick={onClose}
        >
          Shop
        </NavLink>
      </li>
      <li className="lg:py-0 bg-gray-50 lg:bg-transparent w-full pl-3 lg:pl-0 border-b lg:border-b-0 border-gray-200 text-center">
        <NavLink
          to="/products"
          className="block w-full h-full p-4 hover:bg-gray-300"
          onClick={onClose}
        >
          Categories
        </NavLink>
      </li>
      <li className="lg:py-0 bg-gray-50 lg:bg-transparent w-full pl-3 lg:pl-0 border-b lg:border-b-0 border-gray-200 text-center">
        <NavLink
          to="/products"
          className="block w-full h-full p-4 hover:bg-gray-300"
          onClick={onClose}
        >
          Blog
        </NavLink>
      </li>
    </ul>
  );
};

export default memo(Navbar);
