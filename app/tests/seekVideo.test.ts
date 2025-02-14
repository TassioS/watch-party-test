import { seekVideo } from "../services/firebase";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => "mockDb"),
  doc: jest.fn(() => "mockDocRef"),
  updateDoc: jest.fn(),
  serverTimestamp: jest.fn(() => "mockTimestamp"),
}));

describe("seekVideo", () => {
  it("should update currentTime and startedAt when seeking video", async () => {
    const rid = "testRoomId";
    const currentTime = 45;

    await seekVideo(rid, currentTime);

    expect(doc).toHaveBeenCalledWith("mockDb", "parties", rid);

    expect(updateDoc).toHaveBeenCalledWith("mockDocRef", {
      currentTime,
      startedAt: "mockTimestamp",
    });
  });
});
