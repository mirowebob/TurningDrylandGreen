/**
 * TDG API service — all calls go to the Spring Boot backend at port 6000.
 */
const BASE_URL = import.meta.env.TDG_API_BASE_URL ?? "http://localhost:8082";

import "axios";
import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProblemImageDTO {
  id: number;
  title: string;
  description: string;
  tag: string | null;
  imageUrls: string[];
}

export interface ProjectDTO {
  id: number;
  title: string;
  description: string;
  status: "ONGOING" | "COMPLETED";
  location: string;
  county: string;
  images: string[];
  communityName: string;
  impact: string | null;
  outcome: string | null;
  tags: string[];
}

export interface AdminProfileDTO {
  fullName: string;
  title: string;
  message: string;
  profileImageUrl?: string;
}

export interface TestimonialDTO {
  id: number;
  message: string;
  name: string;
  role: string;
}

// ─── Problems ─────────────────────────────────────────────────────────────────

/**
 * Fetch all problems from the public endpoint.
 */
export async function fetchProblems(): Promise<ProblemImageDTO[]> {
  console.log("fetching images")
  const res = await fetch(`${BASE_URL}/api/problems`);
  if (!res.ok) throw new Error(`Failed to fetch problems: ${res.status}`);
  return res.json();
}

/**
 * Create a new problem (admin action). Sends multipart form data.
 */
export async function createProblem(data: {
  problemTitle: string;
  problemDescription: string;
  tag: string;
  files: File[];
}): Promise<string> {
  const form = new FormData();
  form.append("problemTitle", data.problemTitle);
  form.append("problemDescription", data.problemDescription);
  form.append("tag", data.tag);
  data.files.forEach((f) => form.append("multipartFileList", f));

  const res = await fetch(`${BASE_URL}/admin/register-problem`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Server error ${res.status}`);
  }
  return res.text();
}

/**
 * Delete a problem by ID (admin action).
 */
export async function deleteProblem(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/problems/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete problem: ${res.status}`);
}

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * Fetch all projects from the public endpoint.
 */
export async function fetchProjects(): Promise<ProjectDTO[]> {
  const res = await fetch(`${BASE_URL}/api/projects`);
  if (!res.ok) throw new Error(`Failed to fetch projects: ${res.status}`);
  return res.json();
}

/**
 * Create a new project (admin action). Sends multipart form data.
 */
export async function createProject(data: {
  title: string;
  description: string;
  status: "ONGOING" | "COMPLETED";
  location: string;
  county: string;
  images: File[];
  communityName: string;
  impact?: string;
  outcome?: string;
  tags: string[];
}): Promise<void> {
  const form = new FormData();
  form.append("title", data.title);
  form.append("description", data.description);
  form.append("status", data.status);
  form.append("location", data.location);
  form.append("county", data.county);
  form.append("communityName", data.communityName);
  if (data.impact) form.append("impact", data.impact);
  if (data.outcome) form.append("outcome", data.outcome);
  data.images.forEach((file) => form.append("images", file));
  data.tags.forEach((tag) => form.append("tags", tag));

  const res = await fetch(`${BASE_URL}/admin/add-project`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Failed to create project: ${res.status}`);
  }
}

/**
 * Delete a project by ID (admin action).
 */
export async function deleteProject(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/projects/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete project: ${res.status}`);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

/**
 * Fetch all testimonials from the public endpoint.
 */
export async function fetchTestimonials(): Promise<TestimonialDTO[]> {
  const res = await fetch(`${BASE_URL}/api/testimonials`);
  if (!res.ok) throw new Error(`Failed to fetch testimonials: ${res.status}`);
  return res.json();
}

/**
 * Create a new testimonial (admin action). Sends JSON body.
 */
export async function createTestimonial(data: {
  message: string;
  name: string;
  role: string;
}): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/add-testimonials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(`Failed to create testimonial: ${res.status}`);
  }
}

/**
 * Delete a testimonial by ID (admin action).
 */
export async function deleteTestimonial(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/testimonials/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to delete testimonial: ${res.status}`);
}

/**
 * Fetch all admin profiles from the public endpoint.
 */
export async function fetchAdminProfiles(): Promise<AdminProfileDTO[]> {
  const res = await axios.get(`${BASE_URL}/api/profiles`);
  return res.data;
}

/**
 * Create a new admin profile (admin action). Sends multipart form data.
 */
export async function createAdminProfile(formData: FormData): Promise<void> {
  try {
    console.log("creating admin user")
    const res = await axios.post(`${BASE_URL}/admin/create-profile`, formData)
    {/*const res = await fetch(`${BASE_URL}/admin/create-profile`, {
    method: "POST",
    body: formData,
  });*/}
    console.log("the response is ", res.data)
  } catch (err) {
    console.log(err)
  }

}
