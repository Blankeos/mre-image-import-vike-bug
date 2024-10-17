import { privateConfig } from "@/config.private";

import { Hono } from "hono";

import { serveStatic } from "hono/bun";
import { renderPage } from "vike/server";
import { appRouter } from "./server/_app";

import { connectToWeb } from "./server/connect-to-web.util";

const app = new Hono();

// Health checks
app.get("/up", async (c) => {
  return c.newResponse("🟢 UP", { status: 200 });
});

// For the Backend APIs
app.route("/api/*", appRouter);

// Vite Middleware
if (privateConfig.NODE_ENV !== "production") {
  console.log("Server running in development mode...");

  // We instantiate Vite's development server and integrate its middleware to our server.
  // ⚠️ We instantiate it only in development. (It isn't needed in production and it
  // would unnecessarily bloat our production server.)
  const vite = await import("vite");
  const viteDevServer = await vite.createServer({
    server: { middlewareMode: true },
    appType: "custom",
    base: "/",
  });

  app.use(async (c, next) => {
    const handler = connectToWeb(viteDevServer.middlewares);

    const response = await handler(c.req.raw);

    if (response) {
      return response;
    }

    // If not handled by Vike, continue to next middleware
    await next();
  });
} else {
  console.log("Server running in production mode...");
  app.use("*", serveStatic({ root: "./dist/client/" }));
}

// For the Frontend + SSR
app.get("*", async (c, next) => {
  const pageContextInit = {
    urlOriginal: c.req.url,
    request: c.req,
    response: c.res,
  };
  const pageContext = await renderPage(pageContextInit);
  const { httpResponse } = pageContext;
  if (!httpResponse) {
    return next();
  } else {
    const { body, statusCode, headers } = httpResponse;
    headers.forEach(([name, value]) => c.header(name, value));
    c.status(statusCode);

    return c.body(body);
  }
});

// Returning errors.
app.onError((_, c) => {
  return c.json(
    {
      error: {
        message: c.error?.message ?? "Something went wrong.",
      },
    },
    500
  );
});

console.log("Running at http://localhost:" + privateConfig.PORT);

const server = Bun.serve({
  fetch: app.fetch,
  port: privateConfig.PORT,
});
