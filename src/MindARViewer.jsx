import React, { useEffect, useRef, useState } from 'react';

/* ── keyframes injected once ── */
const KEYFRAMES = `
  @keyframes spin  { to { transform: rotate(360deg); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
`;
let keyframesInjected = false;
function injectKeyframes() {
  if (keyframesInjected) return;
  if (typeof document !== 'undefined') {
    const el = document.createElement('style');
    el.textContent = KEYFRAMES;
    document.head.appendChild(el);
    keyframesInjected = true;
  }
}

const styles = {
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'transparent', // Let camera show through!
    fontFamily: "'Syne', sans-serif",
    overflow: 'hidden'
  },
  hintBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    padding: '14px 24px',
    background: 'linear-gradient(180deg, rgba(0,0,0,0.72) 0%, transparent 100%)',
    color: '#fff',
    fontSize: '13px',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    pointerEvents: 'none',
  },
  hintDot: {
    width: 8, height: 8,
    borderRadius: '50%',
    background: '#00f0ff',
    boxShadow: '0 0 8px #00f0ff',
    animation: 'pulse 1.6s ease-in-out infinite',
  },
  loadingOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#111',
    gap: '28px',
  },
  loadingRing: {
    width: 56, height: 56,
    border: '3px solid rgba(0,240,255,0.15)',
    borderTop: '3px solid #00f0ff',
    borderRadius: '50%',
    animation: 'spin 0.9s linear infinite',
  },
  loadingText: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '12px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    fontFamily: "'Space Mono', monospace",
  },
  errorOverlay: {
    position: 'absolute',
    inset: 0,
    zIndex: 30,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#0a0000',
    gap: '16px',
    padding: '32px',
    textAlign: 'center',
  },
  errorTitle: {
    color: '#ff4d4d',
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  errorMsg: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: '12px',
    fontFamily: "'Space Mono', monospace",
    lineHeight: 1.8,
    maxWidth: 340,
    whiteSpace: 'pre-line',
  },
  arContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1, 
  },
};

