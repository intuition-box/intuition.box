import React from "react";
import { useColorMode } from "@docusaurus/theme-common";
import "./CustomThemeToggle.css";

export default function CustomThemeToggle() {
  const { colorMode, setColorMode } = useColorMode();

  const checked = colorMode === "light";

  const handleChange = () => {
    setColorMode(checked ? "dark" : "light");
  };

  return (
    <div className="toggle-container">
      <div className="toggle-wrap">
        <input
          className="toggle-input"
          id="holo-toggle"
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          aria-label="Toggle theme"
        />
        <label className="toggle-track" htmlFor="holo-toggle">
          <div className="track-lines">
            <div className="track-line"></div>
          </div>
          <div className="toggle-thumb">
            <div className="thumb-core"></div>
            <div className="thumb-inner"></div>
            <div className="thumb-scan"></div>
            <div className="thumb-particles">
              <div className="thumb-particle"></div>
              <div className="thumb-particle"></div>
              <div className="thumb-particle"></div>
              <div className="thumb-particle"></div>
              <div className="thumb-particle"></div>
            </div>
          </div>
          <div className="toggle-data">
            <div className="data-text off">OFF</div>
            <div className="data-text on">ON</div>
            <div className="status-indicator off"></div>
            <div className="status-indicator on"></div>
          </div>
          <div className="energy-rings">
            <div className="energy-ring"></div>
            <div className="energy-ring"></div>
            <div className="energy-ring"></div>
          </div>
          <div className="interface-lines">
            <div className="interface-line"></div>
            <div className="interface-line"></div>
            <div className="interface-line"></div>
            <div className="interface-line"></div>
            <div className="interface-line"></div>
            <div className="interface-line"></div>
          </div>
          <div className="toggle-reflection"></div>
          <div className="holo-glow"></div>
        </label>
      </div>
    </div>
  );
}
