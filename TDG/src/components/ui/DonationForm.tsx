import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Heart, Loader2, ShieldCheck, Sparkles, X } from "lucide-react";
import { toBuniPhoneFormat } from "../../utils/toBuniPhoneFormat.ts";

/**
 * DonationForm
 * ------------------------------------------------------------------
 * A self-contained, one-time-donation UI. It does NOT talk to any
 * payment processor — that's intentional. Wire it up by passing an
 * `onSubmit` prop:
 *
 *   <DonationForm
 *     onSubmit={async ({ amount, currency, name, phone, message, anonymous }) => {
 *       await initiateStkPush({ ... }); // or whatever your backend call is
 *     }}
 *   />
 *
 * If you don't pass onSubmit, it just simulates a short delay and shows
 * the success state, so you can preview the flow before payments exist.
 *
 * Pass `onClose` to get a close (X) button in the top corner — useful
 * when this sits inside DonationModal.jsx or any modal of your own.
 *
 * Pass `onStatusChange` if a parent needs to know when a submission is
 * in flight (e.g. to block the modal from closing mid-payment).
 *
 * Adjust AMOUNT_PRESETS below to reflect your program's real costs.
 * ------------------------------------------------------------------
 */

const AMOUNT_PRESETS = [
    { value: 1000, impact: "A day of seedlings and tools" },
    { value: 2500, impact: "One household through planting season" },
    { value: 5000, impact: "Erosion-control work for a small plot" },
    { value: 10000, impact: "A full community training day" },
];

type DonationStatus = "idle" | "submitting" | "success";
type FormErrors = Partial<Record<"amount" | "name" | "phone" | "submit", string>>;

interface DonationPayload {
    amount: number;
    currency: string;
    name: string;
    phone: string;
    message: string;
    anonymous: boolean;
}

interface DonationFormProps {
    currency?: string;
    onSubmit?: (payload: DonationPayload) => Promise<void> | void;
    onClose?: () => void;
    onStatusChange?: (isSubmitting: boolean) => void;
    className?: string;
    showWrapper?: boolean;
}

