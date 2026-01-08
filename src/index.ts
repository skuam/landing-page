// @ts-ignore
import html from "./index.html";
// @ts-ignore
import brushStroke from "./brush_stroke.jpg";

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (request.method === "GET") {
			if (url.pathname === "/") {
				return new Response(html, {
					headers: {
						"content-type": "text/html",
					},
				});
			}
			if (url.pathname === "/brush_stroke.jpg") {
				return new Response(brushStroke, {
					headers: {
						"content-type": "image/jpeg",
					},
				});
			}
		}

		if (request.method === "POST" && url.pathname === "/api/waitlist") {
			try {
				const { email } = await request.json() as { email: string };
                if (!email) {
                    return new Response("Email required", { status: 400 });
                }
				const stmt = env.DB.prepare("INSERT INTO waitlist (email) VALUES (?)");
				await stmt.bind(email).run();
				return new Response("Joined", { status: 200 });
			} catch (e: any) {
                console.error(e);
                if (e.message && e.message.includes("UNIQUE constraint failed")) {
                    return new Response("Email already exists", { status: 409 });
                }
				return new Response("Error", { status: 500 });
			}
		}

		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;