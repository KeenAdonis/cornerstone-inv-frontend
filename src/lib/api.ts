const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN;

if (!API_BASE_URL) {
    throw new Error(
        "NEXT_PUBLIC_API_URL is not configured."
    );
}

if (!API_ORIGIN) {
    throw new Error(
        "NEXT_PUBLIC_API_ORIGIN is not configured."
    );
}

export {
    API_BASE_URL,
    API_ORIGIN,
};