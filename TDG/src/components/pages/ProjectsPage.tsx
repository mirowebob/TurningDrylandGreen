import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
    ArrowRight,
    CheckCircle2,
    Heart,
    Leaf,
    MapPin,
    Quote,
    Sparkles,
    Sprout,
    Users,
    X,
    Loader2,
    Target,
    TrendingUp,
    ArrowUpRight,
    Calendar,
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

    const heroImage = useMemo(() => {
        const projectWithImage = projects.find((p) => p.images?.length > 0);
        return projectWithImage?.images?.[0] || marigat;
    }, [projects]);

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
                    @media (prefers-reduced-motion: reduce) {
                        .float-anim { animation: none !important; }
                    }
                `}</style>

                <Navbar />

                {/* ===== HERO ===== */}
                <section className="relative px-6 pt-32 pb-16 md:px-8 lg:px-12">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px]" />
                        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-[120px]" />
                    </div>

                    <div className="relative mx-auto max-w-7xl">
                        <Reveal>
                            <div className="grid lg:grid-cols-2 gap-12 items-center">
                                <div className="space-y-8">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
                                        <Leaf size={16} />
                                        {PROJECTS_CONTENT.hero.eyebrow}
                                    </div>

                                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                                        Turning
                                        <span className="block text-emerald-400">Drylands Green</span>
                                    </h1>

                                    <p className="text-lg text-white/60 max-w-lg leading-relaxed">
                                        {PROJECTS_CONTENT.hero.description}
                                    </p>

                                    <div className="flex flex-wrap gap-4">
                                        <button
                                            onClick={() => setIsDonationOpen(true)}
                                            className="group inline-flex items-center gap-3 rounded-full bg-emerald-500 px-8 py-4 font-semibold text-white transition-all hover:bg-emerald-400 hover:shadow-xl hover:shadow-emerald-500/20 hover:-translate-y-0.5"
                                        >
                                            <Heart size={20} className="group-hover:scale-110 transition-transform" />
                                            Support Our Work
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
                                        <img
                                            src={heroImage}
                                            alt="Restoration work"
                                            className="w-full h-[400px] lg:h-[500px] object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                        <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-4 py-2 text-sm border border-white/10">
                                            <MapPin size={14} className="text-emerald-400" />
                                            <span>Kenya</span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-6 -left-6 float-anim hidden lg:block">
                                        <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-4 shadow-2xl">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                    <Target size={18} className="text-emerald-400" />
                                                </div>
                                                <div>
                                                    <div className="text-2xl font-bold">
                                                        <AnimatedNumber value={stats.projects} />
                                                    </div>
                                                    <div className="text-xs text-white/50">Active Projects</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ===== QUICK STATS ===== */}
                <section className="px-6 pb-8 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <Reveal>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: "Total Projects", value: stats.projects, icon: Target },
                                    { label: "Counties Reached", value: stats.counties, icon: MapPin },
                                    { label: "Communities", value: stats.communities, icon: Users },
                                    { label: "Completed", value: stats.completed, icon: CheckCircle2 },
                                ].map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="group rounded-2xl border border-white/5 bg-white/5 p-6 hover:bg-white/10 transition-all hover:-translate-y-1"
                                    >
                                        <stat.icon size={20} className="text-emerald-400 mb-4" />
                                        <div className="text-3xl font-bold">
                                            {isLoading ? (
                                                <Loader2 size={24} className="animate-spin text-white/30" />
                                            ) : (
                                                <AnimatedNumber value={stat.value} />
                                            )}
                                        </div>
                                        <div className="text-sm text-white/40 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ===== FILTER BAR ===== */}
                <section className="px-6 pb-12 md:px-8 lg:px-12 sticky top-20 z-30">
                    <div className="mx-auto max-w-7xl">
                        <Reveal>
                            <div className="rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-4">
                                <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                                    {/* Status Filter */}
                                    <div className="flex gap-2 rounded-xl bg-white/5 p-1.5">
                                        {[
                                            { key: "all", label: "All Projects" },
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

                                    {/* Location Filter */}
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
                                        {locations.map(([loc, count]) => (
                                            <button
                                                key={loc}
                                                onClick={() => setLocationFilter(locationFilter === loc ? null : loc)}
                                                className={`rounded-full px-4 py-1.5 text-sm transition-all ${locationFilter === loc
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
                        </Reveal>
                    </div>
                </section>

                {/* ===== PROJECTS - MAIN DISPLAY ===== */}
                <section className="px-6 pb-16 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        {/* Section Header */}
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

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex justify-center py-20">
                                <Loader2 size={40} className="animate-spin text-emerald-400" />
                            </div>
                        )}

                        {/* Empty State */}
                        {!isLoading && filtered.length === 0 && (
                            <Reveal>
                                <div className="text-center py-20">
                                    <div className="text-6xl mb-4">🌱</div>
                                    <p className="text-xl text-white/70">No projects found</p>
                                    <p className="text-sm text-white/40 mt-2">Try adjusting your filters</p>
                                </div>
                            </Reveal>
                        )}

                        {/* Project Cards - Large Display */}
                        {!isLoading && filtered.length > 0 && (
                            <div className="space-y-12">
                                {filtered.map((project, i) => {
                                    const isOngoing = project.type === "ongoing";
                                    const image = project.images?.[0] || getImage(i);
                                    const isEven = i % 2 === 0;

                                    return (
                                        <Reveal key={project.id}>
                                            <article className={`grid lg:grid-cols-2 gap-8 lg:gap-16 items-center ${!isEven ? "lg:[&>*:first-child]:order-2" : ""
                                                }`}>
                                                {/* Image Side */}
                                                <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl group">
                                                    <div className="aspect-[4/3] overflow-hidden">
                                                        <img
                                                            src={image}
                                                            alt={project.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                                                    {/* Status Badge */}
                                                    <div className={`absolute top-6 right-6 flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold backdrop-blur-md ${isOngoing
                                                        ? "border-amber-400/40 bg-black/50 text-amber-200"
                                                        : "border-emerald-400/40 bg-black/50 text-emerald-200"
                                                        }`}>
                                                        {isOngoing && <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
                                                        {isOngoing ? "In Progress" : "Completed"}
                                                    </div>

                                                    {/* Location & Community */}
                                                    <div className="absolute bottom-6 left-6 flex flex-wrap gap-3">
                                                        <div className="flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md px-4 py-2 text-sm text-white/90 border border-white/10">
                                                            <MapPin size={14} className="text-emerald-400" />
                                                            {project.location}, {project.county}
                                                        </div>
                                                        {project.communityName && (
                                                            <div className="flex items-center gap-2 rounded-full bg-emerald-500/20 backdrop-blur-md px-4 py-2 text-sm text-emerald-200 border border-emerald-400/20">
                                                                <Users size={14} />
                                                                {project.communityName}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content Side */}
                                                <div className="space-y-6">
                                                    {/* Project Number */}
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-5xl font-bold text-white/10">
                                                            {String(i + 1).padStart(2, "0")}
                                                        </span>
                                                        <div>
                                                            <span className={`text-xs font-semibold uppercase tracking-[0.3em] ${isOngoing ? "text-amber-400" : "text-emerald-400"
                                                                }`}>
                                                                {isOngoing ? "Ongoing Initiative" : "Completed Project"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight group-hover:text-emerald-200 transition-colors">
                                                        {project.title}
                                                    </h3>

                                                    {/* Description */}
                                                    <p className="text-lg leading-relaxed text-white/70">
                                                        {project.description}
                                                    </p>

                                                    {/* Tags */}
                                                    {project.tags && project.tags.length > 0 && (
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.tags.map((tag) => (
                                                                <span
                                                                    key={tag}
                                                                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 hover:border-white/20 hover:text-white/80 transition-all cursor-default"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Impact / Outcome */}
                                                    <div className={`rounded-2xl border p-6 ${isOngoing
                                                        ? "border-amber-400/20 bg-amber-500/5"
                                                        : "border-emerald-400/20 bg-emerald-500/5"
                                                        }`}>
                                                        <div className="flex items-center gap-2 mb-3">
                                                            {isOngoing ? (
                                                                <TrendingUp size={20} className="text-amber-400" />
                                                            ) : (
                                                                <CheckCircle2 size={20} className="text-emerald-400" />
                                                            )}
                                                            <span className={`font-semibold ${isOngoing ? "text-amber-300" : "text-emerald-300"
                                                                }`}>
                                                                {isOngoing ? "Expected Impact" : "Outcome Achieved"}
                                                            </span>
                                                        </div>
                                                        <p className={`leading-relaxed ${isOngoing ? "text-amber-100/80" : "text-emerald-100/80"
                                                            }`}>
                                                            {isOngoing ? project.impact : project.outcome}
                                                        </p>
                                                    </div>

                                                    {/* Action Link */}
                                                    <button
                                                        onClick={() => setIsDonationOpen(true)}
                                                        className={`inline-flex items-center gap-2 font-semibold transition-all hover:gap-3 ${isOngoing ? "text-amber-400 hover:text-amber-300" : "text-emerald-400 hover:text-emerald-300"
                                                            }`}
                                                    >
                                                        <span>Support this project</span>
                                                        <ArrowRight size={18} />
                                                    </button>
                                                </div>
                                            </article>

                                            {/* Divider */}
                                            {i < filtered.length - 1 && (
                                                <div className="mt-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                            )}
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
                                    <Users size={16} />
                                    Community Voices
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Stories of Change</h2>
                                <p className="text-white/50 max-w-lg mx-auto">
                                    Hear directly from the communities we work with
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
                                        className="w-[350px] shrink-0 snap-start rounded-2xl border border-white/5 bg-white/5 p-8 hover:border-amber-500/20 hover:bg-white/10 transition-all"
                                    >
                                        <Quote size={40} className="text-amber-500/20 mb-6" />
                                        <p className="text-white/80 text-lg leading-relaxed mb-6">
                                            "{t.message}"
                                        </p>
                                        <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                                            <div className="h-12 w-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
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

                        <Reveal>
                            <div className="mt-10 text-center">
                                <div className="inline-flex items-center gap-2 text-emerald-400 text-sm">
                                    <Sprout size={16} />
                                    Every story starts with a seed of hope
                                </div>
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* ===== CTA ===== */}
                <section className="px-6 pb-20 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <Reveal>
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-900/50 to-emerald-800/30 border border-emerald-500/20 p-12 md:p-16 text-center">
                                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
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