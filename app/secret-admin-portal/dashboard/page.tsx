"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  GraduationCap, Users, DollarSign, MessageSquare, CheckCircle, XCircle, Clock, 
  Mail, Search, Plus, Pencil, Trash2, LogOut, Loader2, Eye, Send, AlertTriangle,
  ChevronDown, ChevronUp, Settings, Github, Save, Key, Database
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import type { Scholarship, Application, Contact } from "@/types";

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminMessage, setAdminMessage] = useState("");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  // Scholarship form states
  const [showScholarshipForm, setShowScholarshipForm] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [scholarshipForm, setScholarshipForm] = useState({
    title: "", description: "", amount: "", deadline: "", eligibility: "",
    category: "STEM", country: "USA", image_url: ""
  });
  const [expandedApp, setExpandedApp] = useState<string | null>(null);

  // Settings states
  const [githubToken, setGithubToken] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [githubBranch, setGithubBranch] = useState("main");
  const [githubConfigured, setGithubConfigured] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.push("/secret-admin-portal");
      return;
    }
    fetchData();
    checkGithubConfig();
  }, []);

  async function fetchData() {
    try {
      const [sRes, aRes, cRes] = await Promise.all([
        fetch("/api/scholarships"),
        fetch("/api/applications"),
        fetch("/api/contact"),
      ]);
      const sData = await sRes.json();
      const aData = await aRes.json();
      const cData = cRes.ok ? await cRes.json() : [];
      setScholarships(sData);
      setApplications(aData);
      setContacts(cData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function checkGithubConfig() {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (data.configured) {
        setGithubConfigured(true);
        setGithubRepo(data.repo);
        setGithubBranch(data.branch);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function saveGithubSettings() {
    setSavingSettings(true);
    setSettingsError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: githubToken,
          repo: githubRepo,
          branch: githubBranch,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast({ title: "GitHub settings saved!", description: `Connected to ${data.repo}` });
        setGithubConfigured(true);
        setGithubToken(""); // Clear for security
      } else {
        setSettingsError(data.error || "Failed to save settings");
      }
    } catch (error: any) {
      setSettingsError(error.message);
    } finally {
      setSavingSettings(false);
    }
  }

  async function seedDatabase() {
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (res.ok) {
        toast({ title: "Database seeded!", description: "Sample scholarships added." });
        fetchData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to seed database.", variant: "destructive" });
    }
  }

  async function updateStatus(id: string, status: "accepted" | "rejected") {
    if (!adminMessage.trim()) {
      toast({ title: "Message required", description: "Please type a message for the applicant.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status, admin_message: adminMessage }),
      });
      if (res.ok) {
        toast({ title: `Application ${status}!`, description: "Email sent to applicant." });
        setAdminMessage("");
        setSelectedApp(null);
        fetchData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    }
  }

  // Scholarship CRUD
  function openAddScholarship() {
    setEditingScholarship(null);
    setScholarshipForm({
      title: "", description: "", amount: "", deadline: "", eligibility: "",
      category: "STEM", country: "USA", image_url: ""
    });
    setShowScholarshipForm(true);
  }

  function openEditScholarship(s: Scholarship) {
    setEditingScholarship(s);
    setScholarshipForm({
      title: s.title, description: s.description, amount: s.amount,
      deadline: s.deadline.split("T")[0], eligibility: s.eligibility,
      category: s.category, country: s.country, image_url: s.image_url
    });
    setShowScholarshipForm(true);
  }

  async function saveScholarship() {
    const { title, description, amount, deadline, eligibility, category, country, image_url } = scholarshipForm;
    if (!title || !description || !amount || !deadline || !eligibility) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    try {
      if (editingScholarship) {
        const res = await fetch(`/api/admin/scholarships/${editingScholarship.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scholarshipForm),
        });
        if (res.ok) {
          toast({ title: "Scholarship updated!" });
          setShowScholarshipForm(false);
          fetchData();
        }
      } else {
        const res = await fetch("/api/admin/scholarships", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(scholarshipForm),
        });
        if (res.ok) {
          toast({ title: "Scholarship added!" });
          setShowScholarshipForm(false);
          fetchData();
        }
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to save scholarship.", variant: "destructive" });
    }
  }

  async function deleteScholarship(id: string) {
    try {
      const res = await fetch(`/api/admin/scholarships/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast({ title: "Scholarship deleted!" });
        fetchData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete.", variant: "destructive" });
    }
  }

  function logout() {
    localStorage.removeItem("admin_auth");
    router.push("/secret-admin-portal");
  }

  const stats = {
    totalScholarships: scholarships.length,
    totalApplications: applications.length,
    totalValue: scholarships.reduce((acc, s) => acc + parseInt(s.amount.replace(/[^0-9]/g, "")), 0),
    pending: applications.filter(a => a.status === "pending").length,
    accepted: applications.filter(a => a.status === "accepted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    unreadMessages: contacts.filter(c => !c.read).length,
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen pt-20 sm:pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-neutral-400 text-sm mt-1">Manage scholarships, applications, and messages</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={seedDatabase} variant="outline" className="border-neutral-700 text-neutral-300 hover:bg-neutral-800 rounded-xl">
              <Plus className="mr-2 h-4 w-4" />
              Seed Sample Data
            </Button>
            <Button onClick={logout} variant="outline" className="border-red-900/50 text-red-400 hover:bg-red-900/20 rounded-xl">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-5 pb-4">
              <GraduationCap className="h-5 w-5 text-amber-400 mb-2" />
              <p className="text-2xl font-bold text-white">{stats.totalScholarships}</p>
              <p className="text-xs text-neutral-400">Scholarships</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-5 pb-4">
              <Users className="h-5 w-5 text-amber-400 mb-2" />
              <p className="text-2xl font-bold text-white">{stats.totalApplications}</p>
              <p className="text-xs text-neutral-400">Applications</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-5 pb-4">
              <DollarSign className="h-5 w-5 text-amber-400 mb-2" />
              <p className="text-2xl font-bold text-white">${(stats.totalValue / 1000).toFixed(0)}K</p>
              <p className="text-xs text-neutral-400">Total Value</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-5 pb-4">
              <Clock className="h-5 w-5 text-amber-400 mb-2" />
              <p className="text-2xl font-bold text-white">{stats.pending}</p>
              <p className="text-xs text-neutral-400">Pending</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-5 pb-4">
              <CheckCircle className="h-5 w-5 text-green-400 mb-2" />
              <p className="text-2xl font-bold text-white">{stats.accepted}</p>
              <p className="text-xs text-neutral-400">Accepted</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-5 pb-4">
              <XCircle className="h-5 w-5 text-red-400 mb-2" />
              <p className="text-2xl font-bold text-white">{stats.rejected}</p>
              <p className="text-xs text-neutral-400">Rejected</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="applications" className="space-y-6">
          <TabsList className="bg-neutral-900 border border-neutral-800 rounded-xl p-1 flex-wrap h-auto">
            <TabsTrigger value="applications" className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <Users className="w-4 h-4 mr-2" /> Applications
            </TabsTrigger>
            <TabsTrigger value="scholarships" className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <GraduationCap className="w-4 h-4 mr-2" /> Scholarships
            </TabsTrigger>
            <TabsTrigger value="messages" className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <MessageSquare className="w-4 h-4 mr-2" /> Messages
              {stats.unreadMessages > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{stats.unreadMessages}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-amber-500 data-[state=active]:text-black">
              <Settings className="w-4 h-4 mr-2" /> Settings
            </TabsTrigger>
          </TabsList>

          {/* APPLICATIONS TAB */}
          <TabsContent value="applications">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  placeholder="Search applicants..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 bg-neutral-900 border-neutral-800 rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                {(["all", "pending", "accepted", "rejected"] as const).map(s => (
                  <Button
                    key={s}
                    size="sm"
                    variant={statusFilter === s ? "default" : "outline"}
                    onClick={() => setStatusFilter(s)}
                    className={`rounded-lg text-xs capitalize ${
                      statusFilter === s ? "bg-amber-500 text-black" : "border-neutral-700 text-neutral-400"
                    }`}
                  >
                    {s}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {filteredApplications.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <Users className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-400">No applications found.</p>
                </div>
              ) : (
                filteredApplications.map(app => (
                  <Card key={app.id} className="glass-card overflow-hidden">
                    <CardContent className="p-0">
                      <div 
                        className="p-4 sm:p-5 cursor-pointer hover:bg-neutral-800/30 transition-colors"
                        onClick={() => setExpandedApp(expandedApp === app.id ? null : app.id)}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-white font-semibold">{app.first_name} {app.last_name}</h3>
                              <Badge className={
                                app.status === "accepted" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                                app.status === "rejected" ? "bg-red-500/20 text-red-400 border-red-500/30" :
                                "bg-amber-500/20 text-amber-400 border-amber-500/30"
                              }>
                                {app.status}
                              </Badge>
                            </div>
                            <p className="text-amber-400/80 text-sm mt-0.5">{app.email}</p>
                            <p className="text-neutral-500 text-xs mt-1">
                              {app.education_level} | GPA: {app.gpa} | {app.nationality}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {app.status === "pending" && (
                              <>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" onClick={() => {setSelectedApp(app); setAdminMessage("");}} className="bg-green-600 hover:bg-green-500 rounded-lg h-8">
                                      <CheckCircle className="mr-1 h-3.5 w-3.5" /> Accept
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="glass-card border-neutral-800 max-w-lg">
                                    <DialogHeader>
                                      <DialogTitle className="text-white flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        Accept Application
                                      </DialogTitle>
                                      <DialogDescription className="text-neutral-400">
                                        Send a personalized message to {app.first_name} {app.last_name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-2">
                                      <div className="bg-neutral-800/50 rounded-xl p-4 space-y-2">
                                        <p className="text-sm text-neutral-400"><strong className="text-white">Applicant:</strong> {app.first_name} {app.last_name}</p>
                                        <p className="text-sm text-neutral-400"><strong className="text-white">Email:</strong> {app.email}</p>
                                        <p className="text-sm text-neutral-400"><strong className="text-white">Scholarship:</strong> {app.scholarship_title || app.scholarship_id}</p>
                                      </div>
                                      <div>
                                        <Label className="text-neutral-300 text-sm">Your Message *</Label>
                                        <Textarea
                                          value={adminMessage}
                                          onChange={e => setAdminMessage(e.target.value)}
                                          placeholder={`Congratulations ${app.first_name}! You have been selected...`}
                                          rows={4}
                                          className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                                        />
                                      </div>
                                      <Button onClick={() => updateStatus(app.id, "accepted")} className="w-full bg-green-600 hover:bg-green-500 rounded-xl h-11">
                                        <Send className="mr-2 h-4 w-4" />
                                        Accept & Send Email
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>

                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button size="sm" onClick={() => {setSelectedApp(app); setAdminMessage("");}} variant="destructive" className="rounded-lg h-8">
                                      <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="glass-card border-neutral-800 max-w-lg">
                                    <DialogHeader>
                                      <DialogTitle className="text-white flex items-center gap-2">
                                        <XCircle className="w-5 h-5 text-red-400" />
                                        Reject Application
                                      </DialogTitle>
                                      <DialogDescription className="text-neutral-400">
                                        Send a personalized message to {app.first_name} {app.last_name}
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4 pt-2">
                                      <div className="bg-neutral-800/50 rounded-xl p-4 space-y-2">
                                        <p className="text-sm text-neutral-400"><strong className="text-white">Applicant:</strong> {app.first_name} {app.last_name}</p>
                                        <p className="text-sm text-neutral-400"><strong className="text-white">Email:</strong> {app.email}</p>
                                      </div>
                                      <div>
                                        <Label className="text-neutral-300 text-sm">Your Message *</Label>
                                        <Textarea
                                          value={adminMessage}
                                          onChange={e => setAdminMessage(e.target.value)}
                                          placeholder={`Thank you for applying, ${app.first_name}. Unfortunately...`}
                                          rows={4}
                                          className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                                        />
                                      </div>
                                      <Button onClick={() => updateStatus(app.id, "rejected")} variant="destructive" className="w-full rounded-xl h-11">
                                        <Send className="mr-2 h-4 w-4" />
                                        Reject & Send Email
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </>
                            )}
                            {expandedApp === app.id ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
                          </div>
                        </div>
                      </div>

                      {expandedApp === app.id && (
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 border-t border-neutral-800/50">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                            <div className="bg-neutral-800/30 rounded-xl p-4">
                              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Personal Info</p>
                              <div className="space-y-1 text-sm">
                                <p className="text-neutral-300"><span className="text-neutral-500">Phone:</span> {app.phone}</p>
                                <p className="text-neutral-300"><span className="text-neutral-500">Nationality:</span> {app.nationality}</p>
                                <p className="text-neutral-300"><span className="text-neutral-500">Education:</span> {app.education_level}</p>
                                <p className="text-neutral-300"><span className="text-neutral-500">GPA:</span> {app.gpa}</p>
                              </div>
                            </div>
                            <div className="bg-neutral-800/30 rounded-xl p-4">
                              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Application</p>
                              <div className="space-y-1 text-sm">
                                <p className="text-neutral-300"><span className="text-neutral-500">Scholarship ID:</span> {app.scholarship_id}</p>
                                <p className="text-neutral-300"><span className="text-neutral-500">Applied:</span> {new Date(app.created_at).toLocaleDateString()}</p>
                                {app.resume_url && (
                                  <p className="text-neutral-300"><span className="text-neutral-500">Resume:</span> <a href={app.resume_url} target="_blank" className="text-amber-400 hover:underline">View</a></p>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="mt-4 bg-neutral-800/30 rounded-xl p-4">
                            <p className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Essay</p>
                            <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">{app.essay}</p>
                          </div>
                          {app.admin_message && (
                            <div className="mt-4 bg-green-500/5 border border-green-500/20 rounded-xl p-4">
                              <p className="text-xs text-green-500 uppercase tracking-wider mb-1">Admin Response</p>
                              <p className="text-green-400/80 text-sm italic">{app.admin_message}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* SCHOLARSHIPS TAB */}
          <TabsContent value="scholarships">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Manage Scholarships</h2>
              <Button onClick={openAddScholarship} className="bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl">
                <Plus className="mr-2 h-4 w-4" />
                Add Scholarship
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scholarships.length === 0 ? (
                <div className="glass-card p-12 text-center md:col-span-2">
                  <GraduationCap className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-400 mb-2">No scholarships yet.</p>
                  <Button onClick={seedDatabase} variant="outline" className="border-amber-500/30 text-amber-400">
                    Seed Sample Data
                  </Button>
                </div>
              ) : (
                scholarships.map(s => (
                  <Card key={s.id} className="glass-card overflow-hidden group">
                    <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20">{s.category}</Badge>
                            <Badge variant="outline" className="border-neutral-700 text-neutral-400">{s.country}</Badge>
                          </div>
                          <h3 className="text-white font-semibold text-lg truncate">{s.title}</h3>
                          <p className="text-amber-400 font-bold text-sm mt-1">{s.amount}</p>
                          <p className="text-neutral-500 text-xs mt-1">Deadline: {new Date(s.deadline).toLocaleDateString()}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button size="sm" variant="ghost" onClick={() => openEditScholarship(s)} className="h-8 w-8 p-0 text-neutral-400 hover:text-amber-400 hover:bg-amber-500/10">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-neutral-400 hover:text-red-400 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="glass-card border-neutral-800">
                              <DialogHeader>
                                <DialogTitle className="text-white flex items-center gap-2">
                                  <AlertTriangle className="w-5 h-5 text-red-400" />
                                  Delete Scholarship
                                </DialogTitle>
                                <DialogDescription className="text-neutral-400">
                                  Are you sure you want to delete <strong className="text-white">{s.title}</strong>? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter className="gap-2">
                                <Button variant="outline" className="border-neutral-700 text-neutral-300">Cancel</Button>
                                <Button onClick={() => deleteScholarship(s.id)} variant="destructive">
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                      <p className="text-neutral-400 text-sm mt-3 line-clamp-2">{s.description}</p>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* MESSAGES TAB */}
          <TabsContent value="messages">
            <div className="space-y-3">
              {contacts.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <MessageSquare className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                  <p className="text-neutral-400">No messages yet.</p>
                </div>
              ) : (
                contacts.map(c => (
                  <Card key={c.id} className={`glass-card ${!c.read ? 'border-amber-500/30' : ''}`}>
                    <CardContent className="p-4 sm:p-5">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-white font-semibold">{c.name}</h3>
                            {!c.read && <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/20 text-xs">New</Badge>}
                          </div>
                          <p className="text-amber-400/80 text-sm">{c.email}</p>
                          <p className="text-neutral-500 text-xs mt-1">{c.subject} • {new Date(c.created_at).toLocaleDateString()}</p>
                          <div className="mt-3 bg-neutral-800/30 rounded-xl p-4">
                            <p className="text-neutral-300 text-sm leading-relaxed">{c.message}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings">
            <div className="max-w-2xl">
              <Card className="glass-card overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-300" />
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2 text-lg">
                    <Github className="h-5 w-5 text-amber-400" />
                    GitHub Storage Settings
                  </CardTitle>
                  <p className="text-neutral-400 text-sm">
                    Configure where your data is saved. All scholarships, applications, and messages will be stored as JSON files in your GitHub repo.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {githubConfigured && (
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex items-center gap-3">
                      <Database className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-green-400 font-medium text-sm">GitHub Connected</p>
                        <p className="text-green-400/70 text-xs">Repo: {githubRepo} | Branch: {githubBranch}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label className="text-neutral-300 text-sm flex items-center gap-2">
                        <Key className="w-3 h-3" /> GitHub Token *
                      </Label>
                      <Input 
                        type="password"
                        value={githubToken}
                        onChange={e => setGithubToken(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                      />
                      <p className="text-xs text-neutral-500 mt-1">
                        Get token from <a href="https://github.com/settings/tokens" target="_blank" className="text-amber-400 hover:underline">github.com/settings/tokens</a>. Select "repo" scope.
                      </p>
                    </div>

                    <div>
                      <Label className="text-neutral-300 text-sm flex items-center gap-2">
                        <Github className="w-3 h-3" /> Repository *
                      </Label>
                      <Input 
                        value={githubRepo}
                        onChange={e => setGithubRepo(e.target.value)}
                        placeholder="username/scholarmall-pro"
                        className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Format: username/repo-name</p>
                    </div>

                    <div>
                      <Label className="text-neutral-300 text-sm">Branch</Label>
                      <Input 
                        value={githubBranch}
                        onChange={e => setGithubBranch(e.target.value)}
                        placeholder="main"
                        className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                      />
                      <p className="text-xs text-neutral-500 mt-1">Default: main</p>
                    </div>

                    {settingsError && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                        <p className="text-red-400 text-sm">{settingsError}</p>
                      </div>
                    )}

                    <Button 
                      onClick={saveGithubSettings}
                      disabled={savingSettings || !githubToken || !githubRepo}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl h-11"
                    >
                      {savingSettings ? (
                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Testing & Saving...</>
                      ) : (
                        <><Save className="mr-2 h-4 w-4" /> Save GitHub Settings</>
                      )}
                    </Button>
                  </div>

                  <div className="border-t border-neutral-800 pt-6">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4 text-amber-400" /> How It Works
                    </h3>
                    <div className="space-y-2 text-sm text-neutral-400">
                      <p>1. Create a GitHub token with <strong className="text-white">repo</strong> access</p>
                      <p>2. Enter your repo name (e.g., <code className="text-amber-400">yourname/scholarmall-pro</code>)</p>
                      <p>3. Create empty JSON files in your repo: <code className="text-amber-400">data/scholarships.json</code>, <code className="text-amber-400">data/applications.json</code>, <code className="text-amber-400">data/contacts.json</code></p>
                      <p>4. All changes auto-commit to your repo — data persists forever</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Scholarship Form Dialog */}
        <Dialog open={showScholarshipForm} onOpenChange={setShowScholarshipForm}>
          <DialogContent className="glass-card border-neutral-800 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white text-xl">
                {editingScholarship ? "Edit Scholarship" : "Add New Scholarship"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <Label className="text-neutral-300 text-sm">Title *</Label>
                <Input 
                  value={scholarshipForm.title} 
                  onChange={e => setScholarshipForm({...scholarshipForm, title: e.target.value})}
                  className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                  placeholder="e.g., Rhodes Scholarship 2026"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-neutral-300 text-sm">Amount *</Label>
                  <Input 
                    value={scholarshipForm.amount} 
                    onChange={e => setScholarshipForm({...scholarshipForm, amount: e.target.value})}
                    className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                    placeholder="e.g., $50,000"
                  />
                </div>
                <div>
                  <Label className="text-neutral-300 text-sm">Deadline *</Label>
                  <Input 
                    type="date"
                    value={scholarshipForm.deadline} 
                    onChange={e => setScholarshipForm({...scholarshipForm, deadline: e.target.value})}
                    className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-neutral-300 text-sm">Category *</Label>
                  <select
                    value={scholarshipForm.category}
                    onChange={e => setScholarshipForm({...scholarshipForm, category: e.target.value})}
                    className="flex h-10 w-full rounded-xl border border-neutral-700 bg-neutral-800/50 px-3 py-2 text-sm text-white mt-1"
                  >
                    <option>STEM</option>
                    <option>Arts</option>
                    <option>Business</option>
                    <option>Medicine</option>
                    <option>Engineering</option>
                    <option>Social Sciences</option>
                    <option>Law</option>
                  </select>
                </div>
                <div>
                  <Label className="text-neutral-300 text-sm">Country *</Label>
                  <Input 
                    value={scholarshipForm.country} 
                    onChange={e => setScholarshipForm({...scholarshipForm, country: e.target.value})}
                    className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                    placeholder="e.g., USA"
                  />
                </div>
              </div>
              <div>
                <Label className="text-neutral-300 text-sm">Image URL</Label>
                <Input 
                  value={scholarshipForm.image_url} 
                  onChange={e => setScholarshipForm({...scholarshipForm, image_url: e.target.value})}
                  className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                  placeholder="https://example.com/image.jpg (optional)"
                />
              </div>
              <div>
                <Label className="text-neutral-300 text-sm">Eligibility *</Label>
                <Textarea 
                  value={scholarshipForm.eligibility} 
                  onChange={e => setScholarshipForm({...scholarshipForm, eligibility: e.target.value})}
                  className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                  placeholder="Who can apply?"
                  rows={2}
                />
              </div>
              <div>
                <Label className="text-neutral-300 text-sm">Description *</Label>
                <Textarea 
                  value={scholarshipForm.description} 
                  onChange={e => setScholarshipForm({...scholarshipForm, description: e.target.value})}
                  className="mt-1 bg-neutral-800/50 border-neutral-700 rounded-xl"
                  placeholder="Full description of the scholarship..."
                  rows={4}
                />
              </div>
              <div className="flex gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowScholarshipForm(false)}
                  className="flex-1 border-neutral-700 text-neutral-300 hover:bg-neutral-800 rounded-xl"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={saveScholarship}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-xl"
                >
                  {editingScholarship ? "Update Scholarship" : "Add Scholarship"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
