import { useEffect, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { FirstPersonControls, Controls } from "./FirstPersonControls";
import { NumberPanel } from "./NumberPanel";
import { DisplayPanel } from "./DisplayPanel";
import { FeedbackPanel } from "./FeedbackPanel";
import { AttemptsHistory } from "./AttemptsHistory";
import { Crosshair } from "../ui/Crosshair";

function Scene({ onLockChange }: { onLockChange?: (locked: boolean) => void }) {
  useEffect(() => {
    const handlePointerLockChange = () => {
      const isLocked = document.pointerLockElement !== null;
      onLockChange?.(isLocked);
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
    };
  }, [onLockChange]);

  return (
    <>
      <color attach="background" args={["#0f1419"]} />
      
      <ambientLight intensity={1} />
      <pointLight position={[0, 5, 2]} intensity={2} color="#ffffff" />
      <pointLight position={[-4, 3, -6]} intensity={1.2} color="#00d9ff" />
      <pointLight position={[4, 3, -6]} intensity={1.2} color="#7c3aed" />
      <directionalLight position={[8, 10, 5]} intensity={1.2} color="#ffffff" />
      
      {/* زجاج الأرضية - Sky Glass */}
      <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#a0c4ff" 
          metalness={0.9}
          roughness={0.1}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* خطوط شبكة على الزجاج */}
      <gridHelper args={[50, 50, '#3b82f6', '#1e3a5f']} position={[0, -0.4, 0]} />

      {/* سماء بعيدة */}
      <mesh position={[0, 20, 0]}>
        <sphereGeometry args={[100, 64, 64]} />
        <meshStandardMaterial 
          color="#0f172a" 
          emissive="#1e3a5f"
          side={THREE.BackSide}
        />
      </mesh>

      <NumberPanel />
      <FeedbackPanel />
      <AttemptsHistory />
      
      <FirstPersonControls />
    </>
  );
}

const keyMap = [
  { name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
  { name: Controls.back, keys: ["ArrowDown", "KeyS"] },
  { name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
  { name: Controls.right, keys: ["ArrowRight", "KeyD"] },
];

export function GameScene() {
  const [isLocked, setIsLocked] = useState(false);

  return (
    <>
      <KeyboardControls map={keyMap}>
        <Canvas
          camera={{
            position: [0, 1.6, 0],
            fov: 60,
            near: 0.1,
            far: 1000,
          }}
          gl={{
            antialias: true,
          }}
        >
          <Scene onLockChange={setIsLocked} />
        </Canvas>
      </KeyboardControls>
      {!isLocked && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className="text-white text-sm bg-black bg-opacity-50 p-4 rounded text-center">
            <p className="mb-2">اضغط على الشاشة لقفل المؤشر</p>
            <p className="text-xs text-gray-400">WASD للحركة | الماوس للنظر</p>
          </div>
        </div>
      )}
      <Crosshair />
    </>
  );
}
