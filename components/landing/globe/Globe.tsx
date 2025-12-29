"use client";

import * as THREE from "three";
import { useEffect, useRef } from "react";

interface GlobeInstance {
  renderer: THREE.WebGLRenderer;
}

// 🔥 SADECE TEK SEFER INIT İÇİN FLAG
let globeInstance: GlobeInstance | null = null;

export default function Globe() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // ★ Eğer globe daha önce oluşturulduysa tekrar oluşturma
    if (globeInstance) {
      mountRef.current.appendChild(globeInstance.renderer.domElement);
      return;
    }

    // ▼ İlk defa oluşturuluyor
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

    // ★ İlk Globe oluşturuldu → kaydediyoruz
    globeInstance = { renderer };

    return () => {
      // Unmount sırasında DOM’u temizle ama instance kalacak
      try {
        mountRef.current?.removeChild(renderer.domElement);
      } catch {}
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
