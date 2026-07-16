"use client";

import { useEffect, useState } from "react";

export default function NavBar() {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const onScroll = () => setPinned(window.scrollY > 8);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav${pinned ? " pinned" : ""}`}>
      <div className="nav-inner">
        <div className="brand">
          薇閣國中第一次段考成績分析 <em>Index by 學姐</em>
        </div>
        <nav className="nav-links">
          <a href="#overview">Overview</a>
          <a href="#grades">By Grade</a>
          <a href="#distribution">Distribution</a>
          <a
            href="https://lin.ee/6w1to8e"
            target="_blank"
            rel="noopener"
            style={{ color: "var(--accent)", textDecorationColor: "var(--accent)" }}
          >
            薇閣學姐補習班 ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
