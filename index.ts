import type { Server } from "bun";

const port = 9988;
const CHUNK_SIZE = 1024 * 1024 * 5;
const MAX_FILE_SIZE = 1024 * 1024 * 1024 * 2;

class Handler {
	public static readonly fetch = async (req: Request, server: Server) => {
		const reqMethod = req.method;
		const url = new URL(req.url);
		const route = url.pathname;

		// Handle CORS preflight request
		if (reqMethod === "OPTIONS") {
			return new Response(null, {
				headers: {
					"Access-Control-Allow-Origin": "*",
					"Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
					"Access-Control-Allow-Headers": "Content-Type",
					"Access-Control-Max-Age": "86400",
				},
			});
		}

		console.log(
			`\u001B[0;31m ${reqMethod} \u001B[0;35m ${route} \u001B[0;37m from \u001B[0;34m ${server.requestIP(req)?.address}`,
		);

		switch (reqMethod) {
			case "PUT": {
				const attachedFile = await req.blob();
				const fileName = route.split("/").pop();
				const baseUrl = url.origin;

				if (attachedFile.size > MAX_FILE_SIZE) {
					return new Response("File size limit exceeded", { status: 400 });
				}

				const current_ts = Date.now();
				const finalFileName = `uploads/${current_ts}_${fileName}`;
				await Bun.write(finalFileName, attachedFile);

				return new Response(`wget ${baseUrl}/${current_ts}_${fileName} -O ${fileName}`);
			}

			case "GET": {
				const file = route.split("/").pop();
				const baseUrl = url.origin;

				if (!file) {
					return new Response(`Upload a file using curl\ncurl -T file.txt ${baseUrl}`);
				}

				const fileData = Bun.file("uploads/" + file);
				const fileSize = fileData.size;
				const rangeHeader = req.headers.get("Range");

				if (!rangeHeader) {
					return new Response(fileData.stream(), {
						headers: {
							"Accept-Ranges": "bytes",
							"Content-Length": fileSize.toString(),
							"Content-Type": fileData.type,
							"Cache-Control": "public, max-age=31536000",
						},
					});
				}

				const [start, end] = rangeHeader.replace("bytes=", "").split("-").map(Number);

				const chunkEnd = end || Math.min(start + CHUNK_SIZE, fileSize - 1);

				if (start >= fileSize || chunkEnd >= fileSize || start > chunkEnd) {
					return new Response("Range Not Satisfiable", { status: 416 });
				}

				const chunk = fileData.slice(start, chunkEnd + 1);
				return new Response(chunk, {
					status: 206,
					headers: {
						"Content-Range": `bytes ${start}-${chunkEnd}/${fileSize}`,
						"Accept-Ranges": "bytes",
						"Content-Length": (chunkEnd - start + 1).toString(),
						"Content-Type": fileData.type,
						"Cache-Control": "public, max-age=31536000",
					},
				});
			}

			default: {
				return new Response("Hello, Bun!", {
					headers: {
						"Content-Type": "text/plain",
						"Cache-Control": "public, max-age=31536000",
						"Access-Control-Allow-Origin": "*",
						"Access-Control-Allow-Methods": "GET, PUT, OPTIONS",
						"Access-Control-Allow-Headers": "Content-Type",
					},
				});
			}
		}
	};

	public static readonly error = (e: Error) => {
		const errorMap: Record<string, [string, number]> = {
			"No such file or directory": ["File not found", 404],
			"File must be regular or FIFO": ["Invalid Request", 400],
		};

		const [message, status] = errorMap[e.message] || ["Internal Server Error", 500];
		return new Response(message, { status });
	};
}

const server = Bun.serve({
	fetch: Handler.fetch,
	error: Handler.error,
	maxRequestBodySize: MAX_FILE_SIZE,
	idleTimeout: 255,
	port,
	hostname: "0.0.0.0",
});

console.log(`\u001B[0;32m Running on \u001B[0;37m ${server.url.origin}`);
