import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? site.title).slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "Night desk").slice(0, 32);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#1a2230",
          fontFamily: "Georgia, serif",
          color: "#f3e6d0",
        }}
      >
        <div
          style={{
            height: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            background: "#2a323f",
            fontSize: 20,
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex" }}>{site.name}</div>
          <div style={{ display: "flex" }}>{eyebrow}</div>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
            background: "linear-gradient(180deg, #1a2230 0%, #0c1018 100%)",
          }}
        >
          <div
            style={{
              width: 900,
              display: "flex",
              flexDirection: "column",
              background: "#f3e6d0",
              color: "#2a2118",
              border: "8px solid #3d342e",
              padding: "48px 56px",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 22,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: "#7a6453",
                fontFamily: "sans-serif",
                marginBottom: 16,
              }}
            >
              {eyebrow}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: title.length > 48 ? 52 : 64,
                lineHeight: 1.15,
                fontWeight: 600,
              }}
            >
              {title}
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
