"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, DollarSign, Calendar, MapPin, Award, FileText, CheckCircle, Loader2, GraduationCap, Mail, Phone, Globe, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import type { Scholarship } from "@/types";

function ApplyContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { toast } = useToast();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    nationality: "",
    education_level: "",
    gpa: "",
    essay: "",
    resume_url: "",
  });

  useEffect(() => {
    if (id) fetchScholarship();
  }, [id]);

  async function fetchScholarship() {
    try {
      const res = await fetch(`/api/scholarships/${id}`);
      const data = await res.json();
      setScholarship(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          scholarship_id: id,
          scholarship_title: scholarship?.title,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        toast({
          title: "Application Submitted!",
          description: "Check your email for confirmation.",
        });
      } else {
        throw new Error("Failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit application.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
    </div>
  );

  if (!scholarship) return (
    <div className="min-h-screen pt-24 text-center px-4">
      <p className="text-neutral-400 text-lg">Scholarship not found</p>
      <Link href="/scholarships" className="text-amber-400 hover:underline mt-4 inline-block">
        Browse Scholarships
      </Link>
    </div>
  );

  if (submitted) return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <Card className="glass-card max-w-md w-full text-center">
        <CardContent className="pt-12 pb-12">
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Application Submitted!</h2>
          <p className="text-neutral-400 mb-2">We sent a confirmation to</p>
          <p className="text-amber-400 font-medium mb-6">{form.email}</p>
          <Link href="/scholarships">
            <Button className="bg-amber-500 hover:bg-amber-400 text-black font-semibold">
              Browse More Scholarships
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );

  const isClosingSoon = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days <= 7 && days > 0;
  };

  const canProceed = step === 1 ? 
    form.first_name && form.last_name && form.email && form.phone && form.nationality && form.education_level && form.gpa :
    form.essay.length > 50;

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/scholarships" className="inline-flex items-center gap-2 text-neutral-400 hover:text-amber-400 mb-6 transition-colors text-sm">
          <ArrowLeft className="h-4 w-4" /> Back to Scholarships
        </Link>

        {/* Scholarship Details */}
        <Card className="glass-card mb-8 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-amber-500 to-amber-300" />
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div>
                <Badge className="mb-2 bg-amber-500/10 text-amber-400 border-amber-500/20">{scholarship.category}</Badge>
                <CardTitle className="text-xl sm:text-2xl text-white">{scholarship.title}</CardTitle>
              </div>
              {isClosingSoon(scholarship.deadline) && (
                <Badge variant="destructive" className="self-start">Closing Soon</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                <DollarSign className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-xs text-neutral-500">Amount</p>
                  <p className="text-amber-400 font-bold">{scholarship.amount}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                <MapPin className="h-5 w-5 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500">Location</p>
                  <p className="text-neutral-300">{scholarship.country}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-800/50 rounded-xl">
                <Calendar className="h-5 w-5 text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500">Deadline</p>
                  <p className="text-neutral-300">{new Date(scholarship.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-amber-400" /> Eligibility
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{scholarship.eligibility}</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-400" /> Description
                </h3>
                <p className="text-neutral-400 text-sm leading-relaxed">{scholarship.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form */}
        <Card className="glass-card">
          <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-amber-400" />
              Application Form — Step {step} of 2
            </CardTitle>
            <div className="flex gap-2 mt-2">
              <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-amber-500' : 'bg-neutral-700'}`} />
              <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-amber-500' : 'bg-neutral-700'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-neutral-300 text-sm">First Name *</Label>
                      <Input 
                        required 
                        value={form.first_name} 
                        onChange={e => setForm({...form, first_name: e.target.value})}
                        className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <Label className="text-neutral-300 text-sm">Last Name *</Label>
                      <Input 
                        required 
                        value={form.last_name} 
                        onChange={e => setForm({...form, last_name: e.target.value})}
                        className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-neutral-300 text-sm flex items-center gap-1">
                      <Mail className="w-3 h-3" /> Email Address *
                    </Label>
                    <Input 
                      type="email" 
                      required 
                      value={form.email} 
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                      placeholder="you@example.com"
                    />
                    <p className="text-xs text-neutral-500 mt-1">We will send confirmation and updates to this email.</p>
                  </div>
                  <div>
                    <Label className="text-neutral-300 text-sm flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Phone Number *
                    </Label>
                    <Input 
                      required 
                      value={form.phone} 
                      onChange={e => setForm({...form, phone: e.target.value})}
                      className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-neutral-300 text-sm flex items-center gap-1">
                        <Globe className="w-3 h-3" /> Nationality *
                      </Label>
                      <Input 
                        required 
                        value={form.nationality} 
                        onChange={e => setForm({...form, nationality: e.target.value})}
                        className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                        placeholder="Nigerian"
                      />
                    </div>
                    <div>
                      <Label className="text-neutral-300 text-sm">Education Level *</Label>
                      <select
                        className="flex h-10 w-full rounded-xl border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-white mt-1"
                        value={form.education_level}
                        onChange={e => setForm({...form, education_level: e.target.value})}
                        required
                      >
                        <option value="">Select level...</option>
                        <option value="High School">High School</option>
                        <option value="Bachelor's">Bachelor&apos;s</option>
                        <option value="Master's">Master&apos;s</option>
                        <option value="PhD">PhD</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-neutral-300 text-sm">GPA (out of 4.0) *</Label>
                    <Input 
                      type="number" 
                      step="0.01" 
                      min="0" 
                      max="4" 
                      required 
                      value={form.gpa} 
                      onChange={e => setForm({...form, gpa: e.target.value})}
                      className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                      placeholder="3.5"
                    />
                  </div>
                  <Button 
                    type="button" 
                    onClick={() => setStep(2)} 
                    className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl h-12"
                    disabled={!canProceed}
                  >
                    Continue to Step 2
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label className="text-neutral-300 text-sm">Why do you deserve this scholarship? *</Label>
                    <Textarea 
                      required 
                      rows={6} 
                      value={form.essay} 
                      onChange={e => setForm({...form, essay: e.target.value})}
                      className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl resize-none"
                      placeholder="Tell us your story, goals, and why this scholarship matters to you..."
                    />
                    <p className="text-xs text-neutral-500 mt-1">{form.essay.length} characters (minimum 50)</p>
                  </div>
                  <div>
                    <Label className="text-neutral-300 text-sm">Resume / Portfolio URL (optional)</Label>
                    <Input 
                      value={form.resume_url} 
                      onChange={e => setForm({...form, resume_url: e.target.value})}
                      className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                      placeholder="https://your-portfolio.com"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setStep(1)} 
                      className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800 rounded-xl h-12"
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl h-12"
                      disabled={submitting || !canProceed}
                    >
                      {submitting ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ApplyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    }>
      <ApplyContent />
    </Suspense>
  );
}
