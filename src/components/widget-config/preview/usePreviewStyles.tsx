
import { DeviceType } from "./DeviceSwitcher";

export function usePreviewStyles(selectedDevice: DeviceType) {
  const getDeviceMaxWidth = () => {
    return selectedDevice === "mobile" ? "85%" : "300px";
  };

  return {
    getDeviceMaxWidth
  };
}
