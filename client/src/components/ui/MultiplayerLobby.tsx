import { useState } from "react";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { useNumberGame } from "@/lib/stores/useNumberGame";
import { send } from "@/lib/websocket";

export function MultiplayerLobby() {
  const { multiplayer, setMode } = useNumberGame();
  const [selectedOpponent, setSelectedOpponent] = useState<string | null>(null);
  const [isAccepting, setIsAccepting] = useState(false);

  const handleChallengePlayer = (opponentId: string) => {
    setSelectedOpponent(opponentId);
    send({ type: "challenge_player", opponentId });
  };

  const handleAcceptChallenge = () => {
    if (multiplayer.opponentId) {
      setIsAccepting(true);
      send({ type: "accept_challenge", opponentId: multiplayer.opponentId });
    }
  };

  const otherPlayers = multiplayer.players.filter((p) => p.id !== multiplayer.playerId);

  // Show loading screen during challenge acceptance
  if (isAccepting) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          </div>
          <p className="text-white text-lg">جاري قبول التحدي...</p>
          <p className="text-gray-400 text-sm mt-2">يرجى الانتظار</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
      <Card className="w-full max-w-md mx-4 bg-gray-900 border-purple-600">
        <CardHeader>
          <CardTitle className="text-center text-white text-2xl">غرفة اللعب</CardTitle>
          <p className="text-center text-purple-400 mt-2">رقم الغرفة: {multiplayer.roomId}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {multiplayer.challengeStatus === "received" && (
            <div className="bg-yellow-900 bg-opacity-50 p-4 rounded-lg border border-yellow-600">
              <p className="text-yellow-200 text-center mb-3">
                تلقيت تحدي! هل تقبل؟
              </p>
              <Button
                onClick={handleAcceptChallenge}
                disabled={isAccepting}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
              >
                قبول التحدي
              </Button>
            </div>
          )}

          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-white font-semibold mb-3">اللاعبون ({multiplayer.players.length}/4)</h3>
            <div className="space-y-2">
              {multiplayer.players.map((player) => (
                <div
                  key={player.id}
                  className={`p-3 rounded-lg flex items-center justify-between ${
                    player.id === multiplayer.playerId
                      ? "bg-purple-900 bg-opacity-50 border border-purple-600"
                      : "bg-gray-700"
                  }`}
                >
                  <span className="text-white">
                    {player.name} {player.id === multiplayer.playerId && "(أنت)"}
                  </span>
                  {player.id !== multiplayer.playerId && (
                    <Button
                      onClick={() => handleChallengePlayer(player.id)}
                      disabled={selectedOpponent !== null}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      تحدي
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {otherPlayers.length === 0 && (
            <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg border border-blue-600">
              <p className="text-blue-200 text-center">
                في انتظار انضمام لاعبين آخرين...
              </p>
            </div>
          )}

          <Button
            onClick={() => setMode("menu")}
            variant="outline"
            className="w-full border-gray-700 text-white hover:bg-gray-800"
          >
            مغادرة الغرفة
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
