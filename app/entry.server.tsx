import type {
  DataFunctionArgs,
  EntryContext,
  HandleDataRequestFunction,
} from "@remix-run/deno/index.ts";
import { RemixServer } from "@remix-run/react";
import * as React from "react";
import { renderToString } from "react-dom/server";

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />,
  );

  responseHeaders.set("Content-Type", "text/html");

  responseHeaders.set("x-fly-region", Deno.env.get("FLY_REGION") ?? "unknown");
  // responseHeaders.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}

export const handleDataRequest: HandleDataRequestFunction = (
  response: Response,
  // same args that get passed to the action or loader that was called
  _args: DataFunctionArgs,
) => {
  response.headers.set("x-fly-region", Deno.env.get("FLY_REGION") ?? "unknown");
  // response.headers.set("Strict-Transport-Security", `max-age=${60 * 60 * 24 * 365 * 100}`);
  return response;
};
