
interface InstallationInstructionsProps {
  activeTab: string;
}

export function InstallationInstructions({ activeTab }: InstallationInstructionsProps) {
  return (
    <div>
      <h4 className="text-base font-medium mb-2">Installation Instructions</h4>
      <div className="space-y-4">
        <div>
          <h5 className="text-sm font-medium mb-1">1. Copy the code above</h5>
          <p className="text-xs text-gray-600 dark:text-gray-400">Click the copy button to copy the widget code to your clipboard.</p>
        </div>
        <div>
          <h5 className="text-sm font-medium mb-1">2. {activeTab === "iframe" ? "Add to your HTML" : "Add to your page"}</h5>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {activeTab === "iframe"
              ? "Add the iframe code just before the closing body tag in your HTML."
              : "Add the script tag to your head and the custom element to your body."}
          </p>
        </div>
        <div>
          <h5 className="text-sm font-medium mb-1">3. Save and publish your website</h5>
          <p className="text-xs text-gray-600 dark:text-gray-400">The AI-powered chat widget will automatically appear on your site.</p>
        </div>
      </div>
    </div>
  );
}
