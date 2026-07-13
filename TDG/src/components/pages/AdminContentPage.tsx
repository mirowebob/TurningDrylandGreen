import { useEffect, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    FolderKanban,
    MessageSquareQuote,
    PlusCircle,
    Sparkles,
    Trash2,
    Loader2,
    CheckCircle2,
    XCircle,
    Pencil,
    LayoutDashboard,
    ImagePlus,
    UserCog,
    ArrowUpRight,
    ArrowLeft,
    Menu,
    X
} from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import {
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
} from "../../services/api";
import type { ProjectDTO, TestimonialDTO } from "../../services/api";

type Status = { type: "success" | "error"; message: string } | null;

const AdminContentPage = () => {
    const location = useLocation();

    // Project Form State
    const [projectTitle, setProjectTitle] = useState("");
    const [shortDesc, setShortDesc] = useState("");
    const [projectDesc, setProjectDesc] = useState("");
    const [projectStatus, setProjectStatus] = useState<"ONGOING" | "COMPLETED">("ONGOING");
    const [projectLocation, setProjectLocation] = useState("");
    const [projectCounty, setProjectCounty] = useState("");
    const [projectCommunity, setProjectCommunity] = useState("");
    const [projectImpact, setProjectImpact] = useState("");
    const [projectOutcome, setProjectOutcome] = useState("");
    const [projectTags, setProjectTags] = useState("");
    const [projectFiles, setProjectFiles] = useState<File[]>([]);
    const [projectPreviews, setProjectPreviews] = useState<string[]>([]);

    // Testimonial Form State
    const [testimonialName, setTestimonialName] = useState("");
    const [testimonialRole, setTestimonialRole] = useState("");
    const [testimonialQuote, setTestimonialQuote] = useState("");

    // Lists & Loading State
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [testimonials, setTestimonials] = useState<TestimonialDTO[]>([]);
    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingTestimonials, setLoadingTestimonials] = useState(true);
    const [submittingProject, setSubmittingProject] = useState(false);
    const [submittingTestimonial, setSubmittingTestimonial] = useState(false);
    const [deletingProjectId, setDeletingProjectId] = useState<number | null>(null);
    const [deletingTestimonialId, setDeletingTestimonialId] = useState<number | null>(null);

    // Global Status Feedback
    const [status, setStatus] = useState<Status>(null);

    // Edit states
    const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
    const [editingTestimonialId, setEditingTestimonialId] = useState<number | null>(null);

    // Mobile menu state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Navigation items
    const navItems = [
        {
            label: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard,
            description: "Overview & statistics"
        },
        {
            label: "Problem Images",
            path: "/admin/problem-images",
            icon: ImagePlus,
            description: "Environmental issues"
        },
        {
            label: "Content",
            path: "/admin/content",
            icon: FolderKanban,
            description: "Projects & testimonials"
        },
        {
            label: "Team Profiles",
            path: "/admin#admin-profile-form",
            icon: UserCog,
            description: "Manage team members"
        }
    ];

    const isCurrentPath = (path: string) => {
        if (path.includes('#')) {
            return location.pathname === '/admin' && location.hash === '#admin-profile-form';
        }
        return location.pathname === path;
    };

    // Fetch lists on load
    const loadProjectsList = async () => {
        setLoadingProjects(true);
        try {
            const data = await fetchProjects();
            setProjects(data);
        } catch {
            setStatus({ type: "error", message: "Failed to fetch projects from backend." });
        } finally {
            setLoadingProjects(false);
        }
    };

    const loadTestimonialsList = async () => {
        setLoadingTestimonials(true);
        try {
            const data = await fetchTestimonials();
            setTestimonials(data);
        } catch {
            setStatus({ type: "error", message: "Failed to fetch testimonials from backend." });
        } finally {
            setLoadingTestimonials(false);
        }
    };

    useEffect(() => {
        loadProjectsList();
        loadTestimonialsList();
    }, []);

    // Project image uploads → previews
    const handleProjectImages = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        setProjectFiles(selected);
        const urls = selected.map((f) => URL.createObjectURL(f));
        setProjectPreviews(urls);
    };

    // Project Submit
    const handleProjectSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setStatus(null);

        if (!projectTitle.trim() || !projectDesc.trim() || !projectLocation.trim() || !projectCounty.trim() || !projectCommunity.trim()) {
            setStatus({ type: "error", message: "All basic project fields are required." });
            return;
        }

        setSubmittingProject(true);
        try {
            const parsedTags = projectTags
                .split(",")
                .map((t) => t.trim())
                .filter((t) => t.length > 0);

            if (editingProjectId !== null) {
                await updateProject(editingProjectId, {
                    title: projectTitle.trim(),
                    shortDescription: shortDesc.trim(),
                    description: projectDesc.trim(),
                    status: projectStatus,
                    location: projectLocation.trim(),
                    county: projectCounty.trim(),
                    images: projectFiles.length > 0 ? projectFiles : undefined,
                    communityName: projectCommunity.trim(),
                    impact: projectStatus === "ONGOING" ? projectImpact.trim() : "",
                    outcome: projectStatus === "COMPLETED" ? projectOutcome.trim() : "",
                    tags: parsedTags,
                });
                setStatus({ type: "success", message: "Project updated successfully!" });
                setEditingProjectId(null);
            } else {
                await createProject({
                    title: projectTitle.trim(),
                    shortDescription: shortDesc.trim(),
                    description: projectDesc.trim(),
                    status: projectStatus,
                    location: projectLocation.trim(),
                    county: projectCounty.trim(),
                    images: projectFiles,
                    communityName: projectCommunity.trim(),
                    impact: projectStatus === "ONGOING" ? projectImpact.trim() : undefined,
                    outcome: projectStatus === "COMPLETED" ? projectOutcome.trim() : undefined,
                    tags: parsedTags,
                });
                setStatus({ type: "success", message: "Project saved successfully!" });
            }

            setProjectTitle("");
            setShortDesc("");
            setProjectDesc("");
            setProjectLocation("");
            setProjectCounty("");
            setProjectCommunity("");
            setProjectImpact("");
            setProjectOutcome("");
            setProjectTags("");
            setProjectFiles([]);
            setProjectPreviews([]);

            await loadProjectsList();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unexpected error saving project.";
            setStatus({ type: "error", message: msg });
        } finally {
            setSubmittingProject(false);
        }
    };

    // Testimonial Submit
    const handleTestimonialSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setStatus(null);

        if (!testimonialName.trim() || !testimonialQuote.trim()) {
            setStatus({ type: "error", message: "Name and message quote are required." });
            return;
        }

        setSubmittingTestimonial(true);
        try {
            if (editingTestimonialId !== null) {
                await updateTestimonial(editingTestimonialId, {
                    name: testimonialName.trim(),
                    message: testimonialQuote.trim(),
                    role: testimonialRole.trim() || "Community member",
                });
                setStatus({ type: "success", message: "Testimonial updated successfully!" });
                setEditingTestimonialId(null);
            } else {
                await createTestimonial({
                    name: testimonialName.trim(),
                    message: testimonialQuote.trim(),
                    role: testimonialRole.trim() || "Community member",
                });
                setStatus({ type: "success", message: "Testimonial saved successfully!" });
            }

            setTestimonialName("");
            setTestimonialRole("");
            setTestimonialQuote("");

            await loadTestimonialsList();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unexpected error saving testimonial.";
            setStatus({ type: "error", message: msg });
        } finally {
            setSubmittingTestimonial(false);
        }
    };

    // Deletes
    const handleDeleteProject = async (id: number) => {
        setDeletingProjectId(id);
        setStatus(null);
        try {
            await deleteProject(id);
            setProjects((prev) => prev.filter((p) => p.id !== id));
            setStatus({ type: "success", message: "Project deleted successfully." });
        } catch {
            setStatus({ type: "error", message: `Failed to delete project #${id}.` });
        } finally {
            setDeletingProjectId(null);
        }
    };

    const handleDeleteTestimonial = async (id: number) => {
        setDeletingTestimonialId(id);
        setStatus(null);
        try {
            await deleteTestimonial(id);
            setTestimonials((prev) => prev.filter((t) => t.id !== id));
            setStatus({ type: "success", message: "Testimonial deleted successfully." });
        } catch {
            setStatus({ type: "error", message: `Failed to delete testimonial #${id}.` });
        } finally {
            setDeletingTestimonialId(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#07110b] text-white">
            <Navbar />

            <main className="px-6 pb-20 pt-32 md:px-8 lg:px-12">
                <div className="mx-auto max-w-6xl space-y-6">

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
                                                        ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-white shadow-lg shadow-amber-500/10 border border-amber-500/30'
                                                        : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/10'
                                                    }
                                                `}
                                            >
                                                <Icon size={16} className={isActive ? 'text-amber-400' : 'text-white/40 group-hover:text-white/70'} />
                                                <span>{item.label}</span>
                                                {isActive && (
                                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
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
                                    <div className="text-xs text-white/40">Content Management</div>
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
                                                            ? 'bg-amber-500/20 text-white border border-amber-500/30'
                                                            : 'text-white/60 hover:text-white hover:bg-white/10 border border-transparent'
                                                        }
                                                    `}
                                                >
                                                    <Icon size={18} className={isActive ? 'text-amber-400' : 'text-white/40'} />
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
                        <span className="text-white/60">Content Management</span>
                    </div>

                    {/* Quick Links */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <Link
                            to="/admin"
                            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-white/20"
                        >
                            <LayoutDashboard size={18} className="text-white/40 group-hover:text-white/70" />
                            <div>
                                <div className="text-sm font-medium text-white/70 group-hover:text-white">Dashboard</div>
                                <div className="text-xs text-white/40">Overview</div>
                            </div>
                            <ArrowUpRight size={14} className="ml-auto text-white/20 group-hover:text-white/40" />
                        </Link>
                        <Link
                            to="/admin/problem-images"
                            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-emerald-500/30"
                        >
                            <ImagePlus size={18} className="text-emerald-400/60 group-hover:text-emerald-400" />
                            <div>
                                <div className="text-sm font-medium text-white/70 group-hover:text-white">Problem Images</div>
                                <div className="text-xs text-white/40">Environmental issues</div>
                            </div>
                            <ArrowUpRight size={14} className="ml-auto text-white/20 group-hover:text-emerald-400/70" />
                        </Link>
                        <Link
                            to="/admin#admin-profile-form"
                            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-purple-500/30"
                        >
                            <UserCog size={18} className="text-purple-400/60 group-hover:text-purple-400" />
                            <div>
                                <div className="text-sm font-medium text-white/70 group-hover:text-white">Team Profiles</div>
                                <div className="text-xs text-white/40">Manage team</div>
                            </div>
                            <ArrowUpRight size={14} className="ml-auto text-white/20 group-hover:text-purple-400/70" />
                        </Link>
                    </div>

                    {/* Header card */}
                    <div className="rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(27,53,19,0.95),rgba(54,96,33,0.9))] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-10">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-100">
                            <FolderKanban size={14} />
                            Projects & testimonials
                        </div>
                        <h1 className="mt-6 font-display text-3xl sm:text-4xl">Publish projects and community voices</h1>
                        <p className="mt-3 max-w-3xl text-lg text-white/80">
                            Add new work, highlight what is changing on the ground, and collect short testimonials from participants.
                        </p>
                    </div>

                    {status && (
                        <div
                            className={`flex items-center justify-between gap-4 rounded-xl border px-5 py-3 text-sm font-medium ${status.type === "success"
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

                    <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
                        {/* PROJECTS COLUMN */}
                        <div id="project-form-section" className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur-sm space-y-6 scroll-mt-28">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-emerald-200">
                                    <Sparkles size={18} />
                                    <h2 className="text-xl font-semibold text-white">
                                        {editingProjectId !== null ? "Edit Project" : "Projects"}
                                    </h2>
                                </div>
                                <Link
                                    to="/admin/problem-images"
                                    className="hidden sm:flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
                                >
                                    <ArrowLeft size={14} />
                                    <span>Problem Images</span>
                                </Link>
                            </div>
                            <form onSubmit={handleProjectSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="block text-sm text-white/80">
                                        <span className="mb-2 block">Project title *</span>
                                        <input
                                            value={projectTitle}
                                            onChange={(e) => setProjectTitle(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all"
                                            placeholder="Water harvesting pilot"
                                        />
                                    </label>
                                    <label className="block text-sm text-white/80">
                                        <span className="mb-2 block">Status *</span>
                                        <select
                                            value={projectStatus}
                                            onChange={(e) => setProjectStatus(e.target.value as "ONGOING" | "COMPLETED")}
                                            className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all"
                                        >
                                            <option value="ONGOING">Ongoing</option>
                                            <option value="COMPLETED">Completed</option>
                                        </select>
                                    </label>
                                </div>


                                <label className="block text-sm text-white/80">
                                    <span className="mb-2 block">Short Description *</span>
                                    <textarea
                                        value={shortDesc}
                                        onChange={(e) => setShortDesc(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all resize-none"
                                        placeholder="Share detailed description of the project."
                                    />
                                </label>
                                <label className="block text-sm text-white/80">
                                    <span className="mb-2 block">Description *</span>
                                    <textarea
                                        value={projectDesc}
                                        onChange={(e) => setProjectDesc(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all resize-none"
                                        placeholder="Share detailed description of the project."
                                    />
                                </label>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <label className="block text-sm text-white/80">
                                        <span className="mb-2 block">Location *</span>
                                        <input
                                            value={projectLocation}
                                            onChange={(e) => setProjectLocation(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all"
                                            placeholder="Suswa"
                                        />
                                    </label>
                                    <label className="block text-sm text-white/80">
                                        <span className="mb-2 block">County *</span>
                                        <input
                                            value={projectCounty}
                                            onChange={(e) => setProjectCounty(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all"
                                            placeholder="Narok County"
                                        />
                                    </label>
                                    <label className="block text-sm text-white/80">
                                        <span className="mb-2 block">Community Name *</span>
                                        <input
                                            value={projectCommunity}
                                            onChange={(e) => setProjectCommunity(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all"
                                            placeholder="Suswa Community"
                                        />
                                    </label>
                                </div>

                                {projectStatus === "ONGOING" ? (
                                    <label className="block text-sm text-white/80">
                                        <span className="mb-2 block">Expected Impact</span>
                                        <textarea
                                            value={projectImpact}
                                            onChange={(e) => setProjectImpact(e.target.value)}
                                            rows={2}
                                            className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all resize-none"
                                            placeholder="e.g. Expected to secure water for over 2,000 households."
                                        />
                                    </label>
                                ) : (
                                    <label className="block text-sm text-white/80">
                                        <span className="mb-2 block">Outcome</span>
                                        <textarea
                                            value={projectOutcome}
                                            onChange={(e) => setProjectOutcome(e.target.value)}
                                            rows={2}
                                            className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all resize-none"
                                            placeholder="e.g. 5,000 trees successfully planted and fully integrated."
                                        />
                                    </label>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <label className="block text-sm text-white/80">
                                        <span className="mb-2 block">Tags (comma separated)</span>
                                        <input
                                            value={projectTags}
                                            onChange={(e) => setProjectTags(e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all"
                                            placeholder="e.g. Water, Reforestation"
                                        />
                                    </label>
                                    <label className="block text-sm text-white/80">
                                        <span className="mb-2 block">Project Images</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleProjectImages}
                                            className="w-full rounded-xl border border-dashed border-white/15 bg-[#0e1b14] px-4 py-3 text-white file:mr-3 file:rounded-lg file:border-0 file:bg-amber-500/20 file:px-3 file:py-1 file:text-xs file:font-medium file:text-amber-200 hover:file:bg-amber-500/30 transition-all cursor-pointer"
                                        />
                                    </label>
                                </div>

                                {projectPreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {projectPreviews.map((url, i) => (
                                            <div key={i} className="overflow-hidden rounded-xl border border-white/10">
                                                <img src={url} alt={`Preview ${i + 1}`} className="h-20 w-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="submit"
                                        disabled={submittingProject}
                                        className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 font-semibold text-[#07110b] transition hover:bg-amber-300 disabled:opacity-50"
                                    >
                                        {submittingProject ? (
                                            <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                        ) : editingProjectId !== null ? (
                                            <><Pencil size={18} /> Update project</>
                                        ) : (
                                            <><PlusCircle size={18} /> Save project</>
                                        )}
                                    </button>
                                    {editingProjectId !== null && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setProjectTitle("");
                                                setShortDesc("");
                                                setProjectDesc("");
                                                setProjectLocation("");
                                                setProjectCounty("");
                                                setProjectCommunity("");
                                                setProjectImpact("");
                                                setProjectOutcome("");
                                                setProjectTags("");
                                                setProjectFiles([]);
                                                setProjectPreviews([]);
                                                setEditingProjectId(null);
                                            }}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <Link
                                        to="/admin/problem-images"
                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                                    >
                                        <ArrowLeft size={16} />
                                        Go to Images
                                    </Link>
                                </div>
                            </form>

                            <div className="mt-6 space-y-3">
                                <h3 className="font-semibold text-white/70">Saved projects ({projects.length})</h3>
                                {loadingProjects ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 size={24} className="animate-spin text-amber-300" />
                                    </div>
                                ) : projects.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-sm text-white/70">
                                        No projects added yet.
                                    </div>
                                ) : (
                                    projects.map((project) => (
                                        <div key={project.id} className="rounded-xl border border-white/10 bg-black/20 p-4 hover:border-amber-500/30 transition-all">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-white truncate">{project.title}</h3>
                                                    <p className="mt-1 text-sm text-white/70 line-clamp-2">{project.description}</p>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <span className="text-xs uppercase tracking-[0.2em] text-amber-200">{project.location}, {project.county}</span>
                                                        <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-300">{project.status}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingProjectId(project.id);
                                                            setProjectTitle(project.title);
                                                            setShortDesc(project.shortDescription)
                                                            setProjectDesc(project.description);
                                                            setProjectStatus(project.status);
                                                            setProjectLocation(project.location);
                                                            setProjectCounty(project.county);
                                                            setProjectCommunity(project.communityName);
                                                            setProjectImpact(project.impact || "");
                                                            setProjectOutcome(project.outcome || "");
                                                            setProjectTags(project.tags.join(", "));
                                                            setProjectFiles([]);
                                                            setProjectPreviews(project.images);
                                                            document.getElementById("project-form-section")?.scrollIntoView({ behavior: "smooth" });
                                                        }}
                                                        className="rounded-full border border-white/10 p-2 text-amber-200 transition hover:bg-amber-500/10"
                                                        aria-label="Edit project"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={deletingProjectId === project.id}
                                                        onClick={() => handleDeleteProject(project.id)}
                                                        className="rounded-full border border-white/10 p-2 text-rose-200 transition hover:bg-rose-500/10 disabled:opacity-40"
                                                        aria-label="Delete project"
                                                    >
                                                        {deletingProjectId === project.id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* TESTIMONIALS COLUMN */}
                        <div id="testimonial-form-section" className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur-sm space-y-6 scroll-mt-28">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-amber-200">
                                    <MessageSquareQuote size={18} />
                                    <h2 className="text-xl font-semibold text-white">
                                        {editingTestimonialId !== null ? "Edit Testimonial" : "Testimonials"}
                                    </h2>
                                </div>
                                <Link
                                    to="/admin#admin-profile-form"
                                    className="hidden sm:flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
                                >
                                    <span>Team Profiles</span>
                                    <ArrowUpRight size={14} />
                                </Link>
                            </div>
                            <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                                <label className="block text-sm text-white/80">
                                    <span className="mb-2 block">Name *</span>
                                    <input
                                        value={testimonialName}
                                        onChange={(e) => setTestimonialName(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all"
                                        placeholder="Asha Wanjiru"
                                    />
                                </label>
                                <label className="block text-sm text-white/80">
                                    <span className="mb-2 block">Role</span>
                                    <input
                                        value={testimonialRole}
                                        onChange={(e) => setTestimonialRole(e.target.value)}
                                        className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all"
                                        placeholder="Lead farmer"
                                    />
                                </label>
                                <label className="block text-sm text-white/80">
                                    <span className="mb-2 block">Quote *</span>
                                    <textarea
                                        value={testimonialQuote}
                                        onChange={(e) => setTestimonialQuote(e.target.value)}
                                        rows={4}
                                        className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white outline-none ring-0 focus:border-amber-400/50 transition-all resize-none"
                                        placeholder="The new water system changed our harvests and our confidence."
                                    />
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        type="submit"
                                        disabled={submittingTestimonial}
                                        className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-5 py-2.5 font-semibold text-[#07110b] transition hover:bg-amber-300 disabled:opacity-50"
                                    >
                                        {submittingTestimonial ? (
                                            <><Loader2 size={18} className="animate-spin" /> Saving...</>
                                        ) : editingTestimonialId !== null ? (
                                            <><Pencil size={18} /> Update testimonial</>
                                        ) : (
                                            <><PlusCircle size={18} /> Save testimonial</>
                                        )}
                                    </button>
                                    {editingTestimonialId !== null && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTestimonialName("");
                                                setTestimonialRole("");
                                                setTestimonialQuote("");
                                                setEditingTestimonialId(null);
                                            }}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
                                        >
                                            Cancel
                                        </button>
                                    )}
                                    <Link
                                        to="/admin"
                                        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                                    >
                                        <ArrowLeft size={16} />
                                        Dashboard
                                    </Link>
                                </div>
                            </form>

                            <div className="mt-6 space-y-3">
                                <h3 className="font-semibold text-white/70">Saved testimonials ({testimonials.length})</h3>
                                {loadingTestimonials ? (
                                    <div className="flex items-center justify-center py-6">
                                        <Loader2 size={24} className="animate-spin text-amber-300" />
                                    </div>
                                ) : testimonials.length === 0 ? (
                                    <div className="rounded-xl border border-dashed border-white/15 bg-black/20 p-4 text-sm text-white/70">
                                        No testimonials added yet.
                                    </div>
                                ) : (
                                    testimonials.map((testimonial) => (
                                        <div key={testimonial.id} className="rounded-xl border border-white/10 bg-black/20 p-4 hover:border-amber-500/30 transition-all">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-white truncate">{testimonial.name}</h3>
                                                    <p className="text-sm text-amber-200">{testimonial.role}</p>
                                                    <p className="mt-2 text-sm leading-6 text-white/75">"{testimonial.message}"</p>
                                                </div>
                                                <div className="flex gap-1 shrink-0">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setEditingTestimonialId(testimonial.id);
                                                            setTestimonialName(testimonial.name);
                                                            setTestimonialRole(testimonial.role);
                                                            setTestimonialQuote(testimonial.message);
                                                            document.getElementById("testimonial-form-section")?.scrollIntoView({ behavior: "smooth" });
                                                        }}
                                                        className="rounded-full border border-white/10 p-2 text-amber-200 transition hover:bg-amber-500/10"
                                                        aria-label="Edit testimonial"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        disabled={deletingTestimonialId === testimonial.id}
                                                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                                                        className="rounded-full border border-white/10 p-2 text-rose-200 transition hover:bg-rose-500/10 disabled:opacity-40"
                                                        aria-label="Delete testimonial"
                                                    >
                                                        {deletingTestimonialId === testimonial.id ? (
                                                            <Loader2 size={16} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminContentPage;