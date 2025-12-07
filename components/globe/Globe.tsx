"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // 🌐 TEXTURE
    const textureLoader = new THREE.TextureLoader();
    const dotMap = textureLoader.load("/textures/dots5.png", (texture) => {
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      // 🔥 LOGO'YU KÜREDE YUKARI KAYDIR
      texture.offset.y = -0.16; // 0 → default, -0.18 yukarı taşır
      texture.needsUpdate = true;
    });

    const material = new THREE.MeshBasicMaterial({
      map: dotMap,
      transparent: true,
    });

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    const animate = () => {
      sphere.rotation.y += 0.005;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="relative w-[500px] h-[500px] mx-auto">
      <div
        ref={mountRef}
        className="w-full h-full pointer-events-none select-none"
      />
    </div>
  );
}
