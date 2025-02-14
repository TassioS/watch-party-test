import { getRoom } from "../services/firebase";
import { renderHook } from "@testing-library/react";
import { useEffect, useState } from "react";

jest.mock("../services/firebase", () => ({
  getRoom: jest.fn(),
}));

const seekToMock = jest.fn();
jest.mock("react-player", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    seekTo: seekToMock,
  })),
}));

const mockGetRoom = getRoom as jest.Mock;

describe("Late to the Party - Video Sync", () => {
  it("syncs video state when joining late", async () => {
    const rid = "testRoomId";
    const mockRoomData = {
      vid: "testVideoId",
      playing: true,
      currentTime: 30,
      startedAt: { seconds: Math.floor(Date.now() / 1000) - 10 },
    };

    mockGetRoom.mockImplementation((rid, callback) => {
      callback({ exists: () => true, data: () => mockRoomData });
    });

    const useSyncVideo = () => {
      const [room, setRoom] = useState<any>(null);

      useEffect(() => {
        getRoom(rid, (doc: any) => {
          if (doc?.exists()) {
            const roomData = doc.data();
            setRoom(roomData);

            const elapsedTime = Math.floor(Date.now() / 1000) - roomData.startedAt.seconds;
            const seekTime = roomData.currentTime + elapsedTime;
            seekToMock(seekTime);
          }
        });
      }, [rid]);

      return { room };
    };

    const { result } = renderHook(() => useSyncVideo());

    expect(mockGetRoom).toHaveBeenCalledWith(rid, expect.any(Function));
    expect(result.current.room).toEqual(mockRoomData);
    expect(seekToMock).toHaveBeenCalledWith(40);
  });
});
