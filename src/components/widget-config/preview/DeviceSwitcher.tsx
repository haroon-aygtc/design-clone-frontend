
import { useState } from "react";
import { Smartphone, Tablet, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

export type DeviceType = "desktop" | "mobile" | "tablet";

interface DeviceSwitcherProps {
  selectedDevice: DeviceType;
  setSelectedDevice: (device: DeviceType) => void;
}

export function DeviceSwitcher({ selectedDevice, setSelectedDevice }: DeviceSwitcherProps) {
  const isMobile = useIsMobile();

  return (
    <div className="mb-4 flex justify-center gap-2">
      <Button 
        variant={selectedDevice === "desktop" ? "default" : "outline"} 
        size="sm" 
        onClick={() => setSelectedDevice("desktop")}
        className="flex items-center gap-2"
      >
        <Monitor size={16} />
        {!isMobile && <span>Desktop</span>}
      </Button>
      <Button 
        variant={selectedDevice === "tablet" ? "default" : "outline"} 
        size="sm" 
        onClick={() => setSelectedDevice("tablet")}
        className="flex items-center gap-2"
      >
        <Tablet size={16} />
        {!isMobile && <span>Tablet</span>}
      </Button>
      <Button 
        variant={selectedDevice === "mobile" ? "default" : "outline"} 
        size="sm" 
        onClick={() => setSelectedDevice("mobile")}
        className="flex items-center gap-2"
      >
        <Smartphone size={16} />
        {!isMobile && <span>Mobile</span>}
      </Button>
    </div>
  );
}
