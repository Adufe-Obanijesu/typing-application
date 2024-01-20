"use client";

import React from "react";

interface dismiss {
  children: React.ReactNode;
  dismiss: () => void;
}

const Modal = ({ children, dismiss }: dismiss) => {
  return (
    <section className="fixed top-0 left-0 h-screen w-screen hv-center z-30">
      <div
        className="bg-black bg-opacity-50 absolute top-0 left-0 h-screen w-screen z-0 cursor-pointer"
        onClick={dismiss}
      />

      {children}
    </section>
  );
};

export default Modal;
