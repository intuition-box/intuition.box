import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./Galaxy.module.css";
import { useColorMode } from "@docusaurus/theme-common";

type Props = { title?: string };

const GalaxyBackground: React.FC<Props> = ({ title = "FABLAB.BOX" }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number | null>(null);
  const { colorMode } = useColorMode();

  useEffect(() => {
    const container = hostRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 0);
    camera.up.set(0, 0, -1);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const starGroup = new THREE.Group();
    scene.add(starGroup);

    const starCount = 4000;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const colorInside =
      colorMode === "light" ? new THREE.Color(0x181822) : new THREE.Color(0xffffff);
    const colorOutside =
      colorMode === "light" ? new THREE.Color(0x0a0a19) : new THREE.Color(0x8a9cff);

    const branchCount = 5;
    const maxRadius = 8;

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * maxRadius;
      const branch = i % branchCount;
      const baseAngle = (branch / branchCount) * Math.PI * 2;
      const spinAngle = radius * 0.5;
      const randomOffset = (Math.random() - 0.5) * 0.4;
      const angle = baseAngle + spinAngle + randomOffset;

      starPositions[i3] = Math.sin(angle) * radius + (Math.random() - 0.5);
      starPositions[i3 + 1] = (Math.random() - 0.5) * 0.5;
      starPositions[i3 + 2] = Math.cos(angle) * radius + (Math.random() - 0.5);

      const mixed = colorInside.clone();
      mixed.lerp(colorOutside, radius / maxRadius);
      starColors[i3] = mixed.r;
      starColors[i3 + 1] = mixed.g;
      starColors[i3 + 2] = mixed.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: colorMode === "light" ? 0.07 : 0.05,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: colorMode === "light" ? 0.9 : 1.0,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    starGroup.add(starField);

    const animate = () => {
      rafId.current = requestAnimationFrame(animate);
      starGroup.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
      container.removeChild(renderer.domElement);
      starGeometry.dispose();
      starMaterial.dispose();
      renderer.dispose();
    };
  }, [colorMode]);

  return (
    <>
      <div
        ref={hostRef}
        style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}
      />
      <div className={styles.centralCircle}>
        <h2>{title}</h2>
      </div>
    </>
  );
};

export default GalaxyBackground;
