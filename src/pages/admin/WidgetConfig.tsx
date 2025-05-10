
import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Paintbrush, Gauge, MessageSquare, Code } from "lucide-react";

const WidgetConfigPage = () => {
  const [primaryColor, setPrimaryColor] = useState("#6366F1");
  const [secondaryColor, setSecondaryColor] = useState("#6366F1");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [borderRadius, setBorderRadius] = useState([8]);
  const [chatIconSize, setChatIconSize] = useState([40]);

  // Mock preview state - would be connected to an actual preview in a real app
  const [previewLoading, setPreviewLoading] = useState(false);

  const updatePreview = () => {
    setPreviewLoading(true);
    setTimeout(() => {
      setPreviewLoading(false);
    }, 800);
  };

  const colorOptions = [
    { color: "#6366F1", class: "bg-indigo-500" },
    { color: "#22C55E", class: "bg-green-500" },
    { color: "#EF4444", class: "bg-red-500" },
    { color: "#F97316", class: "bg-orange-500" },
    { color: "#3B82F6", class: "bg-blue-500" },
    { color: "#000000", class: "bg-black" },
    { color: "#8B5CF6", class: "bg-purple-500" },
  ];

  return (
    <AdminLayout title="Widget Config">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <h2 className="text-xl font-semibold mb-4">Widget Configurator</h2>

            <Tabs defaultValue="appearance" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="appearance" onClick={updatePreview}>
                  <Paintbrush className="mr-2 h-4 w-4" />
                  Appearance
                </TabsTrigger>
                <TabsTrigger value="behavior" onClick={updatePreview}>
                  <Gauge className="mr-2 h-4 w-4" />
                  Behavior
                </TabsTrigger>
                <TabsTrigger value="content" onClick={updatePreview}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="embedding" onClick={updatePreview}>
                  <Code className="mr-2 h-4 w-4" />
                  Embedding
                </TabsTrigger>
              </TabsList>

              <TabsContent value="appearance" className="space-y-6">
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
                  <Button>Save Changes</Button>
                </div>
              </TabsContent>

              <TabsContent value="behavior">
                <div className="text-center py-10 text-gray-500">
                  Behavior settings will appear here. Configure chat behavior, response timing, and interaction options.
                </div>
              </TabsContent>

              <TabsContent value="content">
                <div className="text-center py-10 text-gray-500">
                  Content settings will appear here. Configure welcome messages, bot responses, and suggested questions.
                </div>
              </TabsContent>

              <TabsContent value="embedding">
                <div className="text-center py-10 text-gray-500">
                  Embedding settings will appear here. Get the code to embed your chat widget on your website.
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div>
          <div className="bg-white p-6 rounded-lg shadow-sm border sticky top-6">
            <h2 className="text-lg font-semibold mb-4">Live Preview</h2>
            <div className="border-2 border-dashed border-gray-200 rounded-lg min-h-[500px] flex items-center justify-center">
              {previewLoading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full w-8 h-8 border-b-2 border-gray-800 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading preview...</p>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <p>Chat widget preview will appear here</p>
                  <p className="text-sm mt-1">Updates as you change settings</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default WidgetConfigPage;
