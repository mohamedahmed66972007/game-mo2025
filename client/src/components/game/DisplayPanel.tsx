import { Text, RoundedBox } from "@react-three/drei";
import { useNumberGame } from "@/lib/stores/useNumberGame";

export function DisplayPanel() {
  const { mode, singleplayer, multiplayer } = useNumberGame();
  const currentGuess = mode === "singleplayer" ? singleplayer.currentGuess : multiplayer.currentGuess;

  const displayText = currentGuess.map((d) => d.toString()).join("  ");
  const emptySlots = 4 - currentGuess.length;
  const emptyText = "_  ".repeat(emptySlots);

  return (
    <group position={[0, 3.8, 0]}>
      <RoundedBox
        args={[5, 0.9, 0.3]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial 
          color="#8b5cf6"
          metalness={0.5}
          roughness={0.4}
          emissive="#6d28d9"
        />
      </RoundedBox>
      
      <Text
        position={[0, 0, 0.2]}
        fontSize={0.65}
        color="#f3e8ff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {displayText}{emptyText}
      </Text>
    </group>
  );
}
