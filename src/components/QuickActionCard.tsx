
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface QuickActionCardProps {
  title: string;
  icon: ReactNode;
  to: string;
}

const QuickActionCard = ({ title, icon, to }: QuickActionCardProps) => {
  return (
    <Link to={to} className="bg-card text-card-foreground rounded-lg border p-6 flex flex-col items-center justify-center hover:shadow-md transition-shadow">
      <div className="w-12 h-12 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-center text-sm font-medium">{title}</p>
    </Link>
  );
};

export default QuickActionCard;
