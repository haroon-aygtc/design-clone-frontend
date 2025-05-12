
import { Button } from "@/components/ui/button";

interface PreviewControlsProps {
  showExpanded: boolean;
  setShowExpanded: (show: boolean) => void;
}

export function PreviewControls({ showExpanded, setShowExpanded }: PreviewControlsProps) {
  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExpanded(false)}
          className={!showExpanded ? "bg-gray-100 dark:bg-gray-700" : ""}
        >
          Minimized View
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowExpanded(true)}
          className={showExpanded ? "bg-gray-100 dark:bg-gray-700" : ""}
        >
          Expanded View
        </Button>
      </div>
    </div>
  );
}
