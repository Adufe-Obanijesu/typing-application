"use client"

import { StateContext } from "@/contexts/state";
import React, { useContext } from "react";

interface props {
    input: string
    setInput: (e: React.ChangeEvent<HTMLInputElement>) => void
    name: string
    value: string
    type?: string
}

const Input = ({ input, setInput, value, name, type="text" }: props) => {

  const { state } = useContext(StateContext);
  const { darkMode } = state;

  return (
      <input
        type={type}
        className={`${darkMode ? "secondaryDarkBg" : "secondaryLightBg" } p-4 w-full rounded-lg focus:outline-none mb-3`}
        value={value}
        placeholder={name}
        name={input}
        onChange={setInput}
        required
      />
  );
};

export default React.memo(Input);
