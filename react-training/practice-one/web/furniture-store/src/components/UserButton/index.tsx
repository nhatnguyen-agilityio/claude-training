import { CircleUser, LogOut } from 'lucide-react';
import Button from '../common/Button';
import { useAuth } from '../../hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
} from '../ui/dropdown-menu';

const UserButton = () => {
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className={`w-16 h-16 [&_svg:not([class*='size-'])]:size-7 bg-app-secondary rounded-full hover:bg-gray-200 transition`}
          aria-label="User"
        >
          <CircleUser className="text-app-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 border-background-primary"
        align="start"
      >
        <DropdownMenuGroup className="ml-2">
          <DropdownMenuItem
            className="flex justify-between"
            onClick={logout}
            aria-label="Logout"
          >
            Logout
            <LogOut />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
