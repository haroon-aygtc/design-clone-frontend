
import { useState } from "react";
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
  UserCog,
  ChevronDown,
  Send
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
      name: "AI Providers",
      path: "/admin/ai-providers",
      icon: <Settings className="w-5 h-5" />
    },
    {
      name: "API Tester",
      path: "/admin/api-tester",
      icon: <Send className="w-5 h-5" />
    },
    {
      name: "User Management",
      path: "/admin/user-management",
      icon: <UserCog className="w-5 h-5" />
    },
  ];

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (path: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  return (
    <div className="admin-sidebar w-64 min-h-screen flex flex-col">
      <div className="p-6 flex items-center gap-2 border-b dark:border-gray-800" style={{ borderColor: 'var(--admin-highlight-color, #242C46)' }}>
        <div className="w-6 h-6 rounded-md flex items-center justify-center text-white dark:bg-gray-800" style={{ backgroundColor: 'var(--admin-highlight-color, #242C46)' }}>
          <Code className="w-4 h-4" />
        </div>
        <span className="font-semibold text-lg text-white dark:text-gray-100">ChatAdmin</span>
      </div>

      <div className="p-4 border-b dark:border-gray-800" style={{ borderColor: 'var(--admin-highlight-color, #242C46)' }}>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white dark:bg-gray-800" style={{ backgroundColor: 'var(--admin-highlight-color, #242C46)' }}>
            {/* Show user avatar or initials */}
            <span>AU</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-white dark:text-gray-100 font-medium">Admin User</span>
            <span className="text-xs dark:text-gray-400" style={{ color: 'var(--admin-secondarytext-color, #A0AEC0)' }}>admin@example.com</span>
          </div>
        </div>
      </div>

      <div className="flex-1 py-4 overflow-y-auto">
        <nav className="px-2 space-y-1">
          {menuItems.map((item) => (
            <div key={item.path} className="mb-1">
              {item.submenu ? (
                <>
                  <div
                    className={cn(
                      "sidebar-item cursor-pointer",
                      (isActive(item.path) || expandedItems[item.path]) && "active"
                    )}
                    onClick={() => toggleSubmenu(item.path)}
                  >
                    {item.icon}
                    <span className="flex-1">{item.name}</span>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-transform",
                      expandedItems[item.path] && "rotate-180"
                    )} />
                  </div>

                  {expandedItems[item.path] && (
                    <div className="sidebar-submenu">
                      {item.submenu.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={cn(
                            "sidebar-item",
                            isActive(subItem.path) && "active"
                          )}
                        >
                          {subItem.icon}
                          <span>{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "sidebar-item",
                    isActive(item.path) && "active"
                  )}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t dark:border-gray-800" style={{ borderColor: 'var(--admin-highlight-color, #242C46)' }}>
        <Link to="/logout" className="sidebar-item">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
