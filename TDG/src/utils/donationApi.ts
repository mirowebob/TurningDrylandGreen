
const API_BASE = import.meta.env.TDG_API_BASE_URL ?? "http://localhost:8082";

export interface StkPushResult {
    response?: {
        MerchantRequestID: string;
        CheckoutRequestID: string;
        ResponseCode: string;
        ResponseDescription: string;
        CustomerMessage: string;
    };
}

export interface TransactionStatus {
    invoiceNumber: string;
    checkoutRequestId: string;
    status: "PENDING" | "SUCCESS" | "FAILED";
    receiptNumber?: string;
    resultDescription?: string;
}

export async function initiateStkPush(params: {
    phoneNumber: string;
    amount: number;
    invoiceNumber: string;
    description: string;
}): Promise<StkPushResult> {
    const res = await fetch(`${API_BASE}/api/payments/stk-push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    });

    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || body.details || "Failed to start payment");
    }
    return res.json();
}

export async function getTransactionStatus(invoiceNumber: string): Promise<TransactionStatus | null> {
    const res = await fetch(`${API_BASE}/api/payments/status/${invoiceNumber}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error("Failed to check payment status");
    return res.json();
}

/**
 * Polls the status endpoint until SUCCESS/FAILED or timeout.
 * The STK push response only means "prompt was sent" — the real
 * result comes later via KCB's IPN callback hitting your backend,
 * which is why polling (or a websocket) is necessary here.
 */
export async function pollTransactionStatus(
    invoiceNumber: string,
    { intervalMs = 3000, timeoutMs = 90000 } = {}
): Promise<TransactionStatus> {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        const status = await getTransactionStatus(invoiceNumber);
        if (status && status.status !== "PENDING") return status;
        await new Promise((r) => setTimeout(r, intervalMs));
    }
    throw new Error("Payment confirmation timed out. Check your phone or try again.");
}