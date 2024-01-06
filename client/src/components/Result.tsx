"use client"

import { StateContext } from "@/contexts/state";
import React, { useContext } from "react";

type props = {
    charCount: number
    reset: () => void
    setShowResult: React.Dispatch<React.SetStateAction<boolean>>
}

const Result = ({ charCount, reset, setShowResult }: props) => {

    const { state, dispatch } = useContext(StateContext);
    const { darkMode, presets, signedIn } = state;
    const { result, error } = presets;
    
    const accuracy = Math.round(((charCount - error) / charCount) * 100);
    
    const registerScore = () => {
        setShowResult(false);
        if (!signedIn) {
            dispatch({ type: "SHOW_SIGNUP", payload: true })
        }
    }

  return (
    <section className="fixed top-0 left-0 h-screen w-screen hv-center">
        <div className="bg-black bg-opacity-50 absolute top-0 left-0 h-screen w-screen z-0 cursor-pointer" onClick={reset} />
        
        <div className={`z-10 relative md:rounded-2xl md:shadow-lg md:px-16 px-8 py-12 lg:w-1/3 md:w-2/3 h-full md:h-auto ${darkMode ? "secondaryDarkBg" : "secondaryLightBg"}`}>
        <div className="flex flex-col justify-between md:block h-full">
            <div>
                <div className="h-center">
                    <div className={`w-48 h-48 hv-center rounded-full text-center ${darkMode ? "darkBg" : "lightBg"}`}>
                        <span className="text-5xl font-bold">
                            {result}
                            <br />
                            WPM
                        </span>
                    </div>
                </div>
            
            </div>

            <div className="h-center">
                <span className="">Error : </span>
                {error}
            </div>

            <div className="h-center">
                <span className="">Accuracy : </span>
                {accuracy}%
            </div>

            {
                !signedIn && <button
                className="bg-orange-600 mt-4 w-full text-center text-white rounded-md py-3 focus:outline-none"
                onClick={registerScore}
                >
                Register Score
                </button>
            }

            <button
            className="bg-slate-900 mt-4 w-full text-center text-white rounded-md py-3 focus:outline-none"
            onClick={reset}
            autoFocus
            >
            Dismiss message
            </button>
        </div>
        </div>
    </section>
  );
}

export default Result;
