"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: "40px", textAlign: "center", fontFamily: "system-ui" }}>
          <h2>Something went wrong</h2>
          <p style={{ color: "#6b7280", marginTop: "8px" }}>
            We&apos;ve been notified and are looking into it.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "16px",
              padding: "10px 24px",
              background: "#15803d",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
