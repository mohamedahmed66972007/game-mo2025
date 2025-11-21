import { useRef, useState } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import { Text, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useNumberGame } from "@/lib/stores/useNumberGame";
import { useAudio } from "@/lib/stores/useAudio";
import { send } from "@/lib/websocket";
import { DisplayPanel } from "./DisplayPanel";

interface ButtonProps {
  position: [number, number, number];
  digit: number;
  onClick: (digit: number) => void;
}

function NumberButton({ position, digit, onClick }: ButtonProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.setScalar(1.15);
      meshRef.current.position.z = 0.1;
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
      meshRef.current.position.z = 0;
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1, 1, 0.3]}
        radius={0.08}
        smoothness={4}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick(digit);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <meshStandardMaterial 
          color={hovered ? "#a855f7" : "#8b5cf6"}
          metalness={0.5}
          roughness={0.4}
          emissive={hovered ? "#6d28d9" : "#000000"}
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.25]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {digit}
      </Text>
    </group>
  );
}

interface DeleteButtonProps {
  position: [number, number, number];
  onClick: () => void;
}

function DeleteButton({ position, onClick }: DeleteButtonProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && hovered) {
      meshRef.current.scale.setScalar(1.15);
      meshRef.current.position.z = 0.1;
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
      meshRef.current.position.z = 0;
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1, 1, 0.3]}
        radius={0.08}
        smoothness={4}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <meshStandardMaterial 
          color={hovered ? "#f87171" : "#ff6b6b"}
          metalness={0.5}
          roughness={0.4}
          emissive={hovered ? "#dc2626" : "#000000"}
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.25]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        ✕
      </Text>
    </group>
  );
}

interface ConfirmButtonProps {
  position: [number, number, number];
  onClick: () => void;
  enabled: boolean;
}

function ConfirmButton({ position, onClick, enabled }: ConfirmButtonProps) {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (meshRef.current && hovered && enabled) {
      meshRef.current.scale.setScalar(1.15);
      meshRef.current.position.z = 0.1;
    } else if (meshRef.current) {
      meshRef.current.scale.setScalar(1);
      meshRef.current.position.z = 0;
    }
  });

  return (
    <group position={position}>
      <RoundedBox
        ref={meshRef}
        args={[1, 1, 0.3]}
        radius={0.08}
        smoothness={4}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          if (enabled) {
            e.stopPropagation();
            onClick();
          }
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          if (enabled) {
            e.stopPropagation();
            setHovered(true);
          }
        }}
        onPointerOut={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(false);
        }}
      >
        <meshStandardMaterial 
          color={enabled ? (hovered ? "#4ade80" : "#22c55e") : "#6b7280"}
          metalness={0.5}
          roughness={0.4}
          emissive={enabled && hovered ? "#16a34a" : "#000000"}
        />
      </RoundedBox>
      <Text
        position={[0, 0, 0.25]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        ✓
      </Text>
    </group>
  );
}

export function NumberPanel() {
  const { mode, singleplayer, multiplayer, addDigitToGuess, deleteLastDigit, submitGuess, addMultiplayerDigit, deleteMultiplayerDigit, submitMultiplayerGuess } = useNumberGame();
  const { playHit } = useAudio();

  const handleDigitClick = (digit: number) => {
    playHit();
    if (mode === "singleplayer") {
      addDigitToGuess(digit);
    } else if (mode === "multiplayer" && multiplayer.isMyTurn) {
      addMultiplayerDigit(digit);
    }
  };

  const handleDeleteClick = () => {
    playHit();
    if (mode === "singleplayer") {
      deleteLastDigit();
    } else if (mode === "multiplayer" && multiplayer.isMyTurn) {
      deleteMultiplayerDigit();
    }
  };

  const handleConfirmClick = () => {
    playHit();
    if (mode === "singleplayer") {
      submitGuess();
    } else if (mode === "multiplayer" && multiplayer.isMyTurn) {
      submitMultiplayerGuess();
      send({
        type: "submit_guess",
        opponentId: multiplayer.opponentId,
        guess: multiplayer.currentGuess,
      });
    }
  };

  const currentGuess = mode === "singleplayer" ? singleplayer.currentGuess : multiplayer.currentGuess;
  const canConfirm = currentGuess.length === 4 && (mode === "singleplayer" || multiplayer.isMyTurn);

  return (
    <group position={[1, 1.5, -8]}>
      {/* Phone-like panel background */}
      <RoundedBox
        args={[5.5, 6, 0.5]}
        radius={0.15}
        smoothness={4}
        position={[0, 1.5, 0]}
      >
        <meshStandardMaterial 
          color="#1a1a3e"
          metalness={0.3}
          roughness={0.7}
        />
      </RoundedBox>

      {/* Display screen */}
      <DisplayPanel />

      {/* Row 1: 1 2 3 */}
      {[1, 2, 3].map((digit, idx) => (
        <NumberButton
          key={digit}
          position={[(idx - 1) * 1.4, 2, 0.3]}
          digit={digit}
          onClick={handleDigitClick}
        />
      ))}
      
      {/* Row 2: 4 5 6 */}
      {[4, 5, 6].map((digit, idx) => (
        <NumberButton
          key={digit}
          position={[(idx - 1) * 1.4, 0.6, 0.3]}
          digit={digit}
          onClick={handleDigitClick}
        />
      ))}

      {/* Row 3: 7 8 9 */}
      {[7, 8, 9].map((digit, idx) => (
        <NumberButton
          key={digit}
          position={[(idx - 1) * 1.4, -0.8, 0.3]}
          digit={digit}
          onClick={handleDigitClick}
        />
      ))}

      {/* Row 4: Delete - 0 - Confirm */}
      <DeleteButton position={[-1.4, -2.2, 0.3]} onClick={handleDeleteClick} />
      <NumberButton
        position={[0, -2.2, 0.3]}
        digit={0}
        onClick={handleDigitClick}
      />
      <ConfirmButton position={[1.4, -2.2, 0.3]} onClick={handleConfirmClick} enabled={canConfirm} />
    </group>
  );
}
