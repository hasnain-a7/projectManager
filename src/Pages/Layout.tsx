import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../components/ui/breadcrumb";
import { Separator } from "../components/ui/separator";
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
        <header className="bg-zinc-100 flex h-10 shrink-0 items-center  gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="" />
            <Separator
              orientation="vertical"
              className=" data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>Task Manger</Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-1 p-2  bg-zinc-100">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
