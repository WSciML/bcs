import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "./site";

export const alt = site.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const svg = await readFile(join(process.cwd(), "app/icon.svg"), "utf8");
  const spiral = Buffer.from(svg.replace(/<rect[^>]*\/>/, "")).toString("base64");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          padding: 72,
          backgroundColor: "#050608",
          backgroundImage: "radial-gradient(circle at 78% 50%, rgba(134,211,214,0.16), rgba(134,211,214,0.04) 30%, rgba(134,211,214,0) 50%)",
          color: "#e9ebee",
        }}
      >
        <img
          src={`data:image/svg+xml;base64,${spiral}`}
          width={440}
          height={440}
          style={{ position: "absolute", right: 60, top: 95 }}
        />
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ fontSize: 22, letterSpacing: "0.16em", color: "#8d929b" }}>
            BOULDER COMPUTATIONAL SOLUTIONS
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontSize: 104,
                lineHeight: 1,
                letterSpacing: "-0.04em",
                backgroundImage: "linear-gradient(180deg, #ffffff 20%, #a9aeb6 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              <span>We change</span>
              <span>the equation.</span>
            </div>
            <div style={{ marginTop: 32, maxWidth: 620, fontSize: 30, lineHeight: 1.4, color: "#8d929b" }}>
              We recover the equations hidden in noisy data, and the parameters that drive them.
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
