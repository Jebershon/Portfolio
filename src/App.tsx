import { useCallback, useState } from "react";
import ForgeCanvas from "./components/ForgeCanvas";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Work from "./components/Work";
import Path from "./components/Path";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import { useTheme } from "./hooks/useTheme";
import { useReveal } from "./hooks/useReveal";

export default function App() {
  // Bumping paletteKey tells the canvas to re-read the CSS palette after a theme change.
  const [paletteKey, setPaletteKey] = useState("init");
  const onPaletteChange = useCallback(() => setPaletteKey(String(performance.now())), []);
  const { choice, setChoice } = useTheme(onPaletteChange);

  useReveal();

  return (
    <>
      <ForgeCanvas paletteKey={paletteKey} />
      <div className="shell">
        <Nav theme={choice} onTheme={setChoice} />
        <Hero />
        <Work />
        <Path />
        <Contact />
        <Footer />
      </div>
    </>
  );
}
