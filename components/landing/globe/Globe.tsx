"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";

let globeInstance: any = null;

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    if (globeInstance) {
      mountRef.current.appendChild(globeInstance.renderer.domElement);
      return;
    }

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      40,
      1, // 1:1 aspect ratio (kare)
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

    const textureLoader = new THREE.TextureLoader();
    const dotMap = textureLoader.load("/textures/dots5.png", (texture) => {
      texture.offset.y = -0.16;
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

    globeInstance = { renderer, camera };

    // Responsive resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      renderer.setSize(width, height);
        };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      try {
        mountRef.current?.removeChild(renderer.domElement);
      } catch {}
    };
  }, []);

  return (
    <div className="relative w-[480px] lg:w-[540px] xl:w-[600px] 2xl:w-[680px] h-[480px] lg:h-[540px] xl:h-[600px] 2xl:h-[680px] mx-auto">
      <div
        ref={mountRef}
        className="w-full h-full pointer-events-none select-none"
      />
    </div>
  );
}