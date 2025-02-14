import { playVideo } from "../services/firebase";
import { updateDoc, doc } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => "mockDb"),
  doc: jest.fn(() => "mockDocRef"),
  updateDoc: jest.fn(),
}));

describe("playVideo", () => {
  it("should update the video state with playing flag, currentTime, and vid", async () => {
    const rid = "testRoomId";
    const body = { playing: true, currentTime: 0, vid: "testVideoId" };

    await playVideo(rid, body);

    expect(doc).toHaveBeenCalledWith("mockDb", "parties", rid);

    expect(updateDoc).toHaveBeenCalledWith("mockDocRef", {
      playing: true,
      currentTime: 0,
      vid: "testVideoId",
    });
  });
});
