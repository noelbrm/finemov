export async function handler(event) {
    try {
        const { url } = event.queryStringParameters;

        if (!url) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Missing url parameter" }),
            };
        }

        const parsedUrl = new URL(url);
        const isAllowedHost = parsedUrl.hostname === "api.themoviedb.org";
        const isAllowedPath = parsedUrl.pathname.startsWith("/3/");

        if (!isAllowedHost || !isAllowedPath) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Unsupported API URL" }),
            };
        }

        const res = await fetch(parsedUrl.toString(), {
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${process.env.API_KEY}`,
            },
        });

        if (!res.ok) {
            throw new Error(`Fetch failed with status ${res.status}`);
        }

        const data = await res.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
            headers: {
                "content-type": "application/json",
            },
        };
    } catch (error) {
        console.error(error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
}
