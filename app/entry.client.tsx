import * as React from "react";
import { hydrateRoot } from "react-dom/client";
import { RemixBrowser } from "@remix-run/react";

// @from: https://github.com/facebook/react/issues/24430#issuecomment-1156537554
document.querySelectorAll("html > script, html > input").forEach((s) => {
  s.parentNode?.removeChild(s);
});

hydrateRoot(document!, <RemixBrowser />, {
  // onRecoverableError: console.error.bind(null, "onRecoverableError"),
});