const MindARViewer = () => {
  const containerRef = useRef(null);
  const [status, setStatus]     = useState('starting');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    injectKeyframes();
    let mindarThree;

    const start = async () => {
      try {
        const dynamicImport = new Function('specifier', 'return import(specifier)');
        
        // THE FIX: We pin Three.js to version 0.149.0 using esm.sh's dependency override feature.
        // Version 0.149.0 is the "sweet spot" that still exports 'sRGBEncoding' but also
        // supports the 'three/addons/' folder structure that MindAR relies on!
        const THREE = await dynamicImport('https://esm.sh/three@0.149.0');
        const { MindARThree } = await dynamicImport('https://esm.sh/mind-ar@1.2.5/dist/mindar-image-three.prod.js?deps=three@0.149.0');

        mindarThree = new MindARThree({
          container: containerRef.current,
          // IMPORTANT: This file must now contain 3 compiled images!
          imageTargetSrc: '/assets/card.mind',
          uiLoading:  'no',
          uiScanning: 'no',
          uiError:    'no',
        });

        const { renderer, scene, camera } = mindarThree;

        // ==========================================
        // TARGET 1 (Index 0) - The Original Dark Profile
        // ==========================================
        const anchor0 = mindarThree.addAnchor(0);
        
        const bgGeo0 = new THREE.PlaneGeometry(1.1, 0.6);
        const bgMat0 = new THREE.MeshBasicMaterial({ color: 0x111111, transparent: true, opacity: 0.85 });
        const bgMesh0 = new THREE.Mesh(bgGeo0, bgMat0);
        anchor0.group.add(bgMesh0);

        // 👉 TO CHANGE THIS IMAGE: Just replace the URL below!
        const myPhotoURL = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4HQVlRHDYSn-UUqrWU56oWgUBNEALduV8PQifvnxSD56Z5RubfuWFnhtWdxPtiyTXW0Y-6pgR30S9DmB9Ft56NZPFZbHqBwl2NDsxRw1K&s=10'; 
        
        const textureLoader0 = new THREE.TextureLoader();
        textureLoader0.setCrossOrigin("anonymous"); 
        const profileTex = textureLoader0.load(myPhotoURL); 
        const picGeo0 = new THREE.CircleGeometry(0.2, 32); 
        const picMat0 = new THREE.MeshBasicMaterial({ map: profileTex }); // Apply the image
        const picMesh0 = new THREE.Mesh(picGeo0, picMat0);
        picMesh0.position.set(-0.3, 0, 0.01); 
        anchor0.group.add(picMesh0);

        const btnGeo0 = new THREE.PlaneGeometry(0.4, 0.12);
        const btnMat0 = new THREE.MeshBasicMaterial({ color: 0x0a66c2 }); 
        const btnMesh0 = new THREE.Mesh(btnGeo0, btnMat0);
        btnMesh0.position.set(0.2, -0.1, 0.01); 
        anchor0.group.add(btnMesh0);


        // ==========================================
        // TARGET 2 (Index 1) - An Image Panel
        // ==========================================
        const anchor1 = mindarThree.addAnchor(1);

        const bgGeo1 = new THREE.PlaneGeometry(1, 0.5);
        const bgMat1 = new THREE.MeshBasicMaterial({ color: 0xffaa00, transparent: true, opacity: 0.9 }); // Gold border
        const bgMesh1 = new THREE.Mesh(bgGeo1, bgMat1);
        anchor1.group.add(bgMesh1);

        // 👉 TO CHANGE THIS IMAGE: Replace this URL with any rectangular image link
        const target2ImageURL = 'data:image/jpeg;base64,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';
        
        const textureLoader1 = new THREE.TextureLoader();
        textureLoader1.setCrossOrigin("anonymous");
        const panelTex = textureLoader1.load(target2ImageURL);

        const innerGeo1 = new THREE.PlaneGeometry(0.9, 0.4);
        const innerMat1 = new THREE.MeshBasicMaterial({ map: panelTex }); // Apply the image instead of a solid color
        const innerMesh1 = new THREE.Mesh(innerGeo1, innerMat1);
        innerMesh1.position.set(0, 0, 0.01);
        anchor1.group.add(innerMesh1);


        // ==========================================
        // TARGET 3 (Index 2) - A Floating Neon 3D Cube
        // ==========================================
        const anchor2 = mindarThree.addAnchor(2);

        const boxGeo2 = new THREE.BoxGeometry(0.4, 0.4, 0.4);
        const boxMat2 = new THREE.MeshBasicMaterial({ color: 0xff00ff, wireframe: true }); // Pink neon wireframe
        const boxMesh2 = new THREE.Mesh(boxGeo2, boxMat2);
        // Push the cube forward so it floats *above* the card
        boxMesh2.position.set(0, 0, 0.2); 
        anchor2.group.add(boxMesh2);

        // Optional: Animate the neon cube to spin!
        renderer.setAnimationLoop(() => {
          boxMesh2.rotation.x += 0.01;
          boxMesh2.rotation.y += 0.02;
          renderer.render(scene, camera);
        });

        // Start AR
        await mindarThree.start();
        setStatus('ready');

      } catch (e) {
        console.error('AR Start Error:', e);
        setErrorMsg(
          `${e?.message || 'Unknown error'}\n\nCommon fixes:\n• Allow camera permissions\n• Make sure card.mind is in public/assets/\\n• Make sure your card.mind file actually contains 3 images!`
        );
        setStatus('error');
      }
    };

    start();

    return () => {
      if (mindarThree) {
        try {
          mindarThree.renderer?.setAnimationLoop(null);
          mindarThree.stop();
        } catch (_) {}
      }
    };
  }, []);

  return (
    <div style={styles.wrapper}>

      {status === 'starting' && (
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingRing} />
          <span style={styles.loadingText}>Starting camera…</span>
        </div>
      )}

      {status === 'error' && (
        <div style={styles.errorOverlay}>
          <span style={{ fontSize: 36 }}>⚠️</span>
          <span style={styles.errorTitle}>AR failed to start</span>
          <span style={styles.errorMsg}>{errorMsg}</span>
        </div>
      )}

      {status === 'ready' && (
        <div style={styles.hintBar}>
          <div style={styles.hintDot} />
          Point camera at your cards
        </div>
      )}

      <div ref={containerRef} style={styles.arContainer} />
    </div>
  );
};

export default function App() {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: 'transparent' }}>
      <MindARViewer />
    </div>
  );
}