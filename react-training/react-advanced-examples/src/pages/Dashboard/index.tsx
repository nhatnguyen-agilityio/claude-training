import { Outlet } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

const Dashboard = () => {
  return (
    <div className="container">
      <SidebarProvider className="w-full h-auto min-h-auto">
        <Sidebar />
        <SidebarInset className="rounded-none border-none ">
          <Outlet />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default Dashboard
