import { getRoom } from "../services/firebase";
import { onSnapshot, doc } from "firebase/firestore";

jest.mock("firebase/firestore", () => ({
  getFirestore: jest.fn(() => "mockDb"),
  doc: jest.fn(() => "mockDocRef"),
  onSnapshot: jest.fn(),
}));

describe("getRoom", () => {
  it("should call the callback with room data when Firestore updates", () => {
    const rid = "testRoomId";
    const mockCallback = jest.fn();

    (onSnapshot as jest.Mock).mockImplementationOnce((_docRef, cb) => {
      cb({
        data: () => ({ room: "testRoomData" }),
      });
      return jest.fn();
    });

    getRoom(rid, mockCallback);

    expect(doc).toHaveBeenCalledWith("mockDb", "parties", rid);
    expect(onSnapshot).toHaveBeenCalledWith("mockDocRef", expect.any(Function));
    expect(mockCallback).toHaveBeenCalledWith(expect.objectContaining({ data: expect.any(Function) }));
    expect(mockCallback.mock.calls[0][0].data()).toEqual({ room: "testRoomData" });
  });
});
