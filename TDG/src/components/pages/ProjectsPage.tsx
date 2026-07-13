import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    CheckCircle2,
    Heart,
    MapPin,
    Quote,
    Sparkles,
    Users,
    X,
    Loader2,
    Target,
    TrendingUp,
    Filter,
    Star,
} from "lucide-react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import { PROJECTS_CONTENT } from "../../data/content";
import DonationModal from "../ui/DonationModal";
import narokTown from "../../assets/narok_town.jpg";
import marigat from "../../assets/marigat-Loruk.jpeg";
import kisiriri from "../../assets/kisiriri.jpg";
import suswaErosion from "../../assets/suswa erosion.jpg";
import { fetchProjects, fetchTestimonials, type ProjectDTO, type TestimonialDTO } from "../../services/api";

const FALLBACK_IMAGES = [marigat, kisiriri, suswaErosion, narokTown];
const getImage = (i: number) => FALLBACK_IMAGES[i % FALLBACK_IMAGES.length];

type DisplayProject = ProjectDTO & { type: "ongoing" | "completed" };

const toDisplayProject = (p: ProjectDTO): DisplayProject => ({
    ...p,
    type: p.status === "ONGOING" ? "ongoing" : "completed",
});

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

/* ---------- Animated Counter ---------- */
const AnimatedNumber = ({ value }: { value: number }) => {
    const ref = useRef<HTMLSpanElement | null>(null);
    const [display, setDisplay] = useState(0);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const duration = 1500;
                const start = performance.now();
                const tick = (now: number) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setDisplay(Math.round(eased * value));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            },
            { threshold: 0.5 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [value]);

    return <span ref={ref}>{display.toLocaleString()}</span>;
};

