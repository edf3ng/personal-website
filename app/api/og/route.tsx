import { ImageResponse } from "next/og";

import { site } from "@/lib/site";

const ACCENTS: Record<string, string> = {
  pink: "#ff2d95",
  cyan: "#00e5ff",
  amber: "#ffd400",
  green: "#39ff14",
  violet: "#b06bff",
};

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? site.title).slice(0, 110);
  const eyebrow = (searchParams.get("eyebrow") ?? "Arcade").slice(0, 32);
  const accent = ACCENTS[searchParams.get("accent") ?? "pink"] ?? ACCENTS.pink;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background: "#04040a",
          backgroundImage: `radial-gradient(700px 420px at 50% -8%, ${accent}33, transparent 70%), radial-gradient(600px 380px at 110% 110%, #00e5ff22, transparent 70%)`,
          fontFamily: "monospace",
          color: "#d8fff0",
        }}
      >
        {/* Scanline band across the whole card. */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "repeating-linear-gradient(to bottom, rgba(0,0,0,0.26) 0px, rgba(0,0,0,0.26) 2px, transparent 2px, transparent 5px)",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 18,
              height: 18,
              background: accent,
              boxShadow: `0 0 28px ${accent}`,
            }}
          />
          <div
            style={{
              fontSize: 26,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: accent,
            }}
          >
            {eyebrow}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: title.length > 52 ? 58 : 74,
            lineHeight: 1.22,
            fontWeight: 700,
            letterSpacing: -1,
            maxWidth: 980,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 26,
            letterSpacing: 4,
            color: "#7fa89c",
          }}
        >
          <div style={{ display: "flex" }}>{site.name}</div>
          <div style={{ display: "flex", color: accent }}>
            {site.url.replace(/^https?:\/\//, "")}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
