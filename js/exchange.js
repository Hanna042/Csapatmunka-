export async function getUsdToHufRate() {
    try {
        const response = await fetch("https://api.exchangeratesapi.io/v1/latest?access_key=a509ae55964969eb605bde70e09d8d81");
        if (!response.ok) return null;

        const data = await response.json();
        const rate = Number(data?.rates?.HUF);
        return Number.isFinite(rate) && rate > 0 ? rate : null;
    } catch {
        return null;
    }
}

export function usdToHuf(usdValue, usdHufRate) {
    if (!Number.isFinite(usdHufRate) || usdHufRate <= 0) {
        return null;
    }

    return (Number(usdValue) || 0) * usdHufRate;
}

export function formatHuf(hufValue) {
    return new Intl.NumberFormat("hu-HU", {
        style: "currency",
        currency: "HUF",
        maximumFractionDigits: 0
    }).format(Math.round(hufValue));
}