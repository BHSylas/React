import { forwardRef } from "react";
import type { Conversation } from "../../types/conversation";
import AnswerBox from "./AnswerBox";

const TestModal = forwardRef<
  HTMLDivElement,
  { currentConversation: Conversation; onClose: () => void }
>(({ currentConversation, onClose }, ref) => {
  if (!currentConversation) {
    return (
      <div ref={ref} className="modal modal-open fixed z-50 flex justify-center items-center">
        <div
          className="modal-box flex flex-col text-center gap-2 rounded-lg bg-base-100 min-w-64 p-3"
        >
          <h3 className="text-xl font-bold text-center">
            No conversation found
          </h3>
          <button className="text-xs" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="modal modal-open fixed z-50 flex justify-center items-center">
      <div
        className="modal-box flex flex-col text-center gap-2 rounded-lg bg-base-100 min-w-64 p-3"
      >
        <AnswerBox conversation={currentConversation} />
        <button className="text-xs" onClick={onClose}>Close</button>
      </div>
    </div>
  );
});

export default TestModal;