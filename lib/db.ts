"use server";

import { Scholarship, Application, Contact } from "@/types";
import { supabase } from "./supabase";

// ===== SCHOLARSHIPS =====

export async function getScholarships(): Promise<Scholarship[]> {
  "use server";
  const { data, error } = await supabase
    .from("scholarships")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[DB] getScholarships error:", error);
    return [];
  }
  return data || [];
}

export async function getScholarshipById(id: string): Promise<Scholarship | null> {
  "use server";
  const { data, error } = await supabase
    .from("scholarships")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("[DB] getScholarshipById error:", error);
    return null;
  }
  return data;
}

export async function createScholarship(scholarship: Scholarship): Promise<void> {
  "use server";
  const { error } = await supabase.from("scholarships").insert(scholarship);
  if (error) {
    console.error("[DB] createScholarship error:", error);
    throw new Error("Failed to create scholarship: " + error.message);
  }
}

export async function updateScholarship(id: string, updates: Partial<Scholarship>): Promise<void> {
  "use server";
  const { error } = await supabase.from("scholarships").update(updates).eq("id", id);
  if (error) {
    console.error("[DB] updateScholarship error:", error);
    throw new Error("Failed to update scholarship: " + error.message);
  }
}

export async function deleteScholarship(id: string): Promise<void> {
  "use server";
  const { error } = await supabase.from("scholarships").delete().eq("id", id);
  if (error) {
    console.error("[DB] deleteScholarship error:", error);
    throw new Error("Failed to delete scholarship: " + error.message);
  }
}

// ===== APPLICATIONS =====

export async function getApplications(): Promise<Application[]> {
  "use server";
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[DB] getApplications error:", error);
    return [];
  }
  return data || [];
}

export async function getApplicationById(id: string): Promise<Application | null> {
  "use server";
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("[DB] getApplicationById error:", error);
    return null;
  }
  return data;
}

export async function createApplication(application: Application): Promise<void> {
  "use server";
  const { error } = await supabase.from("applications").insert(application);
  if (error) {
    console.error("[DB] createApplication error:", error);
    throw new Error("Failed to create application: " + error.message);
  }
}

export async function updateApplicationStatus(
  id: string,
  status: "accepted" | "rejected",
  admin_message: string
): Promise<void> {
  "use server";
  const { error } = await supabase
    .from("applications")
    .update({ status, admin_message })
    .eq("id", id);
  if (error) {
    console.error("[DB] updateApplicationStatus error:", error);
    throw new Error("Failed to update application: " + error.message);
  }
}

// ===== CONTACTS =====

export async function getContacts(): Promise<Contact[]> {
  "use server";
  const { data, error } = await supabase
    .from("contacts")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[DB] getContacts error:", error);
    return [];
  }
  return data || [];
}

export async function createContact(contact: Contact): Promise<void> {
  "use server";
  const { error } = await supabase.from("contacts").insert(contact);
  if (error) {
    console.error("[DB] createContact error:", error);
    throw new Error("Failed to create contact: " + error.message);
  }
}

export async function markContactAsRead(id: string): Promise<void> {
  "use server";
  const { error } = await supabase.from("contacts").update({ read: true }).eq("id", id);
  if (error) {
    console.error("[DB] markContactAsRead error:", error);
    throw new Error("Failed to mark contact as read: " + error.message);
  }
}
