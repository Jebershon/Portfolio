import { useEffect, useRef } from "react";
import type { createForgeScene } from "../three/forge-scene";

type Scene = ReturnType<typeof createForgeScene>;

/**
 * The fixed full-screen canvas behind the page. The Three.js scene is imported
 * lazily so `three` loads after the content has painted — the 3D is an
 * enhancement, never a blocker. `paletteKey` changes tell it to re-read the theme.
 */
export default function ForgeCanvas({ paletteKey }: { paletteKey: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    let alive = true;
    import("../three/forge-scene").then(({ createForgeScene }) => {
      if (!alive || !canvasRef.current) return;
      sceneRef.current = createForgeScene(canvasRef.current);
    });
    return () => {
      alive = false;
      sceneRef.current?.dispose();
    };
  }, []);

  // A new paletteKey means the theme changed; re-read the palette (skip the first run).
  const firstRun = useRef(true);
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    sceneRef.current?.refreshPalette();
  }, [paletteKey]);

  return <canvas id="bg" ref={canvasRef} aria-hidden="true" />;
}
