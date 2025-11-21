import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { useNumberGame } from "@/lib/stores/useNumberGame";
import { connectWebSocket } from "@/lib/websocket";

export function Menu() {
  const { setMode, startSingleplayer, setPlayerName } = useNumberGame();
  const [showMultiplayer, setShowMultiplayer] = useState(false);
  const [playerName, setPlayerNameInput] = useState("");
  const [roomId, setRoomId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSingleplayer = () => {
    startSingleplayer();
  };

  const handleMultiplayerMenu = () => {
    setShowMultiplayer(true);
  };

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      alert("الرجاء إدخال اسمك");
      return;
    }
    setIsLoading(true);
    setPlayerName(playerName);
    setMode("multiplayer");
    connectWebSocket(playerName);
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      alert("الرجاء إدخال اسمك");
      return;
    }
    if (!roomId.trim()) {
      alert("الرجاء إدخال رقم الغرفة");
      return;
    }
    setIsLoading(true);
    setPlayerName(playerName);
    setMode("multiplayer");
    connectWebSocket(playerName, roomId.toUpperCase());
  };

  if (showMultiplayer) {
    if (isLoading) {
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
            <p className="text-white text-lg">جاري الاتصال...</p>
            <p className="text-gray-400 text-sm mt-2">يرجى الانتظار</p>
          </div>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
        <Card className="w-full max-w-md mx-4 bg-gray-900 border-purple-600">
          <CardHeader>
            <CardTitle className="text-center text-white text-2xl">لعب متعدد اللاعبين</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-white text-sm mb-2 block">اسمك</label>
              <Input
                type="text"
                placeholder="أدخل اسمك"
                value={playerName}
                onChange={(e) => setPlayerNameInput(e.target.value)}
                className="bg-gray-800 text-white border-gray-700"
              />
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleCreateRoom}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                size="lg"
              >
                إنشاء غرفة جديدة
              </Button>

              <div className="text-center text-gray-400 text-sm">أو</div>

              <Input
                type="text"
                placeholder="رقم الغرفة"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                className="bg-gray-800 text-white border-gray-700"
              />

              <Button
                onClick={handleJoinRoom}
                disabled={isLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="lg"
              >
                الانضمام لغرفة
              </Button>
            </div>

            <Button
              onClick={() => {
                setShowMultiplayer(false);
                setIsLoading(false);
              }}
              variant="outline"
              className="w-full border-gray-700 text-white hover:bg-gray-800"
            >
              رجوع
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-purple-900 to-black z-50">
      <Card className="w-full max-w-md mx-4 bg-gray-900 border-purple-600">
        <CardHeader>
          <CardTitle className="text-center text-white text-3xl">لعبة التخمين</CardTitle>
          <p className="text-center text-gray-400 text-sm mt-2">خمن الرقم السري المكون من 4 أرقام</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleSingleplayer}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            size="lg"
          >
            لعب فردي
          </Button>

          <Button
            onClick={handleMultiplayerMenu}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            لعب متعدد اللاعبين
          </Button>

          <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-white font-semibold mb-2">كيف تلعب:</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• انقر على الشاشة لقفل المؤشر</li>
              <li>• استخدم الماوس للنظر حولك</li>
              <li>• استخدم W/A/S/D للحركة</li>
              <li>• انقر على الأرقام لتخمين الرقم السري</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
