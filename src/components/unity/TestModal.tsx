export default function TestModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal modal-open fixed z-50 flex justify-center items-center">
      <div className=" modal-box flex flex-col text-center gap-2 rounded-lg bg-base-100 min-w-64 p-3">
        <h3 className="text-8xl text-red-600 font-bold text-center">YOU DIED</h3>
        <p className="text-xs">Haha JK</p>
        {/* <input type="text" placeholder="Try enter here"></input> */}
        <button className="text-xs" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
