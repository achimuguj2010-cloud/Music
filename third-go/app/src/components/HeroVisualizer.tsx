import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create particle grid
    const gridSize = 80;
    const spacing = 0.6;
    const count = gridSize * gridSize;
    const positions = new Float32Array(count * 3);

    let idx = 0;
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        positions[idx++] = (i - gridSize / 2) * spacing;
        positions[idx++] = (j - gridSize / 2) * spacing;
        positions[idx++] = 0;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: '#F59E0B',
      size: 0.15,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      time += 0.01;
      const posArray = geometry.attributes.position.array as Float32Array;

      idx = 0;
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          const x = (i - gridSize / 2) * spacing;
          const y = (j - gridSize / 2) * spacing;

          const distFromCenter = Math.sqrt(x * x + y * y);
          let z = Math.sin(distFromCenter * 0.05 + time) * 2;

          // Mouse repulsion
          const mouseX = mouseRef.current.x * 20;
          const mouseY = mouseRef.current.y * 20;
          const dx = x - mouseX;
          const dy = y - mouseY;
          const mouseDist = Math.sqrt(dx * dx + dy * dy);
          const radius = 8;

          if (mouseDist < radius) {
            const force = (1 - mouseDist / radius) * 3;
            const angle = Math.atan2(dy, dx);
            posArray[idx] = x + Math.cos(angle) * force;
            posArray[idx + 1] = y + Math.sin(angle) * force;
          } else {
            posArray[idx] = x;
            posArray[idx + 1] = y;
          }

          posArray[idx + 2] = z;
          idx += 3;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      frameRef.current = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameRef.current);
      container.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '300px',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1025 0%, #0B0B10 50%, #1a1510 100%)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{
            background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 40px rgba(245, 158, 11, 0.3)',
          }}
        >
          Discover Independent Artists
        </h2>
        <p className="mt-2 text-sm" style={{ color: '#9CA3AF' }}>
          Over 500,000 free tracks from creators worldwide
        </p>
      </div>
    </div>
  );
}
