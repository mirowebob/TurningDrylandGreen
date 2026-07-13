/**
 * TDG API service — all calls go to the Spring Boot backend at port 6000.
 */
const BASE_URL = import.meta.env.TDG_API_BASE_URL ?? "https://tdg-backend-0hzq.onrender.co";

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
  shortDescription: string;
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
  id?: number;
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


export interface StkPushResult {
  response?: {
    MerchantRequestID: string;
    CheckoutRequestID: string;
    ResponseCode: string;
    ResponseDescription: string;
    CustomerMessage: string;
  };
}

export interface TransactionStatus {
  invoiceNumber: string;
  checkoutRequestId: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  receiptNumber?: string;
  resultDescription?: string;
}

// ─── Problems ─────────────────────────────────────────────────────────────────

/**
 * Fetch all problems from the public endpoint.
 */
export async function fetchProblems(): Promise<ProblemImageDTO[]> {
  console.log("fetching images");
  const res = await axios.get<ProblemImageDTO[]>(`${BASE_URL}/api/problems`);
  return res.data;
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

  const res = await axios.post<string>(`${BASE_URL}/admin/register-problem`, form);
  return res.data;
}

/**
 * Delete a problem by ID (admin action).
 */
export async function deleteProblem(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/admin/problems/${id}`);
}

// ─── Projects ─────────────────────────────────────────────────────────────────

/**
 * Fetch all projects from the public endpoint.
 */
export async function fetchProjects(): Promise<ProjectDTO[]> {
  const res = await axios.get<ProjectDTO[]>(`${BASE_URL}/api/projects`);
  return res.data;
}

/**
 * Create a new project (admin action). Sends multipart form data.
 */
export async function createProject(data: {
  title: string;
  shortDescription: string;
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
  form.append("shortDescription", data.shortDescription);
  form.append("description", data.description);
  form.append("status", data.status);
  form.append("location", data.location);
  form.append("county", data.county);
  form.append("communityName", data.communityName);
  if (data.impact) form.append("impact", data.impact);
  if (data.outcome) form.append("outcome", data.outcome);
  data.images.forEach((file) => form.append("images", file));
  data.tags.forEach((tag) => form.append("tags", tag));

  await axios.post(`${BASE_URL}/admin/add-project`, form);
}

/**
 * Delete a project by ID (admin action).
 */
export async function deleteProject(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/admin/projects/${id}`);
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

/**
 * Fetch all testimonials from the public endpoint.
 */
export async function fetchTestimonials(): Promise<TestimonialDTO[]> {
  const res = await axios.get<TestimonialDTO[]>(`${BASE_URL}/api/testimonials`);
  return res.data;
}

/**
 * Create a new testimonial (admin action). Sends JSON body.
 */
export async function createTestimonial(data: {
  message: string;
  name: string;
  role: string;
}): Promise<void> {
  await axios.post(`${BASE_URL}/admin/add-testimonials`, data);
}

/**
 * Delete a testimonial by ID (admin action).
 */
export async function deleteTestimonial(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/admin/testimonials/${id}`);
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
    console.log("creating admin user");
    const res = await axios.post(`${BASE_URL}/admin/create-profile`, formData);
    console.log("the response is ", res.data);
  } catch (err) {
    console.log(err);
  }
}

/**
 * Update an admin profile by ID (admin action). Sends multipart form data.
 */
export async function updateAdminProfile(id: number, formData: FormData): Promise<void> {
  await axios.put(`${BASE_URL}/admin/profiles/${id}`, formData);
}

/**
 * Delete an admin profile by ID (admin action).
 */
export async function deleteAdminProfile(id: number): Promise<void> {
  await axios.delete(`${BASE_URL}/admin/profiles/${id}`);
}

/**
 * Update an existing project by ID (admin action). Sends multipart form data.
 */
export async function updateProject(
  id: number,
  data: {
    title?: string;
    description?: string;
    shortDescription?: string;
    status?: "ONGOING" | "COMPLETED";
    location?: string;
    county?: string;
    images?: File[];
    communityName?: string;
    impact?: string;
    outcome?: string;
    tags?: string[];
  }
): Promise<void> {
  const form = new FormData();
  if (data.title !== undefined) form.append("title", data.title);
  if (data.shortDescription !== undefined) form.append("shortDescription", data.shortDescription);
  if (data.description !== undefined) form.append("description", data.description);
  if (data.status !== undefined) form.append("status", data.status);
  if (data.location !== undefined) form.append("location", data.location);
  if (data.county !== undefined) form.append("county", data.county);
  if (data.communityName !== undefined) form.append("communityName", data.communityName);
  if (data.impact !== undefined) form.append("impact", data.impact);
  if (data.outcome !== undefined) form.append("outcome", data.outcome);
  if (data.images) {
    data.images.forEach((file) => form.append("images", file));
  }
  if (data.tags) {
    data.tags.forEach((tag) => form.append("tags", tag));
  }

  await axios.put(`${BASE_URL}/admin/projects/${id}`, form);
}

/**
 * Update an existing testimonial by ID (admin action). Sends JSON body.
 */
export async function updateTestimonial(
  id: number,
  data: {
    message: string;
    name: string;
    role: string;
  }
): Promise<void> {
  await axios.put(`${BASE_URL}/admin/testimonials/${id}`, data);
}

/**
 * Update an existing problem by ID (admin action). Sends multipart form data.
 */
export async function updateProblem(
  id: number,
  data: {
    problemTitle?: string;
    problemDescription?: string;
    tag?: string;
    files?: File[];
  }
): Promise<void> {
  const form = new FormData();
  if (data.problemTitle !== undefined) form.append("problemTitle", data.problemTitle);
  if (data.problemDescription !== undefined) form.append("problemDescription", data.problemDescription);
  if (data.tag !== undefined) form.append("tag", data.tag);
  if (data.files) {
    data.files.forEach((f) => form.append("multipartFileList", f));
  }

  await axios.put(`${BASE_URL}/admin/problems/${id}`, form);
}


export async function initiateStkPush(params: {
  phoneNumber: string;
  amount: number;
  invoiceNumber: string;
  description: string;
}): Promise<StkPushResult> {
  const res = await fetch(`${BASE_URL}/api/payments/stk-push`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || body.details || "Failed to start payment");
  }
  return res.json();
}

export async function getTransactionStatus(invoiceNumber: string): Promise<TransactionStatus | null> {
  const res = await fetch(`${BASE_URL}/api/payments/status/${invoiceNumber}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to check payment status");
  return res.json();
}


/**
 * Polls the status endpoint until SUCCESS/FAILED or timeout.
 */
export async function pollTransactionStatus(
  invoiceNumber: string,
  { intervalMs = 3000, timeoutMs = 90000 } = {}
): Promise<TransactionStatus> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const status = await getTransactionStatus(invoiceNumber);
    if (status && status.status !== "PENDING") return status;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("Payment confirmation timed out. Check your phone or try again.");
}

export async function fetchProjectById(id: string) {
  const res = await axios.get<ProjectDTO>(`${BASE_URL}/api/projects/${id}`);
  return res.data;

}