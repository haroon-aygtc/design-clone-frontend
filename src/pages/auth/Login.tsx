
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmbedCode } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This would be replaced with an actual API call
    setTimeout(() => {
      console.log("Login attempt with:", { email, password });
      setLoading(false);
      window.location.href = "/admin"; // Redirect to admin dashboard
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex md:w-1/2 bg-admin-navy text-white p-10 flex-col items-center justify-center">
        <div className="mb-6 w-20 h-20 rounded-full bg-gray-700/30 flex items-center justify-center">
          <EmbedCode className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Welcome Back</h1>
        <p className="text-center text-gray-300 max-w-xs mb-8">
          Access your dashboard to manage your chat widget, context rules, and more.
        </p>
        <div className="space-y-3 w-full max-w-xs">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-700/40 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
            <p className="text-sm">Manage context rules and templates</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-700/40 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
            <p className="text-sm">Configure widget appearance</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-700/40 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
            <p className="text-sm">Secure admin access</p>
          </div>
        </div>
      </div>
      
      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-full bg-gray-100 mb-3">
              <EmbedCode className="w-6 h-6 text-admin-navy" />
            </div>
            <h2 className="text-2xl font-semibold">Admin Login</h2>
            <p className="text-gray-600 mt-1">Enter your credentials to access the admin dashboard</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <div className="relative">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 pl-3"
                  required
                  placeholder="badshah.dev@outlook.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 pl-3"
                  required
                  placeholder="••••••••"
                />
              </div>
            </div>
            
            <Button
              type="submit"
              className="w-full bg-admin-navy hover:bg-admin-dark"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="text-blue-600 hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
