import React from "react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]"
        onClick={onClose}
      />

      {/* Modal box */}
      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-md z-[1001] min-w-[400px]"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
      >
        {children}
      </div>
    </>
  );
}
