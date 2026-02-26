import type { Conversation } from "../../types/conversation";

export default function TestModal({ currentConversation, onClose }: { currentConversation: Conversation; onClose: () => void }) {
  if(!currentConversation) {
    return (
      <div className="modal modal-open fixed z-50 flex justify-center items-center">
        <div className=" modal-box flex flex-col text-center gap-2 rounded-lg bg-base-100 min-w-64 p-3">
          <h3 className="text-8xl font-bold text-center">No conversation found</h3>
          <button className="text-xs" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
  return (
    <div className="modal modal-open fixed z-50 flex justify-center items-center">
      <div className=" modal-box flex flex-col text-center gap-2 rounded-lg bg-base-100 min-w-64 p-3">
        <h3 className="text-8xl font-bold text-center">{currentConversation.npcScript}</h3>
        <button className="text-xs" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
