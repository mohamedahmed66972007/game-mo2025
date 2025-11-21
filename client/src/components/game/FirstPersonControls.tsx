import { useRef, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import * as THREE from "three";

export enum Controls {
  forward = "forward",
  back = "back",
  left = "left",
  right = "right",
}

export function FirstPersonControls() {
  const { camera, gl } = useThree();
  const isLocked = useRef(false);
  const firstMoveAfterLock = useRef(false);
  const velocity = useRef(new THREE.Vector3());
  const direction = useRef(new THREE.Vector3());
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  
  const [, getKeys] = useKeyboardControls<Controls>();

  useEffect(() => {
    const canvas = gl.domElement;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isLocked.current) return;

      // Skip first movement after lock to avoid jump
      if (firstMoveAfterLock.current) {
        firstMoveAfterLock.current = false;
        // Force center the mouse on first lock
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        // This is handled by pointer lock, but we skip the first movement
        return;
      }

      const movementX = e.movementX || (e as any).mozMovementX || 0;
      const movementY = e.movementY || (e as any).mozMovementY || 0;

      // Get current euler angles
      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.order = 'YXZ';

      // Update pitch (vertical rotation, clamped)
      euler.current.x -= movementY * 0.002;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));

      // Update yaw (horizontal rotation, unclamped for free rotation)
      euler.current.y -= movementX * 0.002;

      // Apply the rotation to camera
      camera.quaternion.setFromEuler(euler.current);
    };

    const handlePointerLockChange = () => {
      isLocked.current = document.pointerLockElement === canvas;
      if (isLocked.current) {
        firstMoveAfterLock.current = true;
        console.log('Pointer lock activated - mouse centered');
      } else {
        console.log('Pointer lock released');
      }
    };

    const handlePointerLockError = () => {
      console.error('Pointer lock error');
      isLocked.current = false;
    };

    const handleCanvasClick = async () => {
      try {
        await canvas.requestPointerLock?.();
      } catch (err) {
        console.error('Failed to request pointer lock:', err);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('pointerlockerror', handlePointerLockError);
    canvas.addEventListener('click', handleCanvasClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('pointerlockerror', handlePointerLockError);
      canvas.removeEventListener('click', handleCanvasClick);
    };
  }, [camera, gl]);

  useFrame((state, delta) => {
    if (!isLocked.current) return;

    const { forward, back, left, right } = getKeys();
    const speed = 6;
    
    direction.current.set(0, 0, 0);

    if (forward) direction.current.z -= 1;
    if (back) direction.current.z += 1;
    if (left) direction.current.x -= 1;
    if (right) direction.current.x += 1;

    if (direction.current.length() > 0) {
      direction.current.normalize();
      direction.current.applyQuaternion(camera.quaternion);
      direction.current.y = 0;
      direction.current.normalize();

      velocity.current.copy(direction.current).multiplyScalar(speed * delta);

      const newPosition = camera.position.clone().add(velocity.current);
      
      const roomBounds = 12;
      newPosition.x = Math.max(-roomBounds, Math.min(roomBounds, newPosition.x));
      newPosition.z = Math.max(-roomBounds, Math.min(roomBounds, newPosition.z));
      newPosition.y = 1.6;
      
      camera.position.copy(newPosition);
    }
  });

  return null;
}
