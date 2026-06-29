"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-neutral-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="h-7 w-7 text-amber-400" />
            <span className="text-xl font-bold text-white">Scholar<span className="text-amber-400">Mall</span></span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">Home</Link>
            <Link href="/scholarships" className="text-neutral-300 hover:text-white transition-colors text-sm font-medium">Scholarships</Link>
          </div>

          <Button variant="ghost" size="sm" className="md:hidden text-white" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-800/50 px-4 py-4 space-y-3">
          <Link href="/" className="block text-neutral-300 hover:text-white" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/scholarships" className="block text-neutral-300 hover:text-white" onClick={() => setMobileOpen(false)}>Scholarships</Link>
        </div>
      )}
    </nav>
  );
}
