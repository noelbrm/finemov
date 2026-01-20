export async function fetchAll(url) {
    try {
        const encodedUrl = encodeURIComponent(url);

        const res = await fetch(
            `/.netlify/functions/fetch-data?url=${encodedUrl}`
        );

        if (!res.ok) {
            throw new Error("Fetch failed");
        }

        return await res.json();
    } catch (err) {
        console.error(err);
    }
}