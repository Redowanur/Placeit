import type { CSSProperties } from "react";
import { hueFor, initials } from "@/lib/format";

export function Avatar({ name, size = 40 }: { name: string; size?: number }) {
  const style = { "--h": hueFor(name), width: size, height: size, fontSize: size * 0.38 } as CSSProperties;
  return (
    <span className="avatar" style={style} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
