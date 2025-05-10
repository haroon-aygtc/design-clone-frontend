
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Paintbrush } from "lucide-react";

interface AppearanceTabProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  secondaryColor: string;
  setSecondaryColor: (color: string) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  borderRadius: number[];
  setBorderRadius: (radius: number[]) => void;
  chatIconSize: number[];
  setChatIconSize: (size: number[]) => void;
  updatePreview: () => void;
}

const colorOptions = [
  { color: "#6366F1", class: "bg-indigo-500" },
  { color: "#22C55E", class: "bg-green-500" },
  { color: "#EF4444", class: "bg-red-500" },
  { color: "#F97316", class: "bg-orange-500" },
  { color: "#3B82F6", class: "bg-blue-500" },
  { color: "#000000", class: "bg-black" },
  { color: "#8B5CF6", class: "bg-purple-500" },
];

export function AppearanceTab({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  fontFamily,
  setFontFamily,
  borderRadius,
  setBorderRadius,
  chatIconSize,
  setChatIconSize,
  updatePreview
}: AppearanceTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-medium mb-2">Visual Style</h3>
        <p className="text-sm text-gray-600 mb-4">Customize how your chat widget looks</p>
      </div>

      <div className="space-y-4">
        <div>
          <Label className="mb-2 block">Primary Color</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {colorOptions.map((option) => (
              <button 
                key={option.color} 
                className={`h-8 w-8 rounded-full ${option.class} border border-gray-200 flex items-center justify-center ${primaryColor === option.color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                onClick={() => setPrimaryColor(option.color)}
              >
                {primaryColor === option.color && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">This color will be used for the chat header and buttons</p>
        </div>

        <div>
          <Label className="mb-2 block">Secondary Color</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {colorOptions.map((option) => (
              <button 
                key={option.color} 
                className={`h-8 w-8 rounded-full ${option.class} border border-gray-200 flex items-center justify-center ${secondaryColor === option.color ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}
                onClick={() => setSecondaryColor(option.color)}
              >
                {secondaryColor === option.color && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500">Used for backgrounds and secondary elements</p>
        </div>

        <div>
          <Label htmlFor="fontFamily" className="mb-2 block">Font Family</Label>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger id="fontFamily" className="w-full">
              <SelectValue placeholder="Choose a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Lato">Lato</SelectItem>
              <SelectItem value="Montserrat">Montserrat</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500 mt-1">Choose a font for your chat widget</p>
        </div>

        <div>
          <Label className="mb-2 block">Border Radius: {borderRadius}px</Label>
          <Slider
            defaultValue={[8]}
            max={20}
            step={1}
            value={borderRadius}
            onValueChange={setBorderRadius}
            className="mb-2"
          />
          <p className="text-xs text-gray-500">Adjust the roundness of corners</p>
        </div>

        <div>
          <Label className="mb-2 block">Chat Icon Size: {chatIconSize}px</Label>
          <Slider
            defaultValue={[40]}
            max={60}
            min={20}
            step={2}
            value={chatIconSize}
            onValueChange={setChatIconSize}
            className="mb-2"
          />
          <p className="text-xs text-gray-500">Size of the chat button when minimized</p>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button type="button" variant="outline" className="mr-2">Reset to Default</Button>
        <Button onClick={updatePreview}>Save Changes</Button>
      </div>
    </div>
  );
}
