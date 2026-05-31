export async function fetchAll(url) {
    const encodedUrl = encodeURIComponent(url);

    const res = await fetch(
        `/.netlify/functions/fetch-data?url=${encodedUrl}`
    );

    if (!res.ok) {
        let message = "Fetch failed";

        try {
            const data = await res.json();
            message = data?.error || message;
        } catch {
            message = `${message} with status ${res.status}`;
        }

        throw new Error(message);
    }

    return await res.json();
}
