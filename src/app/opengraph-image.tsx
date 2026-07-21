import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  const elephant = fs.readFileSync(
    path.join(process.cwd(), "src/assets/brand/elephant-mark.png")
  );
  const elephantSrc = `data:image/png;base64,${elephant.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#134033",
          backgroundImage:
            "radial-gradient(circle at 78% 30%, rgba(192,242,82,0.18) 0%, rgba(192,242,82,0) 55%)",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 44 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={elephantSrc} width={210} height={124} alt="" />
          <div
            style={{
              fontSize: 128,
              fontWeight: 800,
              color: "#C0F252",
              letterSpacing: -2,
              lineHeight: 1,
              display: "flex",
            }}
          >
            kokoland
          </div>
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            fontWeight: 500,
            color: "#F9F1E4",
            letterSpacing: 1,
            display: "flex",
          }}
        >
          Kerala flavors, Berlin home
        </div>
        <div
          style={{
            marginTop: 36,
            width: 140,
            height: 6,
            borderRadius: 3,
            background: "#F21B07",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
