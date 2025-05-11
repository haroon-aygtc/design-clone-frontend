
import { DeviceType } from "./DeviceSwitcher";

interface PreviewContainerProps {
  selectedDevice: DeviceType;
  children: React.ReactNode;
}

export function PreviewContainer({ selectedDevice, children }: PreviewContainerProps) {
  // Calculate preview container styles based on selected device
  const getPreviewContainerStyles = () => {
    switch (selectedDevice) {
      case "mobile":
        return {
          maxWidth: "320px",
          height: "580px",
          margin: "0 auto",
          border: "10px solid #222",
          borderRadius: "20px",
        };
      case "tablet":
        return {
          maxWidth: "768px",
          height: "500px",
          margin: "0 auto",
          border: "10px solid #222",
          borderRadius: "12px",
        };
      default:
        return {
          height: "500px",
        };
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-200 rounded-lg min-h-[500px] bg-gray-50 relative overflow-hidden"
      style={getPreviewContainerStyles()}
    >
      {children}
    </div>
  );
}
