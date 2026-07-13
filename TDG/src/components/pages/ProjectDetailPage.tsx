import { useEffect, useRef, useState, type ReactNode } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Heart,
    MapPin,
    Sparkles,
    Sprout,
    Users,
    Loader2,
    Mail,
    Phone,
    CheckCircle2,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import DonationModal from "../ui/DonationModal";
import { fetchProjectById, type ProjectDTO } from "../../services/api";
import marigat from "../../assets/marigat-Loruk.jpeg";

/* ---------- Scroll Reveal ---------- */
const Reveal = ({ children, className = "" }: { children: ReactNode; className?: string }) => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                } ${className}`}
        >
            {children}
        </div>
    );
};

const ProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [project, setProject] = useState<ProjectDTO | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isDonationOpen, setIsDonationOpen] = useState(false);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        const loadProject = async () => {
            try {
                const data = await fetchProjectById(id);
                if (!cancelled) setProject(data);
            } catch (err) {
                console.error("Failed to load project:", err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        loadProject();
        return () => { cancelled = true; };
    }, [id]);

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-[#060b07] flex items-center justify-center">
                    <Loader2 size={40} className="animate-spin text-emerald-400" />
                </div>
                <Footer />
            </>
        );
    }

    if (!project) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-[#060b07] flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🌱</div>
                        <p className="text-xl text-white/70">Project not found</p>
                        <Link to="/projects" className="mt-4 inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300">
                            <ArrowLeft size={16} /> Back to Projects
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    const mainImage = project.images?.[0] || marigat;
    const isOngoing = project.status === "ONGOING";

    return (
        <>
            <div className="min-h-screen bg-[#060b07] text-white">
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    .float-anim { animation: float 6s ease-in-out infinite; }
                    @media (prefers-reduced-motion: reduce) {
                        .float-anim { animation: none !important; }
                    }
                `}</style>

                <Navbar />

                {/* ===== BACK NAV ===== */}
                <div className="px-6 pt-32 pb-6 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <Link
                            to="/projects"
                            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            Back to Projects
                        </Link>
                    </div>
                </div>

                {/* ===== HERO SECTION ===== */}
                <section className="relative px-6 pb-16 md:px-8 lg:px-12 overflow-hidden">
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px]" />
                        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-emerald-400/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative mx-auto max-w-7xl">
                        <div className="grid lg:grid-cols-2 gap-12 items-start">
                            {/* Left Column - Image */}
                            <Reveal>
                                <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                                    <img
                                        src={mainImage}
                                        alt={project.title}
                                        className="w-full h-[400px] lg:h-[550px] object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
                                        <div className="flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-4 py-2 text-sm border border-white/10">
                                            <MapPin size={14} className="text-emerald-400" />
                                            {project.location}
                                            {project.county && `, ${project.county}`}
                                        </div>
                                        {project.status && (
                                            <div className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm backdrop-blur-md border ${isOngoing
                                                ? "bg-amber-500/20 text-amber-300 border-amber-400/20"
                                                : "bg-emerald-500/20 text-emerald-300 border-emerald-400/20"
                                                }`}>
                                                {isOngoing && (
                                                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                                                )}
                                                {isOngoing ? "In Progress" : "Completed"}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Reveal>

                            {/* Right Column - Info */}
                            <Reveal>
                                <div className="space-y-8">
                                    <div>
                                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                                            {project.title}
                                        </h1>
                                        <div className="flex items-center gap-4 text-sm text-white/40">
                                            {/*<span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {project.startDate ? new Date(project.startDate).getFullYear() : "2024"}
                                            </span>
                                            <span>•</span>*/}
                                            <span className="flex items-center gap-1">
                                                <Users size={14} />
                                                {project.communityName || "Community Project"}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="text-xl text-white/70 leading-relaxed">
                                        {project.description}
                                    </p>

                                    {/* Key Stats */}
                                    <div className="grid grid-cols-3 gap-4 py-4 border-y border-white/5">
                                        {[
                                            { label: "Impact", value: project.impact || "500+ lives" },
                                            { label: "Status", value: isOngoing ? "Active" : "Completed" },
                                            { label: "Location", value: project.county || "Kenya" },
                                        ].map((stat) => (
                                            <div key={stat.label} className="text-center">
                                                <div className="text-2xl font-bold text-emerald-400">{stat.value}</div>
                                                <div className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={() => setIsDonationOpen(true)}
                                            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-0.5"
                                        >
                                            <Heart size={20} />
                                            Support This Project
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: project.title,
                                                        text: project.description,
                                                        url: window.location.href,
                                                    });
                                                }
                                            }}
                                            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-4 font-semibold text-white/60 transition-all hover:border-white/20 hover:text-white hover:bg-white/5"
                                        >

                                        </button>
                                    </div>
                                </div>
                            </Reveal>
                        </div>
                    </div>
                </section>

                {/* ===== PROJECT DETAILS ===== */}
                <section className="px-6 py-20 md:px-8 lg:px-12 border-t border-white/5">
                    <div className="mx-auto max-w-7xl">
                        <Reveal>
                            <div className="grid lg:grid-cols-3 gap-12">
                                {/* Main Content */}
                                <div className="lg:col-span-2 space-y-12">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                            <Sparkles size={24} className="text-emerald-400" />
                                            Innovation Details
                                        </h2>
                                        <div className="prose prose-invert prose-lg max-w-none text-white/70 space-y-4">
                                            <p>{project.description}</p>
                                            {project.outcome && (
                                                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 mt-6">
                                                    <h4 className="text-emerald-300 font-semibold mb-2 flex items-center gap-2">
                                                        <CheckCircle2 size={20} />
                                                        {isOngoing ? "Expected Outcome" : "Outcome Achieved"}
                                                    </h4>
                                                    <p className="text-white/80">{project.outcome}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Tags */}
                                    {project.tags && project.tags.length > 0 && (
                                        <div>
                                            <h3 className="text-sm font-semibold uppercase tracking-wider text-white/40 mb-3">
                                                Key Focus Areas
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {project.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:border-emerald-400/30 hover:text-white transition-all"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar - Sponsor CTA */}
                                <div className="lg:col-span-1">
                                    <div className="sticky top-28 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 p-8 text-center">
                                        <h3 className="text-xl font-bold mb-3">Interested in Supporting This Project?</h3>
                                        <p className="text-sm text-white/60 mb-6">
                                            Thank you for showing interest. Please provide your contact information, and we will reach out to schedule a discussion about how we can collaborate.
                                        </p>
                                        <button
                                            onClick={() => setIsDonationOpen(true)}
                                            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20 w-full justify-center"
                                        >
                                            <Mail size={18} />
                                            Get Involved
                                        </button>
                                        <div className="mt-4 text-xs text-white/30">
                                            <span className="flex items-center justify-center gap-1">
                                                <Phone size={12} />
                                                +254 716 778863
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ===== RELATED PROJECTS / CTA ===== */}
                <section className="px-6 pb-20 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <Reveal>
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border border-emerald-500/20 p-12 md:p-16 text-center">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative">
                                    <Sprout size={48} className="text-emerald-400 mx-auto mb-6" />
                                    <h3 className="text-3xl md:text-4xl font-bold mb-4">Explore More Projects</h3>
                                    <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
                                        Discover other initiatives making a difference in communities across Kenya
                                    </p>
                                    <Link
                                        to="/projects"
                                        className="inline-flex items-center gap-3 rounded-full bg-emerald-500 px-10 py-4 font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-0.5"
                                    >
                                        View All Projects <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>
            </div>

            <DonationModal isOpen={isDonationOpen} onClose={() => setIsDonationOpen(false)} />
            <Footer />
        </>
    );
};

export default ProjectDetailPage;