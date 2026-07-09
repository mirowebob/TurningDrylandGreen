import { useEffect, useState } from "react";
import { X } from "lucide-react";
import DonationForm from "./DonationForm";
import { initiateStkPush, pollTransactionStatus } from "../../utils/donationApi";
import { toBuniPhoneFormat } from "../../utils/toBuniPhoneFormat.ts";

interface DonationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DonationModal = ({ isOpen, onClose }: DonationModalProps) => {
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (event: KeyboardEvent) => {
            // Block Escape while a payment is mid-flight so the customer
            // doesn't dismiss the modal while waiting on their PIN prompt.
            if (event.key === "Escape" && !isProcessing) onClose();
        };
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", onKeyDown);
        return () => {
            document.body.style.overflow = "";
            window.removeEventListener("keydown", onKeyDown);
        };
    }, [isOpen, onClose, isProcessing]);

    if (!isOpen) return null;

    const handleClose = () => {
        if (isProcessing) return; // same guard for the X button / backdrop
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#071108]/80 px-3 py-4 backdrop-blur-md sm:px-6 sm:py-8"
            onClick={handleClose}
        >
            <div
                className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,#173018_0%,#27471b_60%,#102311_100%)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] sm:p-8"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/10 p-2 text-white/80 transition-all hover:border-sage/40 hover:bg-white/15 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Close donation form"
                >
                    <X size={18} />
                </button>

                <DonationForm
                    showWrapper={false}
                    className="mx-auto w-full"
                    onStatusChange={setIsProcessing}
                    onSubmit={async ({ amount, name, phone, anonymous }) => {
                        const formattedPhone = toBuniPhoneFormat(phone);
                        if (!formattedPhone) {
                            throw new Error("Enter a valid Kenyan phone number (e.g. 0712345678)");
                        }

                        const invoiceNumber = `DON-${Date.now()}`;

                        const pushResult = await initiateStkPush({
                            phoneNumber: formattedPhone,
                            amount,
                            invoiceNumber,
                            description: anonymous ? "Anonymous donation" : `Donation from ${name}`,
                        });

                        if (pushResult.response?.ResponseCode !== "0") {
                            throw new Error(pushResult.response?.ResponseDescription || "Could not start payment");
                        }

                        const finalStatus = await pollTransactionStatus(invoiceNumber);

                        if (finalStatus.status === "FAILED") {
                            throw new Error(finalStatus.resultDescription || "Payment was not completed");
                        }

                        // (optional) POST message/anonymous flag to your own /api/donations
                        // endpoint here if you want to store donor notes separately from
                        // the payment transaction record.
                    }}
                />
            </div>
        </div>
    );
};

export default DonationModal;