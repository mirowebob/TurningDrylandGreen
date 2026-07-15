import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
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
  XCircle,
  Pencil,
  Trash2,
  ArrowUpRight,
  Upload,
  AlertCircle,
  LayoutDashboard,
  ArrowLeft,
  Menu,
  X,
  ShieldAlert
} from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import {
  fetchProblems,
  fetchProjects,
  fetchTestimonials,
  fetchAdminProfiles,
  createAdminProfile,
  updateAdminProfile,
  deleteAdminProfile
} from "../../services/api";
import type { AdminProfileDTO } from "../../services/api";

type Status = { type: "success" | "error"; message: string } | null;

const AdminDashboardPage = () => {
  const location = useLocation();
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
  const [profileMessage, setProfileMessage] = useState(" add admin message");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<AdminProfileDTO[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [submittingProfile, setSubmittingProfile] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  // Edit & delete state
  const [editingProfileId, setEditingProfileId] = useState<number | null>(null);
  const [deletingProfileId, setDeletingProfileId] = useState<number | null>(null);

  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Navigation items with their routes
  const navItems = [
    {
      label: "Dashboard Overview",
      path: "/admin",
      icon: LayoutDashboard,
      description: "Main dashboard & statistics"
    },
    {
      label: "Problem Images",
      path: "/admin/problem-images",
      icon: ImagePlus,
      description: "Environmental issue galleries"
    },
    {
      label: "Projects & Content",
      path: "/admin/content",
      icon: FolderKanban,
      description: "Projects and testimonials"
    },
    {
      label: "Team Profiles",
      path: "/admin#admin-profile-form",
      icon: UserCog,
      description: "Manage team members"
    },
    {
      label: "Reset Password",
      path: "/admin-recovery",
      icon: ShieldAlert,
      description: "admin password reset"
    }
  ];

  const isCurrentPath = (path: string) => {
    if (path.includes('#')) {
      return location.pathname === '/admin' && location.hash === '#admin-profile-form';
    }
    return location.pathname === path;
  };

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

  const handleDeleteProfile = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this admin profile?")) {
      return;
    }
    setDeletingProfileId(id);
    setStatus(null);
    try {
      await deleteAdminProfile(id);
      setStatus({ type: "success", message: "Admin profile deleted successfully." });
      await loadStatsAndProfiles();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete profile.";
      setStatus({ type: "error", message: msg });
    } finally {
      setDeletingProfileId(null);
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
        formData.append("image", profileFile);
      }

      if (editingProfileId !== null) {
        await updateAdminProfile(editingProfileId, formData);
        setStatus({ type: "success", message: "Admin profile updated successfully!" });
        setEditingProfileId(null);
      } else {
        await createAdminProfile(formData);
        setStatus({ type: "success", message: "Admin profile created successfully!" });
      }

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
        <div className="mx-auto max-w-7xl space-y-8">

          {/* Enhanced Navigation Bar */}
          <div className="sticky top-24 z-30">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
              {/* Desktop Navigation */}
              <div className="hidden md:block px-6 py-3">
                <div className="flex items-center gap-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isCurrentPath(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`
                          group relative flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200
                          ${isActive
                            ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-white shadow-lg shadow-emerald-500/10 border border-emerald-500/30'
                            : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10'
                          }
                        `}
                      >
                        <Icon size={16} className={isActive ? 'text-emerald-400' : 'text-white/40 group-hover:text-white/70'} />
                        <span>{item.label}</span>
                        {isActive && (
                          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-full" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden">
                <div className="flex items-center justify-between px-4 py-3">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                    <span>Admin Navigation</span>
                  </button>
                  <div className="text-xs text-white/40">
                    {navItems.find(item => isCurrentPath(item.path))?.label || 'Dashboard'}
                  </div>
                </div>

                {mobileMenuOpen && (
                  <div className="border-t border-white/10 px-4 py-3 space-y-2">
                    {navItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = isCurrentPath(item.path);
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`
                            flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all
                            ${isActive
                              ? 'bg-emerald-500/20 text-white border border-emerald-500/30'
                              : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                            }
                          `}
                        >
                          <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-white/40'} />
                          <div>
                            <div>{item.label}</div>
                            <div className="text-xs text-white/40">{item.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-sm">
            <Link to="/admin" className="text-white/40 hover:text-white/70 transition-colors flex items-center gap-1">
              <LayoutDashboard size={14} />
              <span>Dashboard</span>
            </Link>
            <span className="text-white/20">/</span>
            <span className="text-white/60">
              {navItems.find(item => isCurrentPath(item.path))?.label || 'Overview'}
            </span>
          </div>

          {/* Quick Navigation Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isCurrentPath(item.path);
              const statsKey = item.label === "Problem Images" ? "problems" :
                item.label === "Projects & Content" ? "projects" :
                  item.label === "Team Profiles" ? "profiles" : null;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
                    ${isActive
                      ? 'bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                    }
                  `}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`
                      h-10 w-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110
                      ${isActive ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-white/10 border border-white/10'}
                    `}>
                      <Icon size={18} className={isActive ? 'text-emerald-400' : 'text-white/60 group-hover:text-white'} />
                    </div>
                    {isActive && (
                      <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${isActive ? 'text-white' : 'text-white/70 group-hover:text-white'}`}>
                    {item.label}
                  </h3>
                  <p className="text-xs text-white/40 line-clamp-1">{item.description}</p>
                  {statsKey && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <span className="text-2xl font-bold text-white/90">
                        {loading ? '...' : stats[statsKey]}
                      </span>
                      <span className="text-xs text-white/40 ml-1">items</span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Enhanced Hero Header */}
          <div className="relative overflow-hidden rounded-3xl border border-emerald-500/15 bg-gradient-to-br from-[#0a1a0f] via-[#0f1f14] to-[#07130a] p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-600/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    Administration Panel
                  </div>
                  <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight bg-gradient-to-r from-white via-white to-emerald-200 bg-clip-text text-transparent">
                    Turning Drylands Green
                  </h1>
                  <p className="max-w-2xl text-base md:text-lg leading-relaxed text-white/60">
                    Manage your initiative's public presence. Publish projects, track environmental challenges,
                    showcase testimonials, and maintain team profiles all from one centralized dashboard.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/admin/problem-images"
                    className="hidden md:flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2.5 text-sm font-medium text-emerald-300 hover:bg-emerald-500/20 transition-all"
                  >
                    <ImagePlus size={16} />
                    <span>Add Content</span>
                    <ArrowUpRight size={14} />
                  </Link>
                  <Link
                    to="/admin#admin-profile-form"
                    className="hidden md:flex items-center gap-2 rounded-xl bg-purple-500/10 border border-purple-500/20 px-4 py-2.5 text-sm font-medium text-purple-300 hover:bg-purple-500/20 transition-all"
                  >
                    <UserCog size={16} />
                    <span>Manage Team</span>
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Status Banner */}
          {status && (
            <div
              className={`flex items-center justify-between gap-4 rounded-2xl border px-6 py-4 text-sm font-medium shadow-lg ${status.type === "success"
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                : "border-red-400/30 bg-red-500/10 text-red-100"
                }`}
            >
              <div className="flex items-center gap-3">
                {status.type === "success" ? (
                  <CheckCircle2 size={20} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={20} className="text-red-400" />
                )}
                <span>{status.message}</span>
              </div>
              <button
                onClick={() => setStatus(null)}
                className="rounded-lg p-1.5 hover:bg-white/10 transition-colors"
              >
                <XCircle size={16} />
              </button>
            </div>
          )}

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Environmental Problems",
                value: stats.problems,
                icon: Compass,
                color: "from-emerald-500/10 to-emerald-600/5 border-emerald-500/20",
                iconColor: "text-emerald-400",
                accent: "bg-emerald-500/20",
                link: "/admin/problem-images"
              },
              {
                label: "Active Projects",
                value: stats.projects,
                icon: TrendingUp,
                color: "from-amber-500/10 to-amber-600/5 border-amber-500/20",
                iconColor: "text-amber-400",
                accent: "bg-amber-500/20",
                link: "/admin/content"
              },
              {
                label: "Testimonials",
                value: stats.testimonials,///admin-recovery
                icon: Users,
                color: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
                iconColor: "text-blue-400",
                accent: "bg-blue-500/20",
                link: "/admin/content"
              },
              {
                label: "Team Members",
                value: stats.profiles,
                icon: UserCog,
                color: "from-purple-500/10 to-purple-600/5 border-purple-500/20 cursor-pointer hover:border-purple-400/40",
                iconColor: "text-purple-400",
                accent: "bg-purple-500/20",
                link: "/admin#admin-profile-form"
              },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={i}
                  to={stat.link}
                  className={`group relative overflow-hidden rounded-2xl border bg-gradient-to-br ${stat.color} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl block`}
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 ${stat.accent} rounded-bl-3xl -translate-y-1/2 translate-x-1/4 opacity-50`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/50">{stat.label}</span>
                      <div className="flex items-center gap-2">
                        <Icon size={20} className={stat.iconColor} />
                        <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/40 transition-colors" />
                      </div>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold tracking-tight">
                        {loading ? (
                          <Loader2 size={32} className="animate-spin text-white/30" />
                        ) : (
                          stat.value
                        )}
                      </span>
                      <span className="text-sm text-white/40">total</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Enhanced Main Content Grid */}
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">

            {/* Left: Admin Profiles Manager */}
            <div id="admin-profile-form" className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 space-y-6 scroll-mt-28">
              <div className="flex items-center justify-between pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                    <UserCog size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {editingProfileId !== null ? "Edit Team Member" : "Add Team Member"}
                    </h2>
                    <p className="text-sm text-white/50">Manage administrator profiles displayed on your platform</p>
                  </div>
                </div>
                <Link
                  to="/admin/content"
                  className="hidden sm:flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Content</span>
                </Link>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0a120d] px-4 py-3 text-white placeholder:text-white/30 outline-none ring-0 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/10 transition-all"
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Position / Title <span className="text-red-400">*</span>
                    </label>
                    <input
                      value={profileTitle}
                      onChange={(e) => setProfileTitle(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-[#0a120d] px-4 py-3 text-white placeholder:text-white/30 outline-none ring-0 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/10 transition-all"
                      placeholder="e.g., Chief Environmental Officer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-white/70">
                    Personal Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    value={profileMessage}
                    onChange={(e) => setProfileMessage(e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-white/10 bg-[#0a120d] px-4 py-3 text-white placeholder:text-white/30 outline-none ring-0 focus:border-purple-400/50 focus:ring-2 focus:ring-purple-500/10 transition-all resize-none"
                    placeholder="Share your motivation or role in environmental restoration..."
                  />
                  <p className="text-xs text-white/40">{profileMessage.length} characters</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-white/70">
                      Profile Image
                    </label>
                    <div className="relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full rounded-xl border border-dashed border-white/20 bg-[#0a120d] px-4 py-3 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-purple-500/20 file:px-4 file:py-2 file:text-sm file:font-medium file:text-purple-200 hover:file:bg-purple-500/30 transition-all cursor-pointer"
                      />
                      <Upload size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
                    </div>
                  </div>
                  {previewUrl && (
                    <div className="flex items-center gap-4 p-4 border border-white/10 rounded-xl bg-black/20">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-16 w-16 rounded-full object-cover border-2 border-purple-400/30 shadow-lg"
                      />
                      <div>
                        <p className="text-sm font-medium text-white/70">Image Preview</p>
                        <p className="text-xs text-white/40">This will be your profile photo</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={submittingProfile}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:from-purple-400 hover:to-purple-500 hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingProfile ? (
                      <><Loader2 size={18} className="animate-spin" /> Processing...</>
                    ) : editingProfileId !== null ? (
                      <><Pencil size={18} /> Update Profile</>
                    ) : (
                      <><PlusCircle size={18} /> Create Profile</>
                    )}
                  </button>
                  {editingProfileId !== null && (
                    <button
                      type="button"
                      onClick={() => {
                        setFullName("");
                        setProfileTitle("");
                        setProfileMessage("");
                        setProfileFile(null);
                        setPreviewUrl(null);
                        setEditingProfileId(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white transition-all hover:bg-white/10"
                    >
                      Cancel Editing
                    </button>
                  )}
                  <Link
                    to="/admin/content"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 font-semibold text-white/70 transition-all hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft size={16} />
                    Back to Content
                  </Link>
                </div>
              </form>

              {/* Profiles List */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white/80">
                    Registered Profiles
                    <span className="ml-2 text-sm font-normal text-white/40">({profiles.length} total)</span>
                  </h3>
                  <Link
                    to="/admin/problem-images"
                    className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
                  >
                    <span>Go to Problem Images</span>
                    <ArrowUpRight size={12} />
                  </Link>
                </div>

                {loadingProfiles ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={24} className="animate-spin text-purple-400" />
                  </div>
                ) : profiles.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-black/10 p-8 text-center">
                    <UserCog size={32} className="mx-auto mb-3 text-white/20" />
                    <p className="text-sm text-white/40">No team members added yet</p>
                    <p className="text-xs text-white/30 mt-1">Create your first admin profile above</p>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {profiles.map((profile) => (
                      <div
                        key={profile.id}
                        className="group rounded-xl border border-white/10 bg-white/5 p-4 hover:border-purple-500/30 hover:bg-white/10 transition-all"
                      >
                        <div className="flex gap-4">
                          {profile.profileImageUrl ? (
                            <img
                              src={profile.profileImageUrl}
                              alt={profile.fullName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-purple-400/20 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/20 text-purple-200 flex items-center justify-center font-bold uppercase shrink-0 border border-purple-400/20">
                              {profile.fullName.substring(0, 2)}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-white text-sm truncate">{profile.fullName}</h4>
                            <p className="text-xs text-purple-300/70 truncate">{profile.title}</p>
                            <p className="mt-2 text-xs text-white/50 line-clamp-2 italic">"{profile.message}"</p>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
                          <button
                            type="button"
                            onClick={() => {
                              if (profile.id !== undefined) {
                                setEditingProfileId(profile.id);
                                setFullName(profile.fullName);
                                setProfileTitle(profile.title);
                                setProfileMessage(profile.message);
                                setPreviewUrl(profile.profileImageUrl || null);
                                setProfileFile(null);
                                if (fileInputRef.current) fileInputRef.current.value = "";
                                document.getElementById("admin-profile-form")?.scrollIntoView({ behavior: "smooth" });
                              }
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-purple-200 transition-all hover:bg-purple-500/10 hover:border-purple-500/30"
                          >
                            <Pencil size={12} />
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={deletingProfileId === profile.id}
                            onClick={() => profile.id !== undefined && handleDeleteProfile(profile.id)}
                            className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-red-200 transition-all hover:bg-red-500/10 hover:border-red-500/30 disabled:opacity-50"
                          >
                            {deletingProfileId === profile.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Trash2 size={12} />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quick Actions & Info */}
            <div className="space-y-6">
              {/* Context-Aware Quick Links */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Activity size={20} className="text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Quick Navigation</h2>
                    <p className="text-sm text-white/40">Jump to any management section</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <Link
                    to="/admin/problem-images"
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-emerald-500/30 hover:bg-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <ImagePlus size={22} className="text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">Problem Images</h3>
                          <ArrowUpRight size={16} className="text-white/20 group-hover:text-emerald-400 transition-colors" />
                        </div>
                        <p className="mt-1 text-sm text-white/50">Manage environmental issue galleries</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400/70">
                          <span>{stats.problems} items</span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link
                    to="/admin/content"
                    className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:border-amber-500/30 hover:bg-white/10"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 group-hover:scale-110 transition-transform">
                        <FolderKanban size={22} className="text-amber-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-white group-hover:text-amber-300 transition-colors">Projects & Testimonials</h3>
                          <ArrowUpRight size={16} className="text-white/20 group-hover:text-amber-400 transition-colors" />
                        </div>
                        <p className="mt-1 text-sm text-white/50">Update restoration projects and stories</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-amber-400/70">
                          <span>{stats.projects} projects</span>
                          <span>•</span>
                          <span>{stats.testimonials} testimonials</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              {/* Info Card */}

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboardPage;