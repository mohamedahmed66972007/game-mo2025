import { useEffect } from "react";
import { useNumberGame } from "./lib/stores/useNumberGame";
import { useAudio } from "./lib/stores/useAudio";
import { GameScene } from "./components/game/GameScene";
import { Menu } from "./components/ui/Menu";
import { WinScreen } from "./components/ui/WinScreen";
import { MultiplayerLobby } from "./components/ui/MultiplayerLobby";
import { SecretCodeSetup } from "./components/ui/SecretCodeSetup";
import { GameHUD } from "./components/ui/GameHUD";
import { GameOverScreen } from "./components/ui/GameOverScreen";
import "@fontsource/inter";

function App() {
  const { mode, singleplayer, multiplayer } = useNumberGame();
  const { setHitSound, setSuccessSound } = useAudio();

  useEffect(() => {
    const hitAudio = new Audio("/sounds/hit.mp3");
    const successAudio = new Audio("/sounds/success.mp3");
    
    hitAudio.load();
    successAudio.load();
    
    setHitSound(hitAudio);
    setSuccessSound(successAudio);
  }, [setHitSound, setSuccessSound]);

  const isMultiplayerGameActive =
    multiplayer.opponentId &&
    multiplayer.challengeStatus === "accepted" &&
    multiplayer.mySecretCode.length === 4;

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {mode === "menu" && <Menu />}

      {mode === "singleplayer" && (
        <>
          <GameScene />
          <GameHUD />
          {singleplayer.phase === "won" && <WinScreen />}
        </>
      )}

      {mode === "multiplayer" && (
        <>
          {multiplayer.roomId && !multiplayer.opponentId && <MultiplayerLobby />}
          
          {multiplayer.opponentId && multiplayer.challengeStatus === "accepted" && (
            <>
              {multiplayer.mySecretCode.length === 0 && <SecretCodeSetup />}
              
              {isMultiplayerGameActive && (
                <>
                  <GameScene />
                  <GameHUD />
                  {(multiplayer.phase === "won" || multiplayer.phase === "lost") && (
                    <GameOverScreen />
                  )}
                </>
              )}
            </>
          )}
          
          {!multiplayer.roomId && <Menu />}
        </>
      )}
    </div>
  );
}

export default App;
