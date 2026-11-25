import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useApp } from '../context/AppContext';

function detectSoftwareGl(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

function createGearMesh(
  outerRadius: number,
  innerRadius: number,
  teeth: number,
  thickness: number,
  material: THREE.Material,
  hubMaterial: THREE.Material,
): THREE.Group {
  const group = new THREE.Group();
  const shape = new THREE.Shape();
  const toothDepth = outerRadius * 0.16;
  const baseRadius = outerRadius - toothDepth;
  const step = (Math.PI * 2) / teeth;

  for (let i = 0; i < teeth; i++) {
    const a0 = i * step;
    const a1 = a0 + step * 0.22;
    const a2 = a0 + step * 0.32;
    const a3 = a0 + step * 0.62;
    const a4 = a0 + step * 0.72;

    if (i === 0) {
      shape.moveTo(Math.cos(a0) * baseRadius, Math.sin(a0) * baseRadius);
    } else {
      shape.lineTo(Math.cos(a0) * baseRadius, Math.sin(a0) * baseRadius);
    }
    shape.lineTo(Math.cos(a1) * baseRadius, Math.sin(a1) * baseRadius);
    shape.lineTo(Math.cos(a2) * outerRadius, Math.sin(a2) * outerRadius);
    shape.lineTo(Math.cos(a3) * outerRadius, Math.sin(a3) * outerRadius);
    shape.lineTo(Math.cos(a4) * baseRadius, Math.sin(a4) * baseRadius);
  }
  shape.closePath();

  const hole = new THREE.Path();
  hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const gearGeo = new THREE.ExtrudeGeometry(shape, {
    depth: thickness,
    bevelEnabled: true,
    bevelThickness: 0.025,
    bevelSize: 0.02,
    bevelSegments: 2,
  });
  gearGeo.center();

  const gearBody = new THREE.Mesh(gearGeo, material);
  gearBody.castShadow = true;
  gearBody.receiveShadow = true;

  const hubGeo = new THREE.CylinderGeometry(
    innerRadius * 1.15,
    innerRadius * 1.15,
    thickness * 1.45,
    24,
  );
  hubGeo.rotateX(Math.PI / 2);
  const hubMesh = new THREE.Mesh(hubGeo, hubMaterial);

  const rimGeo = new THREE.TorusGeometry(innerRadius * 1.45, 0.03, 12, 32);
  const rimMesh = new THREE.Mesh(rimGeo, hubMaterial);
  rimMesh.position.z = thickness * 0.55;

  group.add(gearBody, hubMesh, rimMesh);
  return group;
}

function createOpenBookGroup(
  coverMat: THREE.Material,
  pageMat: THREE.Material,
  accentMat: THREE.Material,
): THREE.Group {
  const book = new THREE.Group();

  const spineGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.35, 16);
  spineGeo.rotateX(Math.PI / 2);
  const spine = new THREE.Mesh(spineGeo, coverMat);

  const leftCoverGeo = new THREE.BoxGeometry(0.95, 0.06, 1.35);
  const leftCover = new THREE.Mesh(leftCoverGeo, coverMat);
  leftCover.position.set(-0.5, 0.08, 0);
  leftCover.rotation.z = -0.18;

  const rightCover = new THREE.Mesh(leftCoverGeo.clone(), coverMat);
  rightCover.position.set(0.5, 0.08, 0);
  rightCover.rotation.z = 0.18;

  const leftPageGeo = new THREE.BoxGeometry(0.86, 0.09, 1.24);
  const leftPages = new THREE.Mesh(leftPageGeo, pageMat);
  leftPages.position.set(-0.47, 0.14, 0);
  leftPages.rotation.z = -0.16;

  const rightPages = new THREE.Mesh(leftPageGeo.clone(), pageMat);
  rightPages.position.set(0.47, 0.14, 0);
  rightPages.rotation.z = 0.16;

  const bookmarkGeo = new THREE.BoxGeometry(0.07, 0.02, 0.9);
  const bookmark = new THREE.Mesh(bookmarkGeo, accentMat);
  bookmark.position.set(0.28, 0.21, 0.22);
  bookmark.rotation.z = 0.16;

  book.add(spine, leftCover, rightCover, leftPages, rightPages, bookmark);
  return book;
}

