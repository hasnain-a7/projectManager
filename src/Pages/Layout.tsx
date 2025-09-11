import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/app-sidebar";
import { Breadcrumb } from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "../components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-zinc-100 dark:bg-gray-900 text-gray-900 dark:text-white flex h-10 shrink-0 items-center  gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="" />
            <Separator
              orientation="vertical"
              className=" data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>Task Manger</Breadcrumb>
          </div>
          <div className="ml-auto  mr-3 flex items-center">
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-1 p-1  bg-neutral-100 dark:bg-gray-900 text-gray-900 dark:text-white">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
