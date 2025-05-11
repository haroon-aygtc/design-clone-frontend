
import { DeviceType } from "./DeviceSwitcher";

export function usePreviewStyles(selectedDevice: DeviceType) {
  const getDeviceMaxWidth = () => {
    return selectedDevice === "mobile" ? "85%" : "300px";
  };

  const getDeviceClass = () => {
    return selectedDevice === "mobile" 
      ? "rounded-lg shadow-lg" 
      : "rounded-md shadow-md";
  };

  const getFrameHeight = () => {
    return selectedDevice === "mobile" ? "600px" : "400px";
  };

  return {
    getDeviceMaxWidth,
    getDeviceClass,
    getFrameHeight
  };
}
