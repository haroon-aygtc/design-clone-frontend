
import { Bell, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

interface AdminHeaderProps {
  title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
  return (
    <header className="bg-card py-4 px-6 flex items-center justify-between border-b">
      <h1 className="text-2xl font-semibold text-card-foreground">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-8 h-9 text-sm"
          />
        </div>

        <button className="p-2 relative">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <ThemeToggle />

        <button className="p-2">
          <Settings className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs">
            AU
          </div>
          <span className="text-sm font-medium text-card-foreground">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
