import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ImagePlus,
  FolderKanban,
  ShieldCheck,
  TrendingUp,
  Users,
  Compass,
  FileText,
  Activity,
  UserCog,
  PlusCircle,
  Loader2,
  CheckCircle2,
  XCircle
} from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { fetchProblems, fetchProjects, fetchTestimonials, fetchAdminProfiles, createAdminProfile } from "../../services/api";
import type { AdminProfileDTO } from "../../services/api";

type Status = { type: "success" | "error"; message: string } | null;

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    problems: 0,
    projects: 0,
    testimonials: 0,
    profiles: 0,
  });
  const [loading, setLoading] = useState(true);

  // Admin profile form state
  const [fullName, setFullName] = useState("");
  const [profileTitle, setProfileTitle] = useState("");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  
  const [profiles, setProfiles] = useState<AdminProfileDTO[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadStatsAndProfiles = async () => {
    setLoading(true);
    setLoadingProfiles(true);
    try {
      const [probs, projs, tests, profs] = await Promise.all([
        fetchProblems().catch(() => []),
        fetchProjects().catch(() => []),
        fetchTestimonials().catch(() => []),
        fetchAdminProfiles().catch(() => []),
      ]);
      setStats({
        problems: probs.length,
        projects: projs.length,
        testimonials: tests.length,
        profiles: profs.length,
      });
      setProfiles(profs);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
      setLoadingProfiles(false);
    }
  };

  useEffect(() => {
    loadStatsAndProfiles();
  }, []);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setProfileFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !profileTitle.trim() || !profileMessage.trim()) {
      setStatus({ type: "error", message: "Full Name, Title, and Message are required." });
      return;
    }

    setSubmittingProfile(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("fullName", fullName.trim());
      formData.append("title", profileTitle.trim());
      formData.append("message", profileMessage.trim());
      if (profileFile) {
        formData.append("profileImage", profileFile);
      }

      await createAdminProfile(formData);
      setStatus({ type: "success", message: "Admin profile created successfully!" });
      
      // Reset form
      setFullName("");
      setProfileTitle("");
      setProfileMessage("");
      setProfileFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      await loadStatsAndProfiles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Unexpected error saving profile.";
      setStatus({ type: "error", message: msg });
    } finally {
      setSubmittingProfile(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060b07] text-white">
      <Navbar />

      <main className="px-6 pb-24 pt-32 md:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl space-y-10">
          
          {/* Hero Header Banner */}
          <div className="relative overflow-hidden rounded-[2.5rem] border border-emerald-500/10 bg-[linear-gradient(135deg,rgba(15,31,20,0.95),rgba(27,53,30,0.9))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.4)] md:p-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px]" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-sage/5 blur-[80px]" />

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-300">
                <ShieldCheck size={14} className="animate-pulse" />
                Control Panel
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl max-w-3xl">
                Turning Drylands Green Dashboard
              </h1>
              <p className="max-w-2xl text-base md:text-lg leading-relaxed text-white/70">
                Configure your initiative's public footprint. Publish projects, update environmental challenges, highlight testimony, and manage team profiles.
              </p>
            </div>
          </div>

          {/* Status Feedback Banner */}
          {status && (
            <div
              className={`flex items-center justify-between gap-4 rounded-xl border px-5 py-3 text-sm font-medium ${
                status.type === "success"
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                  : "border-rose-400/30 bg-rose-500/10 text-rose-200"
              }`}
            >
              <span className="flex items-center gap-2">
                {status.type === "success" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {status.message}
              </span>
              <button onClick={() => setStatus(null)} className="opacity-60 hover:opacity-100 transition-opacity">
                ✕
              </button>
            </div>
          )}

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Problems Listed", value: stats.problems, icon: Compass, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
              { label: "Active Projects", value: stats.projects, icon: TrendingUp, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
              { label: "Testimonials", value: stats.testimonials, icon: Users, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
              { label: "Admin Profiles", value: stats.profiles, icon: UserCog, color: "text-purple-400 bg-purple-500/10 border-purple-500/20 pointer-events-auto cursor-pointer", onClick: () => document.getElementById("admin-profile-form")?.scrollIntoView({ behavior: "smooth" }) },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={i} 
                  onClick={stat.onClick}
                  className={`rounded-2xl border p-5 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] ${stat.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-wider text-white/50">{stat.label}</span>
                    <Icon size={18} />
                  </div>
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-3xl font-bold tracking-tight">
                      {loading ? "..." : stat.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid: Forms & Quick Links */}
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            
            {/* Left: Admin Profiles Manager Form */}
            <div id="admin-profile-form" className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur-sm space-y-6 scroll-mt-28">
              <div className="flex items-center gap-2 text-purple-300">
                <UserCog size={18} />
                <h2 className="text-xl font-semibold text-white">Create Admin Profile</h2>
              </div>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-sm text-white/80">
                    <span className="mb-2 block">Full Name *</span>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-emerald-400/50"
                      placeholder="Jane Doe"
                    />
                  </label>
                  <label className="block text-sm text-white/80">
                    <span className="mb-2 block">Title / Position *</span>
                    <input
                      value={profileTitle}
                      onChange={(e) => setProfileTitle(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-emerald-400/50"
                      placeholder="Chief Environmental Officer"
                    />
                  </label>
                </div>

                <label className="block text-sm text-white/80">
                  <span className="mb-2 block">Personal Message *</span>
                  <textarea
                    value={profileMessage}
                    onChange={(e) => setProfileMessage(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-emerald-400/50"
                    placeholder="Describe your motivation or role in turning drylands green."
                  />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="block text-sm text-white/80">
                    <span className="mb-2 block">Profile Image</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full rounded-xl border border-dashed border-white/15 bg-[#0e1b14] px-4 py-3 text-white file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:px-3 file:py-1 file:text-xs file:font-medium file:text-emerald-200"
                    />
                  </label>
                  {previewUrl && (
                    <div className="flex items-center justify-center p-2 border border-white/10 rounded-xl overflow-hidden bg-black/20">
                      <img src={previewUrl} alt="Preview" className="h-16 w-16 rounded-full object-cover border border-white/20" />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={submittingProfile}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 font-semibold text-[#07110b] transition hover:bg-emerald-300 disabled:opacity-50"
                >
                  {submittingProfile ? (
                    <><Loader2 size={18} className="animate-spin" /> Saving...</>
                  ) : (
                    <><PlusCircle size={18} /> Save Admin Profile</>
                  )}
                </button>
              </form>

              {/* Profiles list */}
              <div className="mt-8 space-y-4">
                <h3 className="font-semibold text-white/70">Registered Profiles ({profiles.length})</h3>
                {loadingProfiles ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 size={24} className="animate-spin text-purple-300" />
                  </div>
                ) : profiles.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-sm text-white/70">
                    No admin profiles created yet.
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {profiles.map((profile, index) => (
                      <div key={index} className="rounded-xl border border-white/10 bg-black/20 p-4 flex gap-3 items-start">
                        {profile.profileImageUrl ? (
                          <img src={profile.profileImageUrl} alt={profile.fullName} className="w-12 h-12 rounded-full object-cover border border-white/20 shrink-0" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-200 flex items-center justify-center font-bold uppercase shrink-0">
                            {profile.fullName.substring(0, 2)}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-semibold text-white text-sm truncate">{profile.fullName}</h4>
                          <p className="text-xs text-purple-300 truncate">{profile.title}</p>
                          <p className="mt-2 text-xs text-white/70 line-clamp-2 italic">"{profile.message}"</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Navigation & Actions links */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">Management Links</h2>
              </div>
              
              <div className="grid gap-4">
                <Link
                  to="/admin/problem-images"
                  className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                      <ImagePlus size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-emerald-300 transition-colors">Problem Images</h3>
                      <p className="mt-1 text-xs text-white/60">Highlight land degradation and community issues.</p>
                    </div>
                  </div>
                </Link>

                <Link
                  to="/admin/content"
                  className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:border-amber-500/30 hover:bg-white/10"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      <FolderKanban size={18} />
                    </div>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-amber-300 transition-colors">Projects & Testimonials</h3>
                      <p className="mt-1 text-xs text-white/60">Publish restoration details and community quotes.</p>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Informational Help Banner */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <FileText size={18} />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white">Cloudinary Optimized</h4>
                    <p className="text-xs leading-relaxed text-white/60">
                      Images uploaded here are configured for responsive layout sizes instantly to reduce layout shifts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;

