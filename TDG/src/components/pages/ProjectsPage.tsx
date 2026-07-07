import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
    ArrowRight,
    ArrowUpRight,
    CheckCircle2,
    Filter,
    Heart,
    Leaf,
    MapPin,
    Quote,
    Sparkles,
    Sprout,
    Users,
    X,
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

const IMAGE_POOL = [marigat, kisiriri, suswaErosion, narokTown];
const pickImage = (i: number) => IMAGE_POOL[i % IMAGE_POOL.length];

// Local shape used for rendering — a DTO plus a lowercase "type" we derive
// from `status`, so the rest of the component doesn't need to care about
// the enum casing.
type DisplayProject = ProjectDTO & { type: "ongoing" | "completed" };

const toDisplayProject = (p: ProjectDTO): DisplayProject => ({
    ...p,
    type: p.status === "ONGOING" ? "ongoing" : "completed",
});

/* ---------------------------------------------------------
   Scroll-reveal wrapper. Fades + lifts children into view
   the first time they cross the viewport, then leaves them.
--------------------------------------------------------- */
const Reveal = ({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) => {
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
            { threshold: 0.15 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                } ${className}`}
            style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
        >
            {children}
        </div>
    );
};

/* ---------------------------------------------------------
   Counts up the numeric portion of a stat value once it
   scrolls into view (e.g. "1,240 Ha" -> animates 0 -> 1240).
--------------------------------------------------------- */
const AnimatedStat = ({ value }: { value: string }) => {
    const ref = useRef<HTMLSpanElement | null>(null);
    const [display, setDisplay] = useState<number | null>(null);

    const match = String(value).match(/[\d,]+/);
    const numeric = match ? parseInt(match[0].replace(/,/g, ""), 10) : null;
    const prefix = match?.index != null ? value.slice(0, match.index) : "";
    const suffix = match?.index != null ? value.slice(match.index + match[0].length) : "";

    useEffect(() => {
        const node = ref.current;
        if (!node || numeric === null) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                const duration = 1200;
                const start = performance.now();
                const tick = (now: number) => {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    setDisplay(Math.round(eased * numeric));
                    if (progress < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            },
            { threshold: 0.4 }
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [numeric]);

    if (numeric === null) {
        return <span ref={ref}>{value}</span>;
    }

    return (
        <span ref={ref}>
            {prefix}
            {(display ?? 0).toLocaleString()}
            {suffix}
        </span>
    );
};

/* ---------------------------------------------------------
   Rotates through project photos + their location, fading
   between them every few seconds. Falls back to a static
   pool of local images if no projects have loaded yet.
--------------------------------------------------------- */
const HeroImageCarousel = ({
    slides,
}: {
    slides: { image: string; location: string }[];
}) => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (slides.length <= 1) return;
        const interval = setInterval(() => {
            setIndex((i) => (i + 1) % slides.length);
        }, 4500);
        return () => clearInterval(interval);
    }, [slides.length]);

    // Keep index in range if the slide list shrinks (e.g. after a refetch)
    useEffect(() => {
        if (index >= slides.length) setIndex(0);
    }, [slides.length, index]);

    if (slides.length === 0) return null;

    return (
        <div className="relative h-full min-h-[420px] w-full overflow-hidden sm:min-h-[480px] lg:min-h-[560px]">
            {slides.map((slide, i) => (
                <img
                    key={slide.image + i}
                    src={slide.image}
                    alt={slide.location || "Restoration project"}
                    className={`kb-image absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-in-out ${i === index ? "opacity-100" : "opacity-0"
                        }`}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/85 backdrop-blur-sm">
                <MapPin size={13} />
                {slides[index]?.location || "Kenya"}
            </div>
            {slides.length > 1 && (
                <div className="absolute bottom-4 right-4 flex gap-1.5">
                    {slides.map((_, i) => (
                        <span
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-500 ${i === index ? "w-4 bg-white/90" : "w-1.5 bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
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

        const loadProjects = async () => {
            try {
                const data = await fetchProjects();
                if (!cancelled) setProjects(data);
            } catch (err) {
                console.error("Failed to load projects:", err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadProjects();
        return () => {
            cancelled = true;
        };
    }, []);

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
                console.error("Failed to load page data:", err);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadData();
        return () => {
            cancelled = true;
        };
    }, []);

    const allProjects = useMemo<DisplayProject[]>(
        () => projects.map(toDisplayProject),
        [projects]
    );

    const locations = useMemo(() => {
        const counts = new Map<string, number>();
        allProjects.forEach((p) => counts.set(p.location, (counts.get(p.location) || 0) + 1));
        return Array.from(counts.entries());
    }, [allProjects]);

    const filtered = allProjects.filter(
        (p) =>
            (statusFilter === "all" || p.type === statusFilter) &&
            (!locationFilter || p.location === locationFilter)
    );

    const ongoingCount = allProjects.filter((p) => p.type === "ongoing").length;
    const completedCount = allProjects.filter((p) => p.type === "completed").length;

    const statusTabs = [
        { key: "all", label: "All work", count: allProjects.length },
        { key: "ongoing", label: "Ongoing", count: ongoingCount },
        { key: "completed", label: "Completed", count: completedCount },
    ];

    const summaryStats = useMemo(() => {
        const counties = Array.from(
            new Set(projects.map((p) => p.county).filter(Boolean))
        );
        const communities = Array.from(
            new Set(projects.map((p) => p.communityName).filter(Boolean))
        );
        const ongoing = projects.filter((p) => p.status === "ONGOING").length;
        const completed = projects.filter((p) => p.status === "COMPLETED").length;

        return [
            {
                label: "Projects",
                value: String(projects.length),
                description:
                    projects.length > 0
                        ? `${ongoing} ongoing and ${completed} completed across our program areas.`
                        : "Loading current project count…",
            },
            {
                label: "Counties",
                value: String(counties.length),
                description:
                    counties.length > 0
                        ? `Active work in ${counties.slice(0, 3).join(", ")}${counties.length > 3 ? ", and more" : ""
                        }.`
                        : "Mapping county coverage…",
            },
            {
                label: "Communities",
                value: String(communities.length),
                description:
                    communities.length > 0
                        ? `Partnering with communities including ${communities
                            .slice(0, 3)
                            .join(", ")}${communities.length > 3 ? ", and more" : ""}.`
                        : "Gathering community partners…",
            },
        ];
    }, [projects]);

    const heroSlides = useMemo(() => {
        const fromProjects = projects
            .flatMap((p) =>
                (p.images ?? []).map((image) => ({ image, location: p.location }))
            )
            .filter((s) => !!s.image);

        if (fromProjects.length > 0) return fromProjects;

        // Fallback while loading or if no project has images yet
        return IMAGE_POOL.map((image) => ({ image, location: "Kenya" }));
    }, [projects]);

    return (
        <>
            <div className="min-h-screen overflow-x-hidden bg-forest text-white">
                <style>{`
                    @keyframes driftSlow {
                        0%, 100% { transform: translate(0, 0) scale(1); }
                        50% { transform: translate(-3%, 4%) scale(1.08); }
                    }
                    @keyframes driftSlowReverse {
                        0%, 100% { transform: translate(0, 0) scale(1.05); }
                        50% { transform: translate(4%, -3%) scale(1); }
                    }
                    @keyframes kenBurns {
                        0% { transform: scale(1.06); }
                        100% { transform: scale(1.16); }
                    }
                    @keyframes drawPath {
                        to { stroke-dashoffset: 0; }
                    }
                    @keyframes floatDot {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-6px); }
                    }
                    .orb-a { animation: driftSlow 16s ease-in-out infinite; }
                    .orb-b { animation: driftSlowReverse 20s ease-in-out infinite; }
                    .kb-image { animation: kenBurns 14s ease-out forwards; }
                    .grow-path { stroke-dasharray: 900; stroke-dashoffset: 900; animation: drawPath 2.4s ease-out forwards; animation-delay: .3s; }
                    .float-dot { animation: floatDot 3s ease-in-out infinite; }
                    .no-scrollbar { scrollbar-width: none; -ms-overflow-style: none; }
                    .no-scrollbar::-webkit-scrollbar { display: none; }
                    @media (prefers-reduced-motion: reduce) {
                        .orb-a, .orb-b, .kb-image, .grow-path, .float-dot { animation: none !important; }
                    }
                `}</style>

                <Navbar />

                {/* HERO */}
                <section className="relative px-6 pb-16 pt-32 md:px-8 lg:px-12">
                    <div className="pointer-events-none absolute inset-0 overflow-hidden">
                        <div className="orb-a absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
                        <div className="orb-b absolute right-0 top-40 h-96 w-96 rounded-full bg-amber-400/10 blur-3xl" />
                    </div>

                    <div className="relative mx-auto flex max-w-7xl flex-col gap-10">
                        <Reveal className="group relative overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.25)]">
                            <HeroImageCarousel slides={heroSlides} />

                            {/* Overlaid content sits above the carousel's own gradient/dots */}
                            <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8 md:p-12">
                                <div className="pointer-events-auto max-w-2xl">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-100 backdrop-blur-sm">
                                        <Leaf size={14} className="animate-pulse" />
                                        {PROJECTS_CONTENT.hero.eyebrow}
                                    </div>
                                    <h1 className="mt-5 font-display text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
                                        {PROJECTS_CONTENT.hero.title}
                                    </h1>
                                    <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85">
                                        {PROJECTS_CONTENT.hero.description}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setIsDonationOpen(true)}
                                        className="mt-6 inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-300/90 px-5 py-2.5 text-sm font-semibold text-forest shadow-lg shadow-black/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-emerald-200"
                                    >
                                        <Heart size={16} />
                                        Support this work
                                    </button>
                                </div>
                            </div>
                        </Reveal>

                        <div className="relative -mb-2 -mt-2 hidden h-10 w-full items-center justify-center md:flex">
                            <svg viewBox="0 0 800 40" className="h-10 w-full max-w-4xl" fill="none">
                                <path
                                    d="M0 20 Q 100 0, 200 20 T 400 20 T 600 20 T 800 20"
                                    stroke="url(#growGradient)"
                                    strokeWidth="2"
                                    className="grow-path"
                                />
                                <defs>
                                    <linearGradient id="growGradient" x1="0" y1="0" x2="800" y2="0">
                                        <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
                                        <stop offset="50%" stopColor="#34d399" stopOpacity="0.8" />
                                        <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <div className="grid gap-6 lg:grid-cols-3">
                            {summaryStats.map((item, i) => (
                                <Reveal key={item.label} delay={i * 120}>
                                    <div className="group h-full rounded-[1.5rem] border border-white/10 bg-[#203615]/70 p-6 shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-300/30 hover:shadow-emerald-900/30">
                                        <p className="font-display text-3xl font-semibold text-white transition-colors group-hover:text-emerald-200">
                                            <AnimatedStat value={item.value} />
                                        </p>
                                        <p className="mt-2 text-sm uppercase tracking-[0.25em] text-sage">{item.label}</p>
                                        <p className="mt-3 text-sm leading-relaxed text-white/70">{item.description}</p>
                                    </div>
                                </Reveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* WHERE WE WORK — location strip, doubles as a filter */}
                <section className="px-6 py-6 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <Reveal className="rounded-[1.75rem] border border-white/10 bg-[#1a2e10]/70 p-6 md:p-8">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-sage">
                                    <MapPin size={14} />
                                    Where the work is happening
                                </div>
                                {locationFilter && (
                                    <button
                                        onClick={() => setLocationFilter(null)}
                                        className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/70 transition-colors hover:border-white/30 hover:text-white"
                                    >
                                        <X size={12} />
                                        Clear
                                    </button>
                                )}
                            </div>
                            <div className="mt-5 flex flex-wrap gap-3">
                                {locations.map(([location, count], i) => {
                                    const active = locationFilter === location;
                                    return (
                                        <button
                                            key={location}
                                            onClick={() => setLocationFilter(active ? null : location)}
                                            style={{ transitionDelay: `${i * 30}ms` }}
                                            className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-all duration-300 ${active
                                                ? "border-[#c17a4d]/60 bg-[#c17a4d]/20 text-[#f2c9a8]"
                                                : "border-white/10 bg-white/[0.04] text-white/75 hover:-translate-y-0.5 hover:border-[#c17a4d]/30 hover:bg-[#c17a4d]/10"
                                                }`}
                                        >
                                            <span
                                                className={`h-1.5 w-1.5 rounded-full ${active ? "bg-[#f2c9a8]" : "bg-emerald-300/70"
                                                    }`}
                                            />
                                            {location}
                                            <span className="text-xs text-white/40">{count}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </Reveal>
                    </div>
                </section>

                {/* PROJECT INDEX — filterable, editorial layout */}
                <section className="px-6 py-14 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-full bg-amber-300/15 p-2 text-amber-200">
                                    <Sparkles size={18} />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sage">
                                        The work, project by project
                                    </p>
                                    <h2 className="font-display text-2xl text-white md:text-3xl">
                                        From first seedling to lasting change
                                    </h2>
                                </div>
                            </div>

                            <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1">
                                <Filter size={13} className="ml-2 text-white/40" />
                                {statusTabs.map((tab) => (
                                    <button
                                        key={tab.key}
                                        onClick={() => setStatusFilter(tab.key)}
                                        className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 ${statusFilter === tab.key
                                            ? "bg-emerald-300/90 text-forest shadow-sm"
                                            : "text-white/65 hover:text-white"
                                            }`}
                                    >
                                        {tab.label}
                                        <span className="ml-1.5 text-xs opacity-70">{tab.count}</span>
                                    </button>
                                ))}
                            </div>
                        </Reveal>

                        {isLoading ? (
                            <Reveal className="rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-12 text-center">
                                <p className="text-sm text-white/60">Loading projects…</p>
                            </Reveal>
                        ) : filtered.length === 0 ? (
                            <Reveal className="rounded-[1.75rem] border border-dashed border-white/15 bg-white/[0.03] p-12 text-center">
                                <p className="font-display text-xl text-white">Nothing here yet</p>
                                <p className="mt-2 text-sm text-white/60">
                                    No projects match this combination yet.
                                </p>
                            </Reveal>
                        ) : (
                            <div className="flex flex-col gap-16">
                                {filtered.map((project, index) => {
                                    const reversed = index % 2 === 1;
                                    const isOngoing = project.type === "ongoing";
                                    const imageSrc = project.images?.[0] || pickImage(index);
                                    return (
                                        <Reveal key={project.id} delay={80}>
                                            <article
                                                className={`group grid items-center gap-8 lg:grid-cols-2 ${reversed ? "lg:[&>*:first-child]:order-2" : ""
                                                    }`}
                                            >
                                                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
                                                    <div className="h-64 w-full overflow-hidden sm:h-80 lg:h-96">
                                                        <img
                                                            src={imageSrc}
                                                            alt={project.title}
                                                            className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${isOngoing ? "" : "grayscale-[15%] group-hover:grayscale-0"
                                                                }`}
                                                        />
                                                    </div>
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
                                                    <span
                                                        className={`absolute right-4 top-4 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] backdrop-blur-sm ${isOngoing
                                                            ? "border-amber-300/30 bg-black/40 text-amber-100"
                                                            : "border-emerald-300/30 bg-black/40 text-emerald-100"
                                                            }`}
                                                    >
                                                        {isOngoing && <span className="float-dot h-1.5 w-1.5 rounded-full bg-amber-300" />}
                                                        {isOngoing ? "Ongoing" : "Completed"}
                                                    </span>
                                                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/85 backdrop-blur-sm">
                                                        <MapPin size={12} />
                                                        {project.location}
                                                    </span>
                                                </div>

                                                <div>
                                                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/35">
                                                        {String(index + 1).padStart(2, "0")} — {isOngoing ? "In progress" : "Completed"}
                                                    </span>
                                                    <h3 className="mt-3 font-display text-2xl text-white transition-colors group-hover:text-emerald-200 md:text-3xl">
                                                        {project.title}
                                                    </h3>
                                                    <p className="mt-4 text-base leading-relaxed text-white/75">
                                                        {project.description}
                                                    </p>
                                                    <div className="mt-5 flex flex-wrap gap-2">
                                                        {project.tags.map((tag) => (
                                                            <span
                                                                key={tag}
                                                                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/75"
                                                            >
                                                                {tag}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    {isOngoing ? (
                                                        project.impact && (
                                                            <div className="mt-6 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                                                                <div className="flex items-center gap-2 font-semibold">
                                                                    <CheckCircle2 size={16} />
                                                                    <span>Expected impact</span>
                                                                </div>
                                                                <p className="mt-2 leading-relaxed text-emerald-50/90">
                                                                    {project.impact}
                                                                </p>
                                                            </div>
                                                        )
                                                    ) : (
                                                        project.outcome && (
                                                            <div className="mt-6 flex items-center gap-2 text-sm font-medium text-sage transition-all duration-300 group-hover:gap-3 group-hover:text-emerald-200">
                                                                <ArrowRight size={16} />
                                                                <span>{project.outcome}</span>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </article>
                                        </Reveal>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </section>

                {/* TESTIMONIALS — horizontal, swipeable */}
                <section className="px-6 py-16 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <Reveal className="mb-8 flex items-center gap-3">
                            <div className="rounded-full bg-[#c17a4d]/15 p-2 text-[#e7ad83]">
                                <Users size={18} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sage">
                                    Community voices
                                </p>
                                <h2 className="font-display text-2xl text-white">Testimonials from the field</h2>
                            </div>
                        </Reveal>

                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-forest to-transparent md:w-16" />
                            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-forest to-transparent md:w-16" />

                            <div className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4">
                                {testimonials.length === 0 ? (
                                    <p className="px-2 text-sm text-white/60">No testimonials yet — check back soon.</p>
                                ) : (
                                    testimonials.map((testimonial) => (
                                        <article
                                            key={testimonial.id}
                                            className="group relative w-[85%] shrink-0 snap-start overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#243c18]/80 p-6 shadow-[0_12px_40px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#c17a4d]/25 sm:w-[60%] lg:w-[calc(33.333%-1rem)]"
                                        >
                                            <Quote
                                                size={72}
                                                className="pointer-events-none absolute -right-3 -top-3 text-white/[0.04] transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="flex items-center gap-1 text-amber-200">
                                                {Array.from({ length: 5 }).map((_, idx) => (
                                                    <Quote key={idx} size={13} />
                                                ))}
                                            </div>
                                            <p className="relative mt-4 text-sm leading-relaxed text-white/80">
                                                &ldquo;{testimonial.message}&rdquo;
                                            </p>
                                            <div className="relative mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                                                <div>
                                                    <p className="font-semibold text-white">{testimonial.name}</p>
                                                    <p className="text-sm text-white/60">{testimonial.role}</p>
                                                </div>
                                                <ArrowUpRight
                                                    size={16}
                                                    className="text-white/20 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#e7ad83]"
                                                />
                                            </div>
                                        </article>
                                    ))
                                )}
                            </div>
                        </div>

                        <Reveal delay={150} className="mt-8 flex justify-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/70">
                                <Sprout size={15} className="text-emerald-300" />
                                Every story here traces back to soil, seed, and a community that stayed.
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