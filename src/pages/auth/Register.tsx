
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Code } from "lucide-react";

const Register = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    
    setLoading(true);
    
    // This would be replaced with an actual API call
    setTimeout(() => {
      console.log("Register attempt with:", { fullName, email, password });
      setLoading(false);
      window.location.href = "/admin"; // Redirect to admin dashboard
    }, 1000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden md:flex md:w-1/2 bg-admin-navy text-white p-10 flex-col items-center justify-center">
        <div className="mb-6 w-20 h-20 rounded-full bg-gray-700/30 flex items-center justify-center">
          <Code className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Join Us Today</h1>
        <p className="text-center text-gray-300 max-w-xs mb-8">
          Create an account to access our chat widget platform and start building your own AI assistants.
        </p>
        <div className="space-y-3 w-full max-w-xs">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-700/40 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
            <p className="text-sm">Customize your chat widget</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-700/40 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
            <p className="text-sm">Create context-aware AI responses</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gray-700/40 flex items-center justify-center">
              <span className="text-xs">✓</span>
            </div>
            <p className="text-sm">Embed on any website with ease</p>
          </div>
        </div>
      </div>
      
      {/* Right panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <div className="inline-block p-3 rounded-full bg-gray-100 mb-3">
              <Code className="w-6 h-6 text-admin-navy" />
            </div>
            <h2 className="text-2xl font-semibold">Create an Admin Account</h2>
            <p className="text-gray-600 mt-1">Enter your details to register as an admin for ChatEmbed</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-gray-50"
                required
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-50"
                required
                placeholder="badshah.dev@outlook.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50"
                required
                placeholder="••••••••"
              />
              <p className="text-xs text-gray-500 mt-1">Must be at least 8 characters</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password</label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-gray-50"
                required
                placeholder="••••••••"
              />
            </div>
            
            <Button
              type="submit"
              className="w-full bg-admin-navy hover:bg-admin-dark"
              disabled={loading}
            >
              {loading ? "Creating Account..." : "Register"}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>By registering, you agree to our Terms of Service and Privacy Policy</p>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
