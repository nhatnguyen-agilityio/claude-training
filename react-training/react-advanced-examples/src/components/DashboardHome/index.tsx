import { useAuth } from "@/Hooks/Auth";
import Image from "../common/Image";

import InviteImage from "@/assets/Invite.png"
import { Hand, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToDoTask from "../ToDoTask";
import TaskStatus from "../TaskStatus";
import CompletedTask from "../CompletedTask";

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <>
      <div className="mb-8 flex justify-between">
        <h5 className="flex">Welcome back, {user?.username} <Hand className="ml-2 text-yellow-300" /></h5>
        <div className="flex items-center">
          <div className="flex mr-5">
            <Image src={InviteImage} alt="Invite" className="mr-2" />
            <Image src={InviteImage} alt="Invite" className="mr-2" />
            <Image src={InviteImage} alt="Invite" className="mr-2" />
            <Image src={InviteImage} alt="Invite" className="mr-2" />
            <Image src={InviteImage} alt="Invite" />
          </div>
          <Button className="mt-0 bg-background text-destructive border border-destructive rounded-sm hover:bg-destructive hover:text-background">
            <UserPlus />
            Invite
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 w-full border border-gray-300 p-6 rounded-xl">
        <ToDoTask />
        <div className="ml-3">
          <TaskStatus />
          <CompletedTask />
        </div>
      </div>
    </>
  );
};

export default DashboardHome;
