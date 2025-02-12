import { createRoom } from "../services/firebase";
import { setDoc, serverTimestamp, doc } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => "mockDb"),
  setDoc: jest.fn(),
  doc: jest.fn(() => "mockDocRef"),
  serverTimestamp: jest.fn(() => "mockTimestamp"),
}));

describe("createRoom", () => {
  it("should create a room with a timestamp", async () => {
    const rid = "testRoomId";
    await createRoom(rid);

    expect(setDoc).toHaveBeenCalledWith("mockDocRef", {
      timestamp: serverTimestamp(),
    });

    expect(doc).toHaveBeenCalledWith("mockDb", "parties", rid);
  });

  it("should handle multiple room creations", async () => {
    const rid1 = "testRoomId1";
    const rid2 = "testRoomId2";
    
    await createRoom(rid1);
    await createRoom(rid2);

    expect(setDoc).toHaveBeenCalledWith("mockDocRef", {
      timestamp: serverTimestamp(),
    });

    expect(doc).toHaveBeenCalledWith("mockDb", "parties", rid1);
    expect(doc).toHaveBeenCalledWith("mockDb", "parties", rid2);

  });

  it("should count how many times createRoom was called", async () => {
    expect(setDoc).toHaveBeenCalledTimes(3);
    expect(doc).toHaveBeenCalledTimes(3);
  });
});
