import { useEffect } from "react";
import { X } from "lucide-react";
import DonationForm from "./DonationForm";

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);

        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071108]/80 px-3 py-4 backdrop-blur-md sm:px-6 sm:py-8">
            <div className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#173018_0%,#27471b_60%,#102311_100%)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-8">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/10 p-2 text-white/80 transition-all hover:border-sage/40 hover:bg-white/15 hover:text-white"
                    aria-label="Close donation form"
                >
                    <X size={18} />
                </button>

                <DonationForm showWrapper={false} className="mx-auto w-full" />
            </div>
        </div>
    );
};

export default DonationModal;
