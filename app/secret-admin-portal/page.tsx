"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminPortalPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Small delay for UX
    setTimeout(() => {
      if (password === "scholarmall-admin-2026") {
        localStorage.setItem("admin_auth", "true");
        router.push("/secret-admin-portal/dashboard");
      } else {
        setError("Incorrect password. Please try again.");
        setLoading(false);
      }
    }, 500);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16 bg-gradient-to-b from-neutral-950 to-neutral-900">
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgb(251 191 36) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />

      <Card className="glass-card max-w-md w-full relative z-10">
        <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
        <CardHeader className="text-center pt-8">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-amber-400" />
          </div>
          <CardTitle className="text-white text-2xl font-bold">Admin Portal</CardTitle>
          <p className="text-neutral-400 text-sm mt-1">Secure access for administrators only</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-neutral-300 text-sm">Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
                  className="bg-neutral-800/50 border-neutral-700 rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl h-11"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Access Dashboard
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