export const HeroEngineering3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useApp();
  const themeRef = useRef(theme);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const isSoftwareGl = detectSoftwareGl();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);

    renderer.setSize(width, height);
    renderer.setPixelRatio(
      isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2),
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.35, 6.4);
    camera.lookAt(0, 0.1, 0);

    // Warm key + cool Hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0x8dbbff, 0x111d36, 1.0);
    scene.add(hemiLight);

    const keyLight = new THREE.DirectionalLight(0xfff1dc, 2.1);
    keyLight.position.set(4.5, 6, 4.5);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xc4acff, 1.4);
    rimLight.position.set(-4.5, 2.5, -3.5);
    scene.add(rimLight);

    // Materials with distinct roughness/metalness contrast
    const metalBlueMat = new THREE.MeshStandardMaterial({
      color: 0x8dbbff,
      metalness: 0.78,
      roughness: 0.22,
    });
    const metalPurpleMat = new THREE.MeshStandardMaterial({
      color: 0xc4acff,
      metalness: 0.72,
      roughness: 0.28,
    });
    const darkAnodizedMat = new THREE.MeshStandardMaterial({
      color: 0x1b2d52,
      metalness: 0.6,
      roughness: 0.42,
    });
    const bookCoverMat = new THREE.MeshStandardMaterial({
      color: 0x1d3561,
      metalness: 0.2,
      roughness: 0.58,
    });
    const pageMat = new THREE.MeshStandardMaterial({
      color: 0xeaf1ff,
      metalness: 0.04,
      roughness: 0.85,
    });
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x8dbbff,
      wireframe: true,
      transparent: true,
      opacity: 0.45,
    });
    const coreGlowMat = new THREE.MeshStandardMaterial({
      color: 0x8dbbff,
      emissive: 0x4f7dff,
      emissiveIntensity: 0.7,
      metalness: 0.3,
      roughness: 0.2,
    });

    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // 1. Central Atomic / Gyroscope Engineering Core (3-part composite)
    const gyroGroup = new THREE.Group();
    const coreSphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.42, 1),
      coreGlowMat,
    );
    const coreWire = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.68, 0),
      wireMat,
    );
    const ring1 = new THREE.Mesh(
      new THREE.TorusGeometry(1.18, 0.032, 16, 64),
      metalBlueMat,
    );
    ring1.rotation.x = Math.PI / 3;

    const ring2 = new THREE.Mesh(
      new THREE.TorusGeometry(1.42, 0.026, 16, 64),
      metalPurpleMat,
    );
    ring2.rotation.y = Math.PI / 3;
    ring2.rotation.x = -Math.PI / 5;

    const ring3 = new THREE.Mesh(
      new THREE.TorusGeometry(1.66, 0.02, 16, 64),
      darkAnodizedMat,
    );
    ring3.rotation.z = Math.PI / 4;

    gyroGroup.add(coreSphere, coreWire, ring1, ring2, ring3);
    gyroGroup.position.set(0, 0.35, 0);
    masterGroup.add(gyroGroup);

    // 2. Interlocking Precision Gears (Bottom-Right)
    const gearCluster = new THREE.Group();
    const mainGear = createGearMesh(0.66, 0.2, 14, 0.14, metalBlueMat, darkAnodizedMat);
    const smallGear = createGearMesh(0.42, 0.13, 10, 0.14, metalPurpleMat, darkAnodizedMat);
    smallGear.position.set(0.92, 0.38, 0.02);
    gearCluster.add(mainGear, smallGear);
    gearCluster.position.set(1.45, -0.75, -0.2);
    gearCluster.rotation.set(-0.25, -0.35, 0);
    masterGroup.add(gearCluster);

    // 3. Floating Open Engineering Book (Bottom-Left)
    const bookGroup = createOpenBookGroup(bookCoverMat, pageMat, metalPurpleMat);
    bookGroup.position.set(-1.55, -0.65, 0.35);
    bookGroup.rotation.set(0.28, 0.48, -0.08);
    bookGroup.scale.setScalar(0.82);
    masterGroup.add(bookGroup);

    // 4. Mathematical Torus Knot & Programming Bracket Symbol (Top Flanks)
    const mathKnot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.32, 0.09, 72, 12, 2, 3),
      metalPurpleMat,
    );
    mathKnot.position.set(-1.65, 1.15, -0.3);
    masterGroup.add(mathKnot);

    // Programming code brackets `< >` composite group
    const codeGroup = new THREE.Group();
    const barGeo = new THREE.BoxGeometry(0.38, 0.07, 0.07);
    const leftTop = new THREE.Mesh(barGeo, metalBlueMat);
    leftTop.position.set(-0.22, 0.12, 0);
    leftTop.rotation.z = 0.68;
    const leftBot = new THREE.Mesh(barGeo, metalBlueMat);
    leftBot.position.set(-0.22, -0.12, 0);
    leftBot.rotation.z = -0.68;
    const rightTop = new THREE.Mesh(barGeo, metalBlueMat);
    rightTop.position.set(0.22, 0.12, 0);
    rightTop.rotation.z = -0.68;
    const rightBot = new THREE.Mesh(barGeo, metalBlueMat);
    rightBot.position.set(0.22, -0.12, 0);
    rightBot.rotation.z = 0.68;
    const slash = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.56, 0.065),
      metalPurpleMat,
    );
    slash.rotation.z = -0.28;
    codeGroup.add(leftTop, leftBot, rightTop, rightBot, slash);
    codeGroup.position.set(1.65, 1.15, 0.1);
    masterGroup.add(codeGroup);

    // 5. Orbital Data Nodes (InstancedMesh > 20 spheres)
    const nodeCount = 28;
    const nodeGeo = new THREE.SphereGeometry(0.045, 10, 10);
    const nodeMat = new THREE.MeshStandardMaterial({
      color: 0x8dbbff,
      metalness: 0.4,
      roughness: 0.3,
    });
    const instancedNodes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodeCount);
    const dummy = new THREE.Object3D();
    for (let i = 0; i < nodeCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / nodeCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 2.35 + (i % 3) * 0.22;
      dummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.cos(phi) * 0.72 + 0.15,
        r * Math.sin(phi) * Math.sin(theta) * 0.65,
      );
      dummy.scale.setScalar(0.75 + (i % 4) * 0.2);
      dummy.updateMatrix();
      instancedNodes.setMatrixAt(i, dummy.matrix);
    }
    instancedNodes.instanceMatrix.needsUpdate = true;
    instancedNodes.computeBoundingSphere();
    masterGroup.add(instancedNodes);

    // Soft radial contact grounding disc beneath assembly
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const ctx = shadowCanvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(128, 128, 12, 128, 128, 124);
      grad.addColorStop(0, 'rgba(141, 187, 255, 0.24)');
      grad.addColorStop(0.55, 'rgba(196, 172, 255, 0.08)');
      grad.addColorStop(1, 'rgba(8, 13, 28, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    shadowTex.colorSpace = THREE.SRGBColorSpace;
    const groundDisc = new THREE.Mesh(
      new THREE.PlaneGeometry(4.8, 4.8),
      new THREE.MeshBasicMaterial({
        map: shadowTex,
        transparent: true,
        depthWrite: false,
      }),
    );
    groundDisc.rotation.x = -Math.PI / 2;
    groundDisc.position.y = -1.65;
    scene.add(groundDisc);

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // Pointer interaction target
    let targetRotX = 0;
    let targetRotY = 0;
    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      targetRotY = nx * 0.35;
      targetRotX = ny * 0.18;
    };
    const onPointerLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerleave', onPointerLeave);

    const onResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 280);
      const h = Math.max(container.clientHeight, 280);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    const clock = new THREE.Clock();
    let frameId = 0;
    let disposed = false;

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      if (!gl || !gl.fenceSync) {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        if (disposed) return;
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (disposed) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      const reduceMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches;

      if (!reduceMotion) {
        ring1.rotation.z += delta * 0.45;
        ring2.rotation.x += delta * 0.35;
        ring3.rotation.y -= delta * 0.3;
        coreWire.rotation.y += delta * 0.4;
        coreWire.rotation.x += delta * 0.2;

        mainGear.rotation.z += delta * 0.65;
        smallGear.rotation.z -= delta * (0.65 * (14 / 10));

        bookGroup.position.y = -0.65 + Math.sin(elapsed * 1.4) * 0.08;
        mathKnot.rotation.x += delta * 0.45;
        mathKnot.rotation.y += delta * 0.55;
        mathKnot.position.y = 1.15 + Math.cos(elapsed * 1.3) * 0.07;

        codeGroup.rotation.y = Math.sin(elapsed * 1.1) * 0.35;
        codeGroup.position.y = 1.15 + Math.sin(elapsed * 1.5 + 1) * 0.07;

        instancedNodes.rotation.y += delta * 0.12;
      }

      masterGroup.rotation.y = THREE.MathUtils.damp(
        masterGroup.rotation.y,
        targetRotY,
        4.5,
        delta,
      );
      masterGroup.rotation.x = THREE.MathUtils.damp(
        masterGroup.rotation.x,
        targetRotX,
        4.5,
        delta,
      );

      renderer.render(scene, camera);
      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.InstancedMesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      shadowTex.dispose();
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] flex items-center justify-center">
      {webglFailed ? (
        <div className="w-full h-full rounded-2xl a1-surface flex flex-col items-center justify-center p-6 text-center">
          <svg
            viewBox="0 0 240 160"
            className="w-56 h-40 text-[#8DBBFF]"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="120" cy="80" r="46" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" />
            <ellipse cx="120" cy="80" rx="68" ry="24" transform="rotate(-24 120 80)" stroke="#C4ACFF" strokeWidth="1.5" />
            <ellipse cx="120" cy="80" rx="68" ry="24" transform="rotate(24 120 80)" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="120,52 144,94 96,94" stroke="currentColor" strokeWidth="2" />
          </svg>
          <p className="mt-2 text-xs text-[var(--text-secondary)]">
            Interactive Engineering Hub Visual
          </p>
        </div>
      ) : (
        <div
          ref={mountRef}
          aria-label="Interactive 3D engineering illustration with floating books, gears, atomic orbitals, and code symbols"
          className="w-full h-full cursor-grab active:cursor-grabbing"
        />
      )}
    </div>
  );
};
