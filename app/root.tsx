import * as React from "react";
import { type MetaFunction } from "@remix-run/deno/index.ts";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

export default function App() {
  return (
    <React.StrictMode>
      <html lang="en">
        <head>
          <Meta />
          <Links />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
          <LiveReload />
        </body>
      </html>
    </React.StrictMode>
  );
}

export function CatchBoundary() {
  const caught = useCatch();
  return (
    <React.StrictMode>
      <html>
        <head>
          <title>Oops!</title>
          <Meta />
          <Links />
        </head>
        <body>
          <h1>
            {caught.status} {caught.statusText}
          </h1>
          <Scripts />
        </body>
      </html>
    </React.StrictMode>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error("ErrorBoundary", error);
  return (
    <React.StrictMode>
      <html>
        <head>
          <title>Oh no!</title>
          <Meta />
          <Links />
        </head>
        <body>
          <h1>Root Error Boundary</h1>
          <Scripts />
        </body>
      </html>
    </React.StrictMode>
  );
}
