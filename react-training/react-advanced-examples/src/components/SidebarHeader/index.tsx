import { useAuth } from "@/Hooks/Auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const SidebarHeader = () => {
  const { user } = useAuth();
  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center flex-col absolute text-sidebar-primary-foreground top-7 text-center left-[50%] transform-[translateX(-50%)]">
      <Avatar className="w-21 h-21">
        <AvatarImage src={`https://i.pravatar.cc/150?u=${user.username}`} alt={user.username} />
        <AvatarFallback>{user.username?.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>
      <p className="text-base mt-2">{user.username}</p>
      <p className="text-xs opacity-70">{user.email}</p>
    </div>
  );
}

export default SidebarHeader
