import { ImageResponse } from "next/og";
import fs from "node:fs";
import path from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
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
          alignItems: "center",
          justifyContent: "center",
          background: "#134033",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={elephantSrc} width={128} height={76} alt="" />
      </div>
    ),
    { ...size }
  );
}
