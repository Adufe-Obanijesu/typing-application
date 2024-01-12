"use client"

import Modal from "@/components/Modal";
import { StateContext } from "@/contexts/state";
import { useContext, useState, useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import UserScore from "./UserScore";

type nav = "top10" | "all" | "myPos";

const ScoreboardModal = ({ setModal }: { setModal: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const { state } = useContext(StateContext);
    const { darkMode, presets, user } = state;
    const { difficulty } = presets;

    const [ nav, setNav ] = useState<nav>("top10");
    const [ response, setResponse ] = useState([]);
    const [ search, setSearch ] = useState("");
    const [ loading, setLoading ] = useState(false);

    
    useEffect(() => {

        const token = localStorage.getItem("typingToken");

        if (!token) {
            // Handle the case where the token is not present (user not authenticated)
            return;
        }
    
        const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    }
        setLoading(true);
        const data = {
            difficulty,
        }
        axios.post(`${process.env.NEXT_PUBLIC_SERVER}/scoreboard/top10`, data, config)
        .then(response => {
            setResponse(response.data.scoreboard);
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }, [nav]);

    const dismissModal = () => {
        setModal(false);
    }

    const searchResult = debounce((value: string) => {

        
    }, 500, { trailing: true, leading: true });

    const mSearchResult = useCallback((value: string) => searchResult(value), []);

    const searchWord = (value: string) => {
        setSearch(value);
        mSearchResult(value);
    }

    return (
        <Modal dismiss={dismissModal}>
            <div className={`z-10 relative md:rounded-2xl md:shadow-lg md:px-10 px-5 py-12 lg:w-1/3 md:w-2/3 max-h-[90%] flex flex-col gap-4 md:h-auto ${darkMode ? "secondaryDarkBg" : "secondaryLightBg"}`}>
                <ul className="flex justify-around gap-4">
                    <li className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${nav === "top10" && "border-b-2 border-slate-400 font-semibold"}`} onClick={() => setNav("top10")}>Top 10</li>
                    <li className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${nav === "all" && "border-b-2 border-slate-400 font-semibold"}`} onClick={() => setNav("all")}>All</li>
                    <li className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${nav === "myPos" && "border-b-2 border-slate-400 font-semibold"}`} onClick={() => setNav("myPos")}>My Position</li>
                </ul>

                <div className={`transitionItem py-2 px-4 rounded-lg dark:bg-slate-700 ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}>
                    <div className="flex gap-4 items-center">
                        <input type="text" className="grow bg-transparent focus:outline-none" placeholder="Enter your word" value={search} onChange={e => searchWord(e.target.value)} autoFocus />
                    </div>
                </div>

                <div className="grow overflow-y-scroll custom-scrollbar pr-2 flex flex-col gap-2">
                    {
                        (response.length > 0 && user) && response.map((eachResponse: any, index: number) => {
                            if (eachResponse._id === user._id) return <UserScore key={eachResponse._id} name={`${eachResponse.firstName} ${eachResponse.lastName}`} position={index+1} score={eachResponse.scores[difficulty].highScore} isMe />
                            
                            return <UserScore key={eachResponse._id} name={`${eachResponse.firstName} ${eachResponse.lastName}`} position={index+1} score={eachResponse.scores[difficulty].highScore} />
                        })
                    }
                </div>

            </div>
        </Modal>
    )
}

export default ScoreboardModal;