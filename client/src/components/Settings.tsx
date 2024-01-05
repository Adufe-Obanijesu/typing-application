"use client"

import { StateContext } from "@/contexts/state";
import React, { useContext } from "react";

type props = {
    difficulty: string
    setDifficulty: React.Dispatch<React.SetStateAction<string>>
    wordNumber: number
    error: number
    setWordNumber: React.Dispatch<React.SetStateAction<number>>
}

const Settings = () => {

    const { state, dispatch } = useContext(StateContext);
    const { darkMode } = state;
    const { wordNumber, difficulty, error } = state.presets;

    return (
        <div className="border-b border-slate-400 py-2 flex justify-end gap-4">
            
            <div className="flex gap-1">
                <span>
                    Error :
                </span>

                <span>
                    {error}
                </span>
            </div>

            <div>
            <select className="focus:outline-none cursor-pointer bg-transparent" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => dispatch({ type: "SET_DIFFICULTY", payload: e.target.value })} value={difficulty}>
                <option className={`dark:bg-slate-800 ${darkMode && "darkBg"} dark:bg-slate-800`} value="easy">Easy</option>
                <option className={`dark:bg-slate-800 ${darkMode && "darkBg"}} dark:bg-slate-800`} value="medium">Medium</option>
                <option className={`dark:bg-slate-800 ${darkMode && "darkBg"}} dark:bg-slate-800`} value="hard">Hard</option>
            </select>
            </div>

            <div className="flex gap-1">
                <span>
                    No of Words :
                </span>

                <select className="focus:outline-none cursor-pointer bg-transparent" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => dispatch({ type: "SET_WORD_NUMBER", payload: Number(e.target.value) })} value={wordNumber}>
                    <option className={`dark:bg-slate-800 ${darkMode && "darkBg"}} dark:bg-slate-800`} value={20}>20</option>
                    <option className={`dark:bg-slate-800 ${darkMode && "darkBg"}} dark:bg-slate-800`} value={30}>30</option>
                    <option className={`dark:bg-slate-800 ${darkMode && "darkBg"}} dark:bg-slate-800`} value={40}>40</option>
                    <option className={`dark:bg-slate-800 ${darkMode && "darkBg"}} dark:bg-slate-800`} value={50}>50</option>
                    <option className={`dark:bg-slate-800 ${darkMode && "darkBg"}} dark:bg-slate-800`} value={60}>60</option>
                </select>
            </div>
        </div>
    )
}

export default Settings