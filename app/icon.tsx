import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, rgb(4, 10, 7) 0%, rgb(10, 34, 22) 50%, rgb(27, 94, 64) 100%)",
          color: "rgb(220, 252, 231)",
          fontSize: 30,
          fontWeight: 700,
          letterSpacing: "-0.08em",
          borderRadius: 16,
          border: "3px solid rgba(74, 222, 128, 0.45)",
        }}
      >
        M$
      </div>
    ),
    size,
  );
}
