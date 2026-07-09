import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import {
    CheckCircle2,
    ImagePlus,
    Loader2,
    PlusCircle,
    Trash2,
    XCircle,
    Pencil,
    LayoutDashboard,
    FolderKanban,
    UserCog,
    ArrowUpRight,
    ArrowLeft,
    Menu,
    X
} from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { createProblem, updateProblem, deleteProblem, fetchProblems } from "../../services/api";
import type { ProblemImageDTO } from "../../services/api";

// ── Feedback banner ──────────────────────────────────────────────────────────

type Status = { type: "success" | "error"; message: string } | null;

const StatusBanner = ({ status, onDismiss }: { status: Status; onDismiss: () => void }) => {
    if (!status) return null;
    const isSuccess = status.type === "success";
    return (
        <div
            className={`flex items-center justify-between gap-4 rounded-xl border px-5 py-3 text-sm font-medium ${isSuccess
                ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
                : "border-rose-400/30 bg-rose-500/10 text-rose-200"
                }`}
        >
            <span className="flex items-center gap-2">
                {isSuccess ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {status.message}
            </span>
            <button onClick={onDismiss} className="opacity-60 hover:opacity-100 transition-opacity">
                ✕
            </button>
        </div>
    );
};

// ── Main page ────────────────────────────────────────────────────────────────

const AdminProblemImagesPage = () => {
    const location = useLocation();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [tag, setTag] = useState("");
    const [files, setFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);

    const [entries, setEntries] = useState<ProblemImageDTO[]>([]);
    const [loadingEntries, setLoadingEntries] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [status, setStatus] = useState<Status>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

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

    // ── Load existing problems on mount ────────────────────────────────────
    const loadProblems = async () => {
        setLoadingEntries(true);
        try {
            const data = await fetchProblems();
            setEntries(data);
        } catch {
            setStatus({ type: "error", message: "Could not load existing problems. Is the backend running?" });
        } finally {
            setLoadingEntries(false);
        }
    };

    useEffect(() => { loadProblems(); }, []);

    // ── File selection → local previews ────────────────────────────────────
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selected = Array.from(e.target.files ?? []);
        setFiles(selected);
        const urls = selected.map((f) => URL.createObjectURL(f));
        setPreviews(urls);
    };

    // ── Submit ─────────────────────────────────────────────────────────────
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || (editingId === null && files.length === 0)) {
            setStatus({ type: "error", message: "Title, description and at least one image are required." });
            return;
        }

        setSubmitting(true);
        setStatus(null);
        try {
            if (editingId !== null) {
                await updateProblem(editingId, {
                    problemTitle: title.trim(),
                    problemDescription: description.trim(),
                    tag: tag.trim(),
                    files: files.length > 0 ? files : undefined,
                });
                setStatus({ type: "success", message: "Problem updated successfully!" });
                setEditingId(null);
            } else {
                await createProblem({ problemTitle: title.trim(), problemDescription: description.trim(), tag: tag.trim(), files });
                setStatus({ type: "success", message: "Problem saved successfully!" });
            }
            setTitle("");
            setDescription("");
            setTag("");
            setFiles([]);
            setPreviews([]);
            if (fileInputRef.current) fileInputRef.current.value = "";
            await loadProblems();
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : "Unexpected error occurred.";
            setStatus({ type: "error", message: msg });
        } finally {
            setSubmitting(false);
        }
    };

    // ── Delete ─────────────────────────────────────────────────────────────
    const handleDelete = async (id: number) => {
        setDeletingId(id);
        try {
            await deleteProblem(id);
            setEntries((prev) => prev.filter((e) => e.id !== id));
            setStatus({ type: "success", message: "Problem deleted successfully." });
        } catch {
            setStatus({ type: "error", message: `Failed to delete problem #${id}.` });
        } finally {
            setDeletingId(null);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────
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
                                    <div className="text-xs text-white/40">Problem Images</div>
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
                        <span className="text-white/60">Problem Images</span>
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
                            to="/admin/content"
                            className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-amber-500/30"
                        >
                            <FolderKanban size={18} className="text-amber-400/60 group-hover:text-amber-400" />
                            <div>
                                <div className="text-sm font-medium text-white/70 group-hover:text-white">Content</div>
                                <div className="text-xs text-white/40">Projects & testimonials</div>
                            </div>
                            <ArrowUpRight size={14} className="ml-auto text-white/20 group-hover:text-amber-400/70" />
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
                            <ImagePlus size={14} />
                            Problem images
                        </div>
                        <h1 className="mt-6 font-display text-3xl sm:text-4xl">Upload problem images and stories</h1>
                        <p className="mt-3 max-w-3xl text-lg text-white/80">
                            Capture the issues facing dryland communities with a vivid image and a short explanatory description.
                            Entries are saved to the database and appear live on the public site.
                        </p>
                    </div>

                    {/* Status banner */}
                    <StatusBanner status={status} onDismiss={() => setStatus(null)} />

                    {/* Form + entries grid */}
                    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">

                        {/* ── Left: Upload form ── */}
                        <form
                            id="problem-form"
                            onSubmit={handleSubmit}
                            className="rounded-[1.5rem] border border-white/10 bg-white/10 p-6 backdrop-blur-sm self-start scroll-mt-28"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-white">
                                    {editingId !== null ? "Edit entry" : "New entry"}
                                </h2>
                                <Link
                                    to="/admin/content"
                                    className="hidden sm:flex items-center gap-2 text-xs text-white/40 hover:text-white/70 transition-colors"
                                >
                                    <ArrowLeft size={14} />
                                    <span>Content</span>
                                </Link>
                            </div>

                            <div className="space-y-4">
                                {/* Title */}
                                <label className="block text-sm text-white/80">
                                    <span className="mb-2 block">Title <span className="text-rose-400">*</span></span>
                                    <input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={submitting}
                                        className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 disabled:opacity-50"
                                        placeholder="Soil erosion in Suswa"
                                    />
                                </label>

                                {/* Tag */}
                                <label className="block text-sm text-white/80">
                                    <span className="mb-2 block">Tag <span className="text-white/40 text-xs font-normal">(short label, e.g. "Erosion")</span></span>
                                    <input
                                        value={tag}
                                        onChange={(e) => setTag(e.target.value)}
                                        disabled={submitting}
                                        className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 disabled:opacity-50"
                                        placeholder="Gully Erosion"
                                    />
                                </label>

                                {/* Description */}
                                <label className="block text-sm text-white/80">
                                    <span className="mb-2 block">Description <span className="text-rose-400">*</span></span>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        disabled={submitting}
                                        rows={5}
                                        className="w-full rounded-xl border border-white/10 bg-[#0e1b14] px-4 py-3 text-white placeholder-white/30 outline-none transition focus:border-emerald-400/50 focus:ring-1 focus:ring-emerald-400/30 disabled:opacity-50 resize-none"
                                        placeholder="Describe the challenge, local impact, and why it matters."
                                    />
                                </label>

                                {/* Images */}
                                <label className="block text-sm text-white/80">
                                    <span className="mb-2 block">Images <span className="text-rose-400">*</span></span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileChange}
                                        disabled={submitting}
                                        className="w-full rounded-xl border border-dashed border-white/15 bg-[#0e1b14] px-4 py-3 text-white file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-500/20 file:px-3 file:py-1 file:text-xs file:font-medium file:text-emerald-200 hover:file:bg-emerald-500/30 disabled:opacity-50 transition-all cursor-pointer"
                                    />
                                </label>

                                {/* Image previews */}
                                {previews.length > 0 && (
                                    <div className="grid grid-cols-2 gap-2">
                                        {previews.map((url, i) => (
                                            <div key={i} className="overflow-hidden rounded-xl border border-white/10">
                                                <img src={url} alt={`Preview ${i + 1}`} className="h-32 w-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2.5 font-semibold text-[#07110b] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {submitting ? (
                                        <><Loader2 size={18} className="animate-spin" /> Uploading…</>
                                    ) : editingId !== null ? (
                                        <><Pencil size={18} /> Update problem image</>
                                    ) : (
                                        <><PlusCircle size={18} /> Save problem image</>
                                    )}
                                </button>
                                {editingId !== null && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setTitle("");
                                            setDescription("");
                                            setTag("");
                                            setFiles([]);
                                            setPreviews([]);
                                            setEditingId(null);
                                            if (fileInputRef.current) fileInputRef.current.value = "";
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

                        {/* ── Right: Saved entries ── */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-white/70">
                                    Saved entries
                                    {!loadingEntries && (
                                        <span className="ml-2 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/50">
                                            {entries.length}
                                        </span>
                                    )}
                                </h2>
                                <Link
                                    to="/admin#admin-profile-form"
                                    className="text-xs text-white/40 hover:text-white/70 transition-colors flex items-center gap-1"
                                >
                                    <span>Team Profiles</span>
                                    <ArrowUpRight size={12} />
                                </Link>
                            </div>

                            {loadingEntries ? (
                                <div className="flex items-center justify-center rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-12">
                                    <Loader2 size={24} className="animate-spin text-emerald-300" />
                                </div>
                            ) : entries.length === 0 ? (
                                <div className="rounded-[1.5rem] border border-dashed border-white/15 bg-black/20 p-8 text-center text-white/50">
                                    No problem images saved yet. Use the form to add the first one.
                                </div>
                            ) : (
                                entries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="rounded-[1.5rem] border border-white/10 bg-white/10 p-4 transition hover:bg-white/[0.13] hover:border-emerald-500/30"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="text-lg font-semibold text-white truncate">{entry.title}</h3>
                                                    {entry.tag && (
                                                        <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-200">
                                                            {entry.tag}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm leading-6 text-white/70 line-clamp-3">{entry.description}</p>
                                            </div>
                                            <div className="flex gap-1 shrink-0">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingId(entry.id);
                                                        setTitle(entry.title);
                                                        setDescription(entry.description);
                                                        setTag(entry.tag || "");
                                                        setFiles([]);
                                                        setPreviews(entry.imageUrls || []);
                                                        document.getElementById("problem-form")?.scrollIntoView({ behavior: "smooth" });
                                                    }}
                                                    className="rounded-full border border-white/10 p-2 text-emerald-200 transition hover:bg-emerald-500/10"
                                                    aria-label="Edit entry"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(entry.id)}
                                                    disabled={deletingId === entry.id}
                                                    className="rounded-full border border-white/10 p-2 text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-40"
                                                    aria-label="Delete entry"
                                                >
                                                    {deletingId === entry.id
                                                        ? <Loader2 size={16} className="animate-spin" />
                                                        : <Trash2 size={16} />
                                                    }
                                                </button>
                                            </div>
                                        </div>

                                        {/* Image thumbnails */}
                                        {entry.imageUrls?.length > 0 && (
                                            <div className="mt-3 grid grid-cols-3 gap-2">
                                                {entry.imageUrls.map((url, i) => (
                                                    <img
                                                        key={i}
                                                        src={url}
                                                        alt={entry.title}
                                                        className="h-24 w-full rounded-xl object-cover border border-white/10"
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default AdminProblemImagesPage;