const ProjectsPage = () => {
    const [statusFilter, setStatusFilter] = useState("all");
    const [locationFilter, setLocationFilter] = useState<string | null>(null);
    const [isDonationOpen, setIsDonationOpen] = useState(false);
    const [projects, setProjects] = useState<ProjectDTO[]>([]);
    const [testimonials, setTestimonials] = useState<TestimonialDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        const loadData = async () => {
            try {
                const [projectData, testimonialData] = await Promise.all([
                    fetchProjects(),
                    fetchTestimonials(),
                ]);
                if (!cancelled) {
                    setProjects(projectData);
                    setTestimonials(testimonialData);
                }
            } catch (err) {
                console.error("Failed to load data:", err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };
        loadData();
        return () => { cancelled = true; };
    }, []);

    const allProjects = useMemo(() => projects.map(toDisplayProject), [projects]);

    const locations = useMemo(() => {
        const counts = new Map<string, number>();
        allProjects.forEach((p) => counts.set(p.location, (counts.get(p.location) || 0) + 1));
        return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
    }, [allProjects]);

    const filtered = allProjects.filter(
        (p) =>
            (statusFilter === "all" || p.type === statusFilter) &&
            (!locationFilter || p.location === locationFilter)
    );

    const stats = useMemo(() => {
        const counties = new Set(projects.map((p) => p.county).filter(Boolean));
        const communities = new Set(projects.map((p) => p.communityName).filter(Boolean));
        return {
            projects: projects.length,
            counties: counties.size,
            communities: communities.size,
            ongoing: projects.filter((p) => p.status === "ONGOING").length,
            completed: projects.filter((p) => p.status === "COMPLETED").length,
        };
    }, [projects]);

    {/*const heroImage = useMemo(() => {
        const projectWithImage = projects.find((p) => p.images?.length > 0);
        return projectWithImage?.images?.[0] || marigat;
    }, [projects]);*/}

    // Featured projects for the hero section (first 3 or all if less)
    const featuredProjects = useMemo(() => {
        return allProjects.slice(0, 3);
    }, [allProjects]);

    return (
        <>
            <div className="min-h-screen bg-[#060b07] text-white">
                <style>{`
                    @keyframes float {
                        0%, 100% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                    }
                    .float-anim { animation: float 6s ease-in-out infinite; }
                    .no-scrollbar { scrollbar-width: none; }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    .card-hover {
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    }
                    .card-hover:hover {
                        transform: translateY(-8px);
                        box-shadow: 0 20px 40px -12px rgba(16, 185, 129, 0.3);
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .float-anim { animation: none !important; }
                        .card-hover:hover { transform: none !important; }
                    }
                `}</style>

                <Navbar />

                {/* ===== HERO SECTION ===== */}
                <section className="relative px-6 pt-32 pb-20 md:px-8 lg:px-12 overflow-hidden">
                    {/* Background decorations */}
                    <div className="absolute inset-0">
                        <div className="absolute top-20 left-10 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px]" />
                        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-emerald-400/5 rounded-full blur-[120px]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[150px]" />
                    </div>

                    <div className="relative mx-auto max-w-7xl">
                        <Reveal>
                            <div className="text-center max-w-4xl mx-auto mb-16">
                                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-5 py-2.5 text-sm font-medium text-emerald-300 mb-6">
                                    <Sparkles size={16} />
                                    {PROJECTS_CONTENT.hero.eyebrow || "Restoring Hope, One Project at a Time"}
                                </div>

                                <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
                                    Turning
                                    <span className="block text-emerald-400">Drylands Green</span>
                                </h1>

                                <p className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                                    {PROJECTS_CONTENT.hero.description || "Explore our transformative projects restoring ecosystems and empowering communities across Kenya."}
                                </p>
                            </div>
                        </Reveal>

                        {/* Featured Projects Grid - 3 Cards */}
                        {!isLoading && featuredProjects.length > 0 && (
                            <Reveal>
                                <div className="grid md:grid-cols-3 gap-6 mb-16">
                                    {featuredProjects.map((project, index) => (
                                        <div
                                            key={project.id}
                                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm card-hover"
                                        >
                                            <div className="aspect-[4/3] overflow-hidden">
                                                <img
                                                    src={project.images?.[0] || getImage(index)}
                                                    alt={project.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${project.type === "ongoing"
                                                        ? "bg-amber-500/20 text-amber-300 border border-amber-400/20"
                                                        : "bg-emerald-500/20 text-emerald-300 border border-emerald-400/20"
                                                        }`}>
                                                        {project.type === "ongoing" ? "In Progress" : "Completed"}
                                                    </span>
                                                    <span className="text-xs text-white/40 flex items-center gap-1">
                                                        <MapPin size={12} />
                                                        {project.location}
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">
                                                    {project.title}
                                                </h3>
                                                <p className="text-sm text-white/60 line-clamp-2 mt-1">
                                                    {project.description}
                                                </p>
                                                <Link
                                                    to={`/projects/${project.id}`}
                                                    className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-all hover:gap-3"
                                                >
                                                    Learn More <ArrowRight size={14} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Reveal>
                        )}

                        {/* Stats Row */}
                        <Reveal>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 border-t border-white/5 pt-12">
                                {[
                                    { label: "Total Projects", value: stats.projects, icon: Target },
                                    { label: "Counties", value: stats.counties, icon: MapPin },
                                    { label: "Communities", value: stats.communities, icon: Users },
                                    { label: "Ongoing", value: stats.ongoing, icon: TrendingUp },
                                    { label: "Completed", value: stats.completed, icon: CheckCircle2 },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="text-center group"
                                    >
                                        <stat.icon size={20} className="text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                        <div className="text-2xl font-bold text-white/90">
                                            {isLoading ? (
                                                <Loader2 size={20} className="animate-spin text-white/30 mx-auto" />
                                            ) : (
                                                <AnimatedNumber value={stat.value} />
                                            )}
                                        </div>
                                        <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ===== FILTER & SORT BAR ===== */}
                <section className="px-6 pb-8 md:px-8 lg:px-12 sticky top-20 z-30">
                    <div className="mx-auto max-w-7xl">
                        <Reveal>
                            <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-4">
                                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <Filter size={18} className="text-white/40" />
                                        <span className="text-sm text-white/40 font-medium">Sort By:</span>
                                        <div className="flex gap-2 rounded-xl bg-white/5 p-1.5">
                                            {[
                                                { key: "all", label: "All" },
                                                { key: "ongoing", label: "Ongoing" },
                                                { key: "completed", label: "Completed" },
                                            ].map((tab) => (
                                                <button
                                                    key={tab.key}
                                                    onClick={() => setStatusFilter(tab.key)}
                                                    className={`rounded-lg px-5 py-2.5 text-sm font-medium transition-all ${statusFilter === tab.key
                                                        ? "bg-emerald-500 text-white shadow-lg"
                                                        : "text-white/50 hover:text-white hover:bg-white/5"
                                                        }`}
                                                >
                                                    {tab.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="text-sm text-white/40 flex items-center gap-2">
                                            <MapPin size={14} className="text-emerald-400" />
                                            Location:
                                        </span>
                                        {locationFilter && (
                                            <button
                                                onClick={() => setLocationFilter(null)}
                                                className="flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-400/20 px-3 py-1.5 text-xs text-emerald-300 hover:bg-emerald-500/20"
                                            >
                                                <X size={12} />
                                                Clear
                                            </button>
                                        )}
                                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                                            {locations.map(([loc, count]) => (
                                                <button
                                                    key={loc}
                                                    onClick={() => setLocationFilter(locationFilter === loc ? null : loc)}
                                                    className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm transition-all ${locationFilter === loc
                                                        ? "bg-emerald-500/90 text-white"
                                                        : "text-white/50 hover:text-white hover:bg-white/5"
                                                        }`}
                                                >
                                                    {loc}
                                                    <span className="ml-1.5 text-xs opacity-60">{count}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ===== ALL PROJECTS GRID ===== */}
                <section className="px-6 pb-20 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <Reveal className="mb-12">
                            <div className="flex items-center gap-3">
                                <Sparkles size={24} className="text-amber-400" />
                                <div>
                                    <p className="text-sm uppercase tracking-wider text-white/40">Our Impact</p>
                                    <h2 className="text-3xl md:text-4xl font-bold">
                                        {statusFilter === "ongoing" ? "Active Projects" :
                                            statusFilter === "completed" ? "Completed Work" :
                                                "All Projects"}
                                    </h2>
                                </div>
                            </div>
                        </Reveal>

                        {isLoading && (
                            <div className="flex justify-center py-20">
                                <Loader2 size={40} className="animate-spin text-emerald-400" />
                            </div>
                        )}

                        {!isLoading && filtered.length === 0 && (
                            <Reveal>
                                <div className="text-center py-20">
                                    <div className="text-6xl mb-4">🌱</div>
                                    <p className="text-xl text-white/70">No projects found</p>
                                    <p className="text-sm text-white/40 mt-2">Try adjusting your filters</p>
                                </div>
                            </Reveal>
                        )}

                        {!isLoading && filtered.length > 0 && (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filtered.map((project, i) => {
                                    const isOngoing = project.type === "ongoing";
                                    const image = project.images?.[0] || getImage(i);

                                    return (
                                        <Reveal key={project.id}>
                                            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm card-hover h-full flex flex-col">
                                                <div className="aspect-[4/3] overflow-hidden relative">
                                                    <img
                                                        src={image}
                                                        alt={project.title}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                                                    {/* Status Badge */}
                                                    <div className="absolute top-4 right-4">
                                                        <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full backdrop-blur-md ${isOngoing
                                                            ? "bg-amber-500/30 text-amber-200 border border-amber-400/30"
                                                            : "bg-emerald-500/30 text-emerald-200 border border-emerald-400/30"
                                                            }`}>
                                                            {isOngoing ? "In Progress" : "Completed"}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="p-6 flex flex-col flex-grow">
                                                    <div className="flex items-center gap-2 text-sm text-white/40 mb-2">
                                                        <MapPin size={14} className="text-emerald-400" />
                                                        {project.location}
                                                        {project.county && `, ${project.county}`}
                                                    </div>

                                                    <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors mb-2">
                                                        {project.title}
                                                    </h3>

                                                    <p className="text-sm text-white/60 line-clamp-3 flex-grow">
                                                        {project.description}
                                                    </p>

                                                    {project.tags && project.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-1.5 mt-4">
                                                            {project.tags.slice(0, 3).map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/40"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            {project.tags.length > 3 && (
                                                                <span className="text-xs text-white/30">+{project.tags.length - 3}</span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <Link
                                                        to={`/projects/${project.id}`}
                                                        className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-all hover:gap-3"
                                                    >
                                                        Learn More <ArrowRight size={14} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </Reveal>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* ===== TESTIMONIALS ===== */}
                <section className="px-6 py-20 md:px-8 lg:px-12 border-t border-white/5">
                    <div className="mx-auto max-w-7xl">
                        <Reveal className="mb-12">
                            <div className="text-center">
                                <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-300 mb-6">
                                    <Star size={16} />
                                    Hear from Our Communities
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Stories of Transformation</h2>
                                <p className="text-white/50 max-w-lg mx-auto">
                                    Discover how restoration is changing lives and landscapes
                                </p>
                            </div>
                        </Reveal>

                        {testimonials.length === 0 ? (
                            <div className="text-center py-12">
                                <Quote size={40} className="text-white/10 mx-auto mb-4" />
                                <p className="text-white/40">Stories coming soon</p>
                            </div>
                        ) : (
                            <div className="no-scrollbar flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                                {testimonials.map((t) => (
                                    <div
                                        key={t.id}
                                        className="w-[350px] shrink-0 snap-start rounded-2xl border border-white/5 bg-white/5 p-8 hover:border-emerald-500/20 hover:bg-white/10 transition-all"
                                    >
                                        <Quote size={40} className="text-emerald-500/20 mb-6" />
                                        <p className="text-white/80 text-lg leading-relaxed mb-6">
                                            "{t.message}"
                                        </p>
                                        <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                                            <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold text-lg">
                                                {t.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{t.name}</p>
                                                <p className="text-sm text-white/40">{t.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* ===== FINAL CTA ===== */}
                <section className="px-6 pb-20 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <Reveal>
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border border-emerald-500/20 p-12 md:p-16 text-center">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                                <div className="relative">
                                    <Heart size={48} className="text-emerald-400 mx-auto mb-6" />
                                    <h3 className="text-3xl md:text-5xl font-bold mb-4">Be Part of the Change</h3>
                                    <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
                                        Your support helps us restore drylands, empower communities, and create lasting environmental impact across Kenya
                                    </p>
                                    <button
                                        onClick={() => setIsDonationOpen(true)}
                                        className="inline-flex items-center gap-3 rounded-full bg-emerald-500 px-10 py-5 font-semibold text-white text-lg transition-all hover:bg-emerald-400 hover:shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-0.5"
                                    >
                                        <Heart size={24} />
                                        Make a Difference Today
                                    </button>
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

export default ProjectsPage;