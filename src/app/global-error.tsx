"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#06090d",
          color: "#e8eef4",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          padding: 16,
        }}
      >
        <div
          style={{
            maxWidth: 480,
            width: "100%",
            border: "1px solid #1d2733",
            background: "#070b10",
            padding: "24px 28px",
          }}
        >
          <p style={{ margin: 0, color: "#ffb454", fontSize: 14 }}>
            ERR: fatal fault in the root layout.
          </p>
          <p style={{ marginTop: 10, color: "#94a5b7", fontSize: 13 }}>
            {error.message || "no detail logged"}
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: 20,
              padding: "10px 16px",
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#06090d",
              background: "#c6f05a",
              border: "1px solid #c6f05a",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            ./retry
          </button>
        </div>
      </body>
    </html>
  );
}
