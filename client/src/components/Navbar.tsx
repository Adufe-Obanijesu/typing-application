"use client";

import React, { useContext, useEffect, useRef, useState } from "react";

// Icons
import { FiMoon, FiSun } from "react-icons/fi";
import { FaRegKeyboard } from "react-icons/fa";
import { RxSpeakerLoud } from "react-icons/rx";
import { RxSpeakerOff } from "react-icons/rx";
import { HiOutlineUserCircle } from "react-icons/hi";

import { StateContext } from "@/contexts/state";


const Navbar = () => {

    const { state, dispatch } = useContext(StateContext);
    const { darkMode, user, song } = state;

    const [ audio, setAudio ] = useState(false);

    const buttonRef = useRef<HTMLButtonElement>(null);

    let music: HTMLAudioElement; // Declare music outside the useEffect to have a single instance

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && audio) {
      playMusic();
    } else if (document.visibilityState === 'hidden') {
      pauseMusic();
    }
  };

  const playMusic = () => {

    if (!music && song) {
      // Create the music instance if it doesn't exist
      music = new Audio(`/music/${song}.mp3`);
      music.loop = true;
    }
    // Check if it's paused before playing to avoid restarting if it's already playing
    if (music.paused && audio) {
      music.play();
    }
  };

  const pauseMusic = () => {
    if (music && !music.paused) {
      // Pause the music if it's playing
      music.pause();
    }
  };
  
  useEffect(() => {

    playMusic();

    // Attach event listener for visibility change
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup when component unmounts
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Pause and reset the music when the component unmounts
      if (music && !music.paused) {
        pauseMusic();
        music.currentTime = 0;
      }
    };
  }, [audio, song]);

    const changeMode = () => {
        localStorage.setItem("typingMode", `${!darkMode}`);
        dispatch({ type: "SET_MODE", payload: !darkMode });
        buttonRef.current?.blur();
    }

    const changeAudioPreset = () => {
        setAudio(!audio);
    }

    const changeMusicPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
        localStorage.setItem("typingSong", e.target.value);
        dispatch({ type: "SET_SONG", payload: e.target.value });
    }

    return (
        <nav className="mb-4">
            <div className="flex justify-between items-center py-2">
                <div>
                    <FaRegKeyboard className="text-4xl" />
                </div>

                <div className="flex items-center gap-4">

                    <div>
                    <select className="focus:outline-none cursor-pointer bg-transparent" onChange={changeMusicPreset} value={song}>
                        <option className={`dark:bg-slate-800 ${darkMode ? "darkBg" : "lightBg"} dark:bg-slate-800`} value="music 1">Music 1</option>
                        <option className={`dark:bg-slate-800 ${darkMode ? "darkBg" : "lightBg"} dark:bg-slate-800`} value="music 2">Music 2</option>
                        <option className={`dark:bg-slate-800 ${darkMode ? "darkBg" : "lightBg"} dark:bg-slate-800`} value="music 3">Music 3</option>
                    </select>
                    </div>

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
                             user ? <div className="bg-orange-500 hv-center w-10 h-10 rounded-full">
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