const DonationForm = ({
    currency = "KES",
    onSubmit,
    onClose,
    onStatusChange,
    className = "",
    showWrapper = true,
}: DonationFormProps) => {
    const [selectedAmount, setSelectedAmount] = useState(AMOUNT_PRESETS[1].value);
    const [isCustom, setIsCustom] = useState(false);
    const [customAmount, setCustomAmount] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [message, setMessage] = useState("");
    const [anonymous, setAnonymous] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [status, setStatus] = useState<DonationStatus>("idle"); // idle | submitting | success

    const amount = isCustom ? Number(customAmount) || 0 : selectedAmount;
    const activeImpact = !isCustom
        ? AMOUNT_PRESETS.find((p) => p.value === selectedAmount)?.impact
        : null;
    const isSubmitting = status === "submitting";

    const selectPreset = (value: number) => {
        setIsCustom(false);
        setSelectedAmount(value);
        setErrors((prev) => ({ ...prev, amount: undefined }));
    };

    const selectCustom = () => {
        setIsCustom(true);
        setErrors((prev) => ({ ...prev, amount: undefined }));
    };

    const validate = () => {
        const next: FormErrors = {};
        if (!amount || amount <= 0) next.amount = "Enter an amount greater than 0";
        if (!anonymous && !name.trim()) next.name = "Please enter your name";
        if (!phone.trim() || !toBuniPhoneFormat(phone)) {
            next.phone = "Enter a valid Kenyan phone number (e.g. 0712345678)";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus("submitting");
        onStatusChange?.(true);

        const payload: DonationPayload = {
            amount,
            currency,
            name: anonymous ? "Anonymous" : name.trim(),
            phone: phone.trim(),
            message: message.trim(),
            anonymous,
        };

        try {
            if (onSubmit) {
                await onSubmit(payload);
            } else {
                // No handler wired up yet — just simulate a delay so the
                // form has something to demo. Replace via the onSubmit prop.
                await new Promise((resolve) => setTimeout(resolve, 900));
            }
            setStatus("success");
        } catch (err) {
            setStatus("idle");
            setErrors((prev) => ({
                ...prev,
                submit: err instanceof Error ? err.message : "Something went wrong. Please try again.",
            }));
        } finally {
            onStatusChange?.(false);
        }
    };

    const resetForm = () => {
        setStatus("idle");
        setSelectedAmount(AMOUNT_PRESETS[1].value);
        setIsCustom(false);
        setCustomAmount("");
        setName("");
        setPhone("");
        setMessage("");
        setAnonymous(false);
        setErrors({});
    };

    const closeButton = showWrapper && onClose && (
        <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close"
            className="absolute right-4 top-4 rounded-full p-1.5 text-white/60 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
        >
            <X size={18} />
        </button>
    );

    if (status === "success") {
        return (
            <div
                className={
                    showWrapper
                        ? `relative rounded-[1.5rem] border border-emerald-300/25 bg-[linear-gradient(135deg,#203615_0%,#2d4a1e_55%,#16280e_100%)] p-6 text-center shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${className}`
                        : `w-full text-center ${className}`
                }
            >
                <style>{`
                    @keyframes popIn { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
                    .success-check { animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                `}</style>
                {closeButton}
                <div className="success-check mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/20 text-emerald-300">
                    <CheckCircle2 size={26} />
                </div>
                <h3 className="mt-4 font-display text-xl text-white">
                    Thank you{!anonymous && name ? `, ${name.split(" ")[0]}` : ""}.
                </h3>
                <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-white/80">
                    Your gift of {currency} {amount.toLocaleString()} has been recorded. A confirmation goes to{" "}
                    {phone}.
                </p>
                <button
                    onClick={resetForm}
                    className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:border-emerald-300/50 hover:bg-white/15"
                >
                    Make another gift
                </button>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={
                showWrapper
                    ? `relative w-full max-w-sm rounded-[1.5rem] border border-white/15 bg-[linear-gradient(135deg,#203615_0%,#2d4a1e_55%,#16280e_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${className}`
                    : `w-full ${className}`
            }
            noValidate
        >
            {closeButton}

            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300/40 bg-emerald-300/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-100">
                <Heart size={12} />
                Gift Turning DryLands Green
            </div>
            <h2 className="mt-3 font-display text-xl leading-snug text-white">Fund the next planting season</h2>

            {/* Amount selection */}
            <fieldset disabled={isSubmitting} className="mt-5 disabled:opacity-60">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200/90">
                    Choose an amount
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                    {AMOUNT_PRESETS.map((preset) => {
                        const active = !isCustom && selectedAmount === preset.value;
                        return (
                            <button
                                type="button"
                                key={preset.value}
                                onClick={() => selectPreset(preset.value)}
                                className={`rounded-xl border px-3 py-2 text-left transition-all duration-200 ${active
                                    ? "border-emerald-300 bg-emerald-300/20 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]"
                                    : "border-white/15 bg-white/[0.06] text-white/90 hover:border-emerald-300/40 hover:bg-white/[0.1]"
                                    }`}
                            >
                                <span className="block font-display text-base">
                                    {currency} {preset.value.toLocaleString()}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <button
                    type="button"
                    onClick={selectCustom}
                    className={`mt-2 flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all duration-200 ${isCustom
                        ? "border-emerald-300 bg-emerald-300/20"
                        : "border-white/15 bg-white/[0.06] hover:border-emerald-300/40 hover:bg-white/[0.1]"
                        }`}
                >
                    <span className="text-sm text-white/90">Other amount</span>
                    {isCustom && (
                        <span className="flex flex-1 items-center gap-1.5">
                            <span className="text-sm text-white/60">{currency}</span>
                            <input
                                autoFocus
                                type="number"
                                min="1"
                                inputMode="numeric"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                onClick={(e) => e.stopPropagation()}
                                placeholder="0"
                                className="w-full bg-transparent font-display text-base text-white placeholder:text-white/40 focus:outline-none"
                            />
                        </span>
                    )}
                </button>

                {errors.amount && <p className="mt-1.5 text-xs text-rose-300">{errors.amount}</p>}

                {activeImpact && (
                    <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-300/25 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
                        <Sparkles size={13} className="mt-0.5 shrink-0" />
                        <span>{activeImpact}</span>
                    </div>
                )}
            </fieldset>

            {/* Donor details */}
            <fieldset disabled={isSubmitting} className="mt-5 space-y-3 disabled:opacity-60">
                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200/90">
                        Full name
                    </label>
                    <input
                        type="text"
                        value={name}
                        disabled={anonymous}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Wanjiru"
                        className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/40 transition-colors focus:border-emerald-300/60 focus:outline-none disabled:opacity-40"
                    />
                    {errors.name && <p className="mt-1 text-xs text-rose-300">{errors.name}</p>}
                </div>

                <div>
                    <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-200/90">
                        Phone
                    </label>
                    <input
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="07--------"
                        className="mt-1.5 w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/40 transition-colors focus:border-emerald-300/60 focus:outline-none"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-rose-300">{errors.phone}</p>}
                </div>

                <label className="flex cursor-pointer items-center gap-2 text-xs text-white/80">
                    <input
                        type="checkbox"
                        checked={anonymous}
                        onChange={(e) => setAnonymous(e.target.checked)}
                        className="h-3.5 w-3.5 rounded border-white/30 bg-white/[0.06] accent-emerald-400"
                    />
                    Give anonymously
                </label>
            </fieldset>

            {errors.submit && <p className="mt-3 text-sm text-rose-300">{errors.submit}</p>}

            <button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-[#173018] transition-all duration-200 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? (
                    <>
                        <Loader2 size={16} className="animate-spin" />
                        Waiting for confirmation…
                    </>
                ) : (
                    <>
                        Give {currency} {amount ? amount.toLocaleString() : 0}
                        <ArrowRight size={16} />
                    </>
                )}
            </button>

            {isSubmitting && (
                <p className="mt-3 text-center text-xs leading-relaxed text-emerald-100/80">
                    Check {phone || "your phone"} — enter your M-PESA PIN to complete the gift.
                    This can take up to a minute.
                </p>
            )}

            <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-white/55">
                <ShieldCheck size={12} />
                Thank you for Supporting us.
            </div>
        </form>
    );
};

export default DonationForm;