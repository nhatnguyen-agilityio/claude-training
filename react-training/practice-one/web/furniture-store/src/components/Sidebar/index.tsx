import Button from '../common/Button';
import { X as Cancel } from 'lucide-react';
import { type ReactElement, type ReactNode } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '../ui/drawer';

const Sidebar = ({
  button,
  children,
  title,
  open,
  onOpenChange,
}: {
  button?: ReactElement;
  children: ReactNode;
  title?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {button && <DrawerTrigger asChild>{button}</DrawerTrigger>}
      <DrawerContent
        data-vaul-drawer-direction="right"
        className="w-full lg:w-1/3 border-none overflow-y-auto overflow-x-hidden max-h-screen"
      >
        <div className="mx-auto w-full">
          <DrawerHeader className="!flex-row relative !items-center !justify-center my-5">
            <DrawerClose asChild>
              <Button
                variant={'ghost'}
                size={'icon'}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-11 w-11 bg-background-primary rounded-full"
              >
                <Cancel />
              </Button>
            </DrawerClose>
            <DrawerTitle className="text-center text-xl font-semibold">
              {title}
            </DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
