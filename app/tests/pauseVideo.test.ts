import { pauseVideo } from "../services/firebase";
import { updateDoc, doc } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => "mockDb"),
  doc: jest.fn(() => "mockDocRef"),
  updateDoc: jest.fn(),
}));

describe("pauseVideo", () => {
  it("should set playing to false and update currentTime", async () => {
    const rid = "testRoomId";
    const currentTime = 30;

    await pauseVideo(rid, currentTime);

    expect(doc).toHaveBeenCalledWith("mockDb", "parties", rid);

    expect(updateDoc).toHaveBeenCalledWith("mockDocRef", {
      playing: false,
      currentTime,
      startedAt: null,
    });

    expect(updateDoc).toHaveBeenCalledTimes(1);
  });
});
