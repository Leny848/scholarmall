"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export function Footer() {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast({ title: "Message sent!", description: "We'll get back to you soon." });
        setForm({ name: "", email: "", subject: "", message: "" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setSending(false);
    }
  }

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6 text-amber-400" />
              <span className="text-lg font-bold text-white">Scholar<span className="text-amber-400">Mall</span></span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-4">
              Discover your future with thousands of scholarships worldwide. No sign-up required.
            </p>
            <div className="space-y-2 text-sm text-neutral-400">
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-amber-400" /> lenydaplug63@gmail.com</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> Global</p>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/" className="block text-neutral-400 hover:text-amber-400 transition-colors text-sm">Home</Link>
              <Link href="/scholarships" className="block text-neutral-400 hover:text-amber-400 transition-colors text-sm">All Scholarships</Link>
              <Link href="/secret-admin-portal" className="block text-neutral-400 hover:text-amber-400 transition-colors text-sm">Admin Portal</Link>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <Input placeholder="Your name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-neutral-900 border-neutral-800 rounded-xl text-sm" />
              <Input type="email" placeholder="Your email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="bg-neutral-900 border-neutral-800 rounded-xl text-sm" />
              <Input placeholder="Subject" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="bg-neutral-900 border-neutral-800 rounded-xl text-sm" />
              <Textarea placeholder="Your message" required rows={3} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="bg-neutral-900 border-neutral-800 rounded-xl text-sm resize-none" />
              <Button type="submit" disabled={sending} className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl">
                {sending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : <><Send className="mr-2 h-4 w-4" /> Send Message</>}
              </Button>
            </form>
          </div>
        </div>
        <div className="border-t border-neutral-800 mt-10 pt-6 text-center">
          <p className="text-neutral-500 text-sm"> ScholarMall. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
