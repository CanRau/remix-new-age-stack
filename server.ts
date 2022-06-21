import {
  Application,
  type Context as OakContext,
  Router,
} from "https://deno.land/x/oak@v10.6.0/mod.ts";
import { createRequestHandlerWithStaticFiles } from "@remix-run/deno/server.ts";
// Import path interpreted by the Remix compiler
import * as build from "@remix-run/dev/server-build";

const remixHandler = createRequestHandlerWithStaticFiles({
  build,
  mode: Deno.env.get("NODE_ENV"),
  getLoadContext: () => ({}),
});

const app = new Application();
const router = new Router();

app.addEventListener(
  "error",
  (error) => console.error("CATHED ERROR", error, "END CATCHED ERROR"),
);

app.addEventListener(
  "listen",
  ({ hostname, port, secure }) =>
    console.log(`Listening on http://${hostname}:${port}`, { secure }),
);

app.use(router.routes());
app.use(router.allowedMethods());

app.use(wrapOakRequest(remixHandler));

const port = Number(Deno.env.get("PORT")) || 8000;
// @note: esbuild doesn't support top-level await at the moment [evanw/esbuild/#253](https://github.com/evanw/esbuild/issues/253)
app.listen({ port }).then(console.log).catch(console.error);

// @from: https://github.com/oakserver/oak/issues/533#issuecomment-1162372606
export function wrapOakRequest(
  fn: (request: Request) => Promise<Response>,
) {
  return async (ctx: OakContext) => {
    const req = new Request(ctx.request.url.toString(), {
      body: ctx.request.originalRequest.getBody().body,
      headers: ctx.request.headers,
      method: ctx.request.method,
    });

    const response = await fn(req);

    ctx.response.status = response.status;
    ctx.response.headers = response.headers;
    ctx.response.body = response.body;
  };
}
