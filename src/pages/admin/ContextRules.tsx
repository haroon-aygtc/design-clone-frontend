
import { useState } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

const ContextRulesPage = () => {
  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [contextType, setContextType] = useState("business");
  const [isActive, setIsActive] = useState(true);
  const [useKnowledgeBase, setUseKnowledgeBase] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      ruleName,
      ruleDescription,
      contextType,
      isActive,
      useKnowledgeBase
    });
    // Here would be an API call to save the rule
  };

  return (
    <AdminLayout title="Context Rules">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold mb-2">Context Rules</h1>
        <p className="text-gray-600">Define and manage context rules to control AI responses</p>
      </div>

      <div className="flex justify-end mb-6">
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Rule
        </Button>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list">Rules List</TabsTrigger>
          <TabsTrigger value="create">Create Rule</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <p className="text-center text-gray-600 py-8">No rules created yet. Click on 'Create Rule' to add your first context rule.</p>
          </div>
        </TabsContent>

        <TabsContent value="create">
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <h2 className="text-xl font-semibold mb-2">Create Context Rule</h2>
            <p className="text-gray-600 mb-6">Define a new context rule to control AI responses</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="ruleName">Rule Name</Label>
                  <Input 
                    id="ruleName" 
                    placeholder="E.g., UAE Government Information" 
                    value={ruleName}
                    onChange={(e) => setRuleName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contextType">Context Type</Label>
                  <Select value={contextType} onValueChange={setContextType}>
                    <SelectTrigger id="contextType">
                      <SelectValue placeholder="Select context type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="educational">Educational</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="customer-support">Customer Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the purpose of this context rule" 
                  rows={4}
                  value={ruleDescription}
                  onChange={(e) => setRuleDescription(e.target.value)}
                  className="resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Keywords</h3>
                  <div className="flex justify-between">
                    <Input placeholder="Add a keyword" />
                    <Button type="button" size="sm" variant="outline" className="ml-2">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Excluded Topics</h3>
                  <div className="flex justify-between">
                    <Input placeholder="Add excluded topic" />
                    <Button type="button" size="sm" variant="outline" className="ml-2">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Response Filters</h3>
                  <div className="flex justify-between">
                    <Input placeholder="Add response filter" />
                    <Button type="button" size="sm" variant="outline" className="ml-2">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="active" 
                    checked={isActive} 
                    onCheckedChange={setIsActive} 
                  />
                  <Label htmlFor="active">Active</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch 
                    id="knowledgeBase" 
                    checked={useKnowledgeBase} 
                    onCheckedChange={setUseKnowledgeBase} 
                  />
                  <Label htmlFor="knowledgeBase">Knowledge Base Integration</Label>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="mr-2">Save</Button>
                <Button type="button" variant="outline">Cancel</Button>
              </div>
            </form>
          </div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
};

export default ContextRulesPage;
