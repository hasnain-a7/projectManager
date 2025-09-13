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
        <header className="flex h-10 shrink-0 items-center gap-2 border-b bg-background text-foreground transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger />
            <Separator
              orientation="vertical"
              className="data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>Task Manager</Breadcrumb>
          </div>
          <div className="ml-auto mr-3 flex items-center">
            <ThemeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col   bg-muted text-foreground">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
