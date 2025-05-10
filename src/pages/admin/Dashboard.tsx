
import { LayoutDashboard, Users, MessageCircle, Clock } from "lucide-react";
import AdminLayout from "@/layouts/AdminLayout";
import StatCard from "@/components/StatCard";
import QuickActionCard from "@/components/QuickActionCard";
import SystemStatusCard from "@/components/SystemStatusCard";
import { Settings, Code, FileCode } from "lucide-react";

const Dashboard = () => {
  // Mock data - would come from API in a real application
  const statusItems = [
    { label: "API Status", status: "checking" as const },
    { label: "Gemini API", status: "checking" as const },
    { label: "Hugging Face API", status: "checking" as const },
    { label: "Database", status: "checking" as const },
  ];

  return (
    <AdminLayout title="Admin Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard title="Total Conversations" value="Loading..." loading={true} />
        <StatCard title="Active Users" value="Loading..." loading={true} />
        <StatCard title="Response Rate" value="Loading..." loading={true} />
        <StatCard title="Avg. Response Time" value="Loading..." loading={true} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <div className="dashboard-card">
            <h2 className="text-base font-semibold mb-2">Quick Actions</h2>
            <p className="text-sm text-gray-600 mb-4">Common tasks and shortcuts</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuickActionCard
                title="Configure Widget"
                icon={<Settings className="h-8 w-8 text-admin-navy" />}
                to="/admin/widget-config"
              />
              <QuickActionCard
                title="Edit Context Rules"
                icon={<FileCode className="h-8 w-8 text-admin-navy" />}
                to="/admin/context-rules"
              />
              <QuickActionCard
                title="Get Embed Code"
                icon={<Code className="h-8 w-8 text-admin-navy" />}
                to="/admin/embed-code"
              />
            </div>
          </div>
        </div>

        <div>
          <SystemStatusCard items={statusItems} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
