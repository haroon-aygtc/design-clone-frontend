
interface StatusItemProps {
  label: string;
  status: "checking" | "online" | "offline" | "warning";
}

const StatusItem = ({ label, status }: StatusItemProps) => {
  const getStatusText = () => {
    switch (status) {
      case "checking":
        return "Checking...";
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      case "warning":
        return "Warning";
      default:
        return "Unknown";
    }
  };

  const getStatusClass = () => {
    switch (status) {
      case "checking":
        return "text-blue-500";
      case "online":
        return "text-green-500";
      case "offline":
        return "text-red-500";
      case "warning":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm">{label}</span>
      <span className={`text-sm font-medium ${getStatusClass()}`}>{getStatusText()}</span>
    </div>
  );
};

interface SystemStatusCardProps {
  items: StatusItemProps[];
}

const SystemStatusCard = ({ items }: SystemStatusCardProps) => {
  return (
    <div className="dashboard-card">
      <h2 className="text-base font-semibold mb-2">System Status</h2>
      <p className="text-sm text-gray-600 mb-4">Current system health</p>
      <div className="divide-y divide-gray-100">
        {items.map((item, index) => (
          <StatusItem key={index} label={item.label} status={item.status} />
        ))}
      </div>
    </div>
  );
};

export default SystemStatusCard;
