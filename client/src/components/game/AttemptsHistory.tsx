import { useState, useRef, useEffect } from "react";
import { Text, RoundedBox } from "@react-three/drei";
import { useNumberGame } from "@/lib/stores/useNumberGame";

function getFeedbackTextShort(correctCount: number, correctPositionCount: number): string {
  if (correctCount === 0) return "ولا رقم صح";
  const correctInWrongPosition = correctCount - correctPositionCount;
  
  if (correctPositionCount === 4) return "فوز!";
  if (correctPositionCount === 0) return `${correctCount} صح - مكان غلط`;
  if (correctInWrongPosition === 0) return `${correctPositionCount} صح - مكان صح`;
  return `${correctCount} صح - ${correctPositionCount} مكان صح`;
}

export function AttemptsHistory() {
  const { mode, singleplayer } = useNumberGame();
  const [scrollOffset, setScrollOffset] = useState(0);
  const scrollRef = useRef(0);

  if (mode !== "singleplayer") {
    return null;
  }

  const attemptCount = singleplayer.attempts.length;
  const itemHeight = 0.65;
  const panelWidth = 5.5;
  const panelHeight = 7;
  const maxVisibleItems = 10;
  
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const maxScroll = Math.max(0, attemptCount - maxVisibleItems) * itemHeight;
      scrollRef.current = Math.max(0, Math.min(maxScroll, scrollRef.current + e.deltaY * 0.01));
      setScrollOffset(scrollRef.current);
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [attemptCount, maxVisibleItems]);

  const startIndex = Math.floor(scrollOffset / itemHeight);
  const visibleAttempts = singleplayer.attempts.slice(startIndex, startIndex + maxVisibleItems);

  return (
    <group position={[0, 2, -18]}>
      <RoundedBox
        args={[panelWidth, panelHeight, 0.3]}
        radius={0.1}
        smoothness={4}
      >
        <meshStandardMaterial 
          color="#0f172a"
          emissive="#1a2942"
          metalness={0.3}
          roughness={0.7}
        />
      </RoundedBox>

      {/* Display panel للأرقام المدخلة */}
      <RoundedBox
        args={[panelWidth - 0.3, 0.75, 0.3]}
        radius={0.08}
        smoothness={4}
        position={[0, panelHeight / 2 - 0.55, 0.1]}
      >
        <meshStandardMaterial 
          color="#8b5cf6"
          metalness={0.5}
          roughness={0.4}
          emissive="#6d28d9"
        />
      </RoundedBox>

      <Text
        position={[0, panelHeight / 2 - 0.55, 0.2]}
        fontSize={0.5}
        color="#f3e8ff"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        {singleplayer.currentGuess.map(d => d.toString()).join("  ") + 
         (singleplayer.currentGuess.length < 4 
           ? "  " + Array(4 - singleplayer.currentGuess.length).fill("_").join("  ")
           : "")}
      </Text>

      <Text
        position={[-panelWidth / 2 + 0.8, panelHeight / 2 - 1.6, 0.2]}
        fontSize={0.28}
        color="#00d9ff"
        anchorX="left"
        anchorY="middle"
        fontWeight="bold"
      >
        المحاولات ({attemptCount})
      </Text>

      <mesh position={[0, panelHeight / 2 - 1.95, 0.16]}>
        <boxGeometry args={[panelWidth - 0.3, 0.02, 0.02]} />
        <meshStandardMaterial 
          color="#00d9ff"
          emissive="#00b8d4"
        />
      </mesh>

      {visibleAttempts.map((attempt, visibleIndex) => {
        const globalIndex = startIndex + visibleIndex;
        const guessText = attempt.guess.join(" ");
        const feedbackText = getFeedbackTextShort(attempt.correctCount, attempt.correctPositionCount);
        const yPosition = panelHeight / 2 - 2.5 - visibleIndex * itemHeight;

        return (
          <group key={globalIndex} position={[0, yPosition, 0]}>
            {globalIndex % 2 === 0 && (
              <mesh position={[0, 0, 0.05]}>
                <boxGeometry args={[panelWidth - 0.2, itemHeight - 0.1, 0.02]} />
                <meshStandardMaterial 
                  color="#1e293b"
                  transparent
                  opacity={0.3}
                />
              </mesh>
            )}

            <Text
              position={[-panelWidth / 2 + 0.6, 0, 0.2]}
              fontSize={0.2}
              color="#64b5f6"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              #{globalIndex + 1}
            </Text>

            <Text
              position={[-0.5, 0.12, 0.2]}
              fontSize={0.24}
              color="#e2e8f0"
              anchorX="center"
              anchorY="middle"
              fontWeight="bold"
            >
              {guessText}
            </Text>

            <Text
              position={[panelWidth / 2 - 0.8, -0.12, 0.2]}
              fontSize={0.16}
              color="#4ade80"
              anchorX="right"
              anchorY="middle"
            >
              {feedbackText}
            </Text>
          </group>
        );
      })}

      {attemptCount === 0 && (
        <Text
          position={[0, 0, 0.2]}
          fontSize={0.26}
          color="#64748b"
          anchorX="center"
          anchorY="middle"
        >
          لا توجد محاولات بعد
        </Text>
      )}
    </group>
  );
}
