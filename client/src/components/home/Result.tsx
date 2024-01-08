"use client"

import { StateContext } from "@/contexts/state";
import { errorNotification } from "@/utils/notifications";
import axios from "axios";
import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import Modal from "../Modal";

type props = {
    charCount: number
    reset: () => void
    setShowResult: React.Dispatch<React.SetStateAction<boolean>>
}

const Result = ({ charCount, reset, setShowResult }: props) => {

    const { state, dispatch } = useContext(StateContext);
    const { darkMode, presets, signedIn } = state;
    const { result, error, difficulty } = presets;

    const [ loading, setLoading ] = useState(false);

    const hasRendered = useRef(false);
    
    const accuracy = Math.round(((charCount - error) / charCount) * 100);
    
    const signin = () => {

        if (!signedIn) {
            dispatch({ type: "SHOW_LOGIN", payload: true })
            setShowResult(false);
        }
    }

    const registerScore = () => {
        if (signedIn) {
            setLoading(true);
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": localStorage.getItem("typingToken"),
                }
            };
    
            const data = {
                score: result,
                difficulty,
            }
            axios.put(`${process.env.NEXT_PUBLIC_SERVER}/user/registerScore`, data, config)
            .then((response: any) => {
                dispatch({ type: "SET_USER", payload: response.data.user });
            })
            .catch(() => {
                errorNotification("Error registering score");
            })
            .finally(() => {
                setLoading(false);
            })
        }
    }

    
    useEffect(() => {
        if (hasRendered.current) return
        registerScore();
        hasRendered.current = true;
    }, []);

    const dismissModal = () => {
        if (!loading) {
            reset();
        }
    }

  return (
    <Modal dismiss={dismissModal}>
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
                    onClick={signin}
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
    </Modal>
  );
}

export default Result;
