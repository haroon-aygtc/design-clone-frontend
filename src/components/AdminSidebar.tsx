
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Bot, 
  LogOut, 
  Webhook, 
  FileText,
  PlusCircle,
  List,
  TestTube,
  FileCode,
  Globe,
  Code,
  BarChart,
  Key,
  Cog,
  UserCog
} from "lucide-react";
import { cn } from "@/lib/utils";

const AdminSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { 
      name: "Dashboard", 
      path: "/admin", 
      icon: <LayoutDashboard className="w-5 h-5" /> 
    },
    { 
      name: "Tutorials", 
      path: "/admin/tutorials", 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      name: "Widget Config", 
      path: "/admin/widget-config", 
      icon: <Webhook className="w-5 h-5" /> 
    },
    { 
      name: "Context Rules", 
      path: "/admin/context-rules", 
      icon: <FileCode className="w-5 h-5" />,
      submenu: [
        { name: "Create Rule", path: "/admin/context-rules/create", icon: <PlusCircle className="w-4 h-4" /> },
        { name: "Manage Rules", path: "/admin/context-rules/manage", icon: <List className="w-4 h-4" /> },
        { name: "Test Rules", path: "/admin/context-rules/test", icon: <TestTube className="w-4 h-4" /> },
      ]
    },
    { 
      name: "Prompt Templates", 
      path: "/admin/prompt-templates", 
      icon: <FileText className="w-5 h-5" /> 
    },
    { 
      name: "Web Scraping", 
      path: "/admin/web-scraping", 
      icon: <Globe className="w-5 h-5" /> 
    },
    { 
      name: "Embed Code", 
      path: "/admin/embed-code", 
      icon: <Code className="w-5 h-5" /> 
    },
    { 
      name: "Analytics", 
      path: "/admin/analytics", 
      icon: <BarChart className="w-5 h-5" /> 
    },
    { 
      name: "API Keys", 
      path: "/admin/api-keys", 
      icon: <Key className="w-5 h-5" /> 
    },
    { 
      name: "AI Configuration", 
      path: "/admin/ai-configuration", 
      icon: <Cog className="w-5 h-5" /> 
    },
    { 
      name: "AI Models", 
      path: "/admin/ai-models", 
      icon: <Bot className="w-5 h-5" /> 
    },
    { 
      name: "User Management", 
      path: "/admin/user-management", 
      icon: <UserCog className="w-5 h-5" /> 
    },
  ];

  return (
    <div className="admin-sidebar w-64 min-h-screen flex flex-col">
      <div className="p-6 flex items-center gap-2 border-b border-admin-highlight">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-admin-highlight text-white">
          <Code className="w-4 h-4" />
        </div>
        <span className="font-semibold text-lg text-white">ChatAdmin</span>
      </div>
      
      <div className="p-4 border-b border-admin-highlight">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-admin-highlight flex items-center justify-center text-white">
            {/* Show user avatar or initials */}
            <span>AU</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white font-medium">Admin User</span>
            <span className="text-xs text-admin-secondaryText">admin@example.com</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "sidebar-item",
                isActive(item.path) && "active"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      
      <div className="p-4 border-t border-admin-highlight">
        <Link to="/logout" className="sidebar-item">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
