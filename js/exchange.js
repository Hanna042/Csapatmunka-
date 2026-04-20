const rateSources = [
    {
        url: "https://api.frankfurter.app/latest?from=USD&to=HUF",
        getRate: (data) => Number(data?.rates?.HUF)
    },
    {
        url: "https://open.er-api.com/v6/latest/USD",
        getRate: (data) => Number(data?.rates?.HUF)
    }
];

export async function getUsdToHufRate() {
    for (const source of rateSources) {
        try {
            const response = await fetch(source.url);
            if (!response.ok) {
                continue;
            }

            const data = await response.json();
            const rate = source.getRate(data);

            if (Number.isFinite(rate) && rate > 0) {
                return rate;
            }
        } catch {
            continue;
        }
    }

    return null;
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

export function formatUsd(usdValue) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(Number(usdValue) || 0);
}