"use client";

import React, { useContext, useRef } from "react";

// Icons
import { FiMoon, FiSun } from "react-icons/fi";
import { FaRegKeyboard } from "react-icons/fa";
import { RxSpeakerLoud } from "react-icons/rx";
import { RxSpeakerOff } from "react-icons/rx";
import { HiOutlineUserCircle } from "react-icons/hi";

import { StateContext } from "@/contexts/state";


const Navbar = () => {

    const { state, dispatch } = useContext(StateContext);
    const { darkMode, audio, user, signedIn } = state;

    const buttonRef = useRef<HTMLButtonElement>(null);

    const changeMode = () => {
        localStorage.setItem("typingMode", `${!darkMode}`);
        dispatch({ type: "SET_MODE", payload: !darkMode });
        buttonRef.current?.blur();
    }

    const changeAudioPreset = () => {
        localStorage.setItem("audioPreset", `${!audio}`);
        dispatch({ type: "SET_AUDIO_SETTING", payload: !audio });
    }

    return (
        <nav className="">
            <div className="flex justify-between items-center py-2">
                <div>
                    <FaRegKeyboard className="text-4xl" />
                </div>

                <div className="flex items-center gap-4">

                    <div>
                        {
                            audio ? <RxSpeakerLoud className="cursor-pointer text-xl" onClick={changeAudioPreset} /> : <RxSpeakerOff className="cursor-pointer text-xl" onClick={changeAudioPreset} />
                        }
                        
                    </div>

                    <div className="flex gap-2 items-center">
                        <button ref={buttonRef} className="bg-gray-700 p-1 rounded-full w-10 h-6 flex items-center cursor-pointer dark:hidden" onClick={changeMode}>
                            <div className={`h-4 w-4 bg-slate-50 rounded-full transition ease-in duration-100 ${darkMode && "translate-x-4"} dark:translate-x-4`}></div>
                        </button>
                        <FiMoon className="cursor-pointer text-xl hidden dark:block" />

                        <div className="hidden dark:block">
                            Device is in dark mode
                        </div>

                        {
                            !darkMode ? <FiSun className="cursor-pointer text-xl dark:hidden" onClick={changeMode} /> : <FiMoon className="cursor-pointer text-xl dark:hidden" onClick={changeMode} />
                        }
                    </div>
                    
                    <div>
                        
                            {
                                (signedIn && user) ? <div className="bg-orange-500 hv-center w-10 h-10 rounded-full">
                                    <div className="text-lg font-semibold uppercase text-white">{user.firstName[0]}{user.lastName[0]}</div>
                                    </div> : <HiOutlineUserCircle className="inline cursor-pointer text-2xl" />
                            }
                        
                    </div>
                    
                </div>
            </div>
        </nav>
    )
}

export default Navbar;