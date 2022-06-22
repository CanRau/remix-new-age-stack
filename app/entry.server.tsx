import type {
  DataFunctionArgs,
  EntryContext,
  HandleDataRequestFunction,
} from "@remix-run/deno/index.ts";
import { RemixServer } from "@remix-run/react";
import * as React from "react";
import { renderToReadableStream } from "react-dom/server";

const ABORT_DELAY = 5000;

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const controller = new AbortController();
  let didError = false;
  try {
    const stream = await renderToReadableStream(
      <RemixServer context={remixContext} url={request.url} />,
      {
        signal: controller.signal,
        onError(error) {
          didError = true;
          console.error(error);
        },
      },
    );

    // This is to wait for all Suspense boundaries to be ready. You can uncomment
    // this line if you want to buffer the entire HTML instead of streaming it.
    // You can use this for crawlers or static generation:

    // await stream.allReady;

    responseHeaders.set("Content-Type", "text/html");

    responseHeaders.set(
      "x-fly-region",
      Deno.env.get("FLY_REGION") ?? "unknown",
    );
    // responseHeaders.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);

    return new Response(stream, {
      status: didError ? 500 : responseStatusCode,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(
      "<!doctype html><h1>Error</h1>",
      {
        status: 500,
        headers: responseHeaders,
      },
    );
  }
}

export const handleDataRequest: HandleDataRequestFunction = (
  response: Response,
  _args: DataFunctionArgs, // same args that get passed to the action or loader that was called
) => {
  response.headers.set("x-fly-region", Deno.env.get("FLY_REGION") ?? "unknown");
  // response.headers.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);
  return response;
};
