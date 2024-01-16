import { useContext, useEffect, useState, useMemo } from "react";
import UserScore from "./UserScore";

import axios from "axios"
import { errorNotification } from "@/utils/notifications";
import { ClipLoader } from "react-spinners";
import { override, overrideLight } from "@/utils/cliploader";
import { StateContext } from "@/contexts/state";
import ScoreboardModal from "./ScoreboardModal";

const Scoreboard = () => {

    const { state, dispatch } = useContext(StateContext);
    const { darkMode, user } = state;
    const { result, difficulty } = state.presets;

    const [ response, setResponse ] = useState([]);
    const [ position, setPosition ] = useState(-1);
    const [ loading, setLoading ] = useState(true);

    // scoreboard modal
    const [ modal, setModal ] = useState(false);

    const fetchScoreBoard = (signal: AbortSignal) => {
        
        const allScores = user && user?.scores[difficulty].scores;
        
        // we need to check the last one before the current score to check if higher
        if (!user || (result > 0 && allScores[allScores.length - 1] !== user?.scores[difficulty]?.highScore)) {
            setLoading(false);
            return;
        };

        setLoading(true);

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("typingToken")}`,
            },
            signal,
        }

        axios.get(`${process.env.NEXT_PUBLIC_SERVER}/scoreboard/myPos?difficulty=${difficulty}&number=${2}`, config)
        .then(response => {
            setResponse(response.data.scoreboard);
            setPosition(response.data.position);
        })
        .catch((err: any) => {
            if (!axios.isCancel(err)) {
                console.log(err);
                errorNotification("Error getting scoreboard. Please check your internet connection!");
            }
        })
        .finally(() => {
            setLoading(false);
        })
    }

    const getIndex = useMemo(() => {
        if (response.length > 0 && user) {
            return response.findIndex((eachResponse: any) => eachResponse._id === user._id);
        }
        return -1;
    }, [response]);

    useEffect(() => {
        const controller = new AbortController();
        const { signal } = controller;
        fetchScoreBoard(signal);

        return () => {
            controller.abort();
        }
    }, [difficulty, user]);

    return (
        <aside className="px-4">
            
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-bold mb-2">Scoreboard</h3>
                {
                    user && <button className="bg-orange-500 hover:bg-orange-600 p-4 py-1 text-white rounded-lg" onClick={() => setModal(true)}>View</button>
                }  
            </div>

            <ul className="flex justify-between">
                <li className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${difficulty === "easy" && "border-b-2 border-slate-400 font-semibold"}`} onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "easy" })}>Easy</li>
                <li className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${difficulty === "medium" && "border-b-2 border-slate-400 font-semibold"}`} onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "medium" })}>Medium</li>
                <li className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${difficulty === "hard" && "border-b-2 border-slate-400 font-semibold"}`} onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "hard" })}>Hard</li>
            </ul>

            <ul className="mt-4 flex flex-col gap-2">

                {
                    loading && <div className="flex h-center"><ClipLoader size={40} loading={loading} cssOverride={darkMode ? override : overrideLight} /></div>
                }

                {
                    (!user && !loading) && <h4>Please log in</h4>
                }

                {
                    (response.length <= 0 && !loading && user) && <h4>No records</h4>
                }

                {
                    (response.length > 0 && !loading && user) && response.map((eachResponse: any, index) => {
                        let pos;

                        if (user._id === eachResponse._id) {
                            pos = position;
                        } else if (getIndex > index) {
                            pos = position - (getIndex - index);
                        } else {
                            pos = position + (index - getIndex);
                        }

                        if (user && (user._id === eachResponse._id)) {
                            return <UserScore key={eachResponse._id} name={`${eachResponse.firstName} ${eachResponse.lastName}`} score={eachResponse.scores[difficulty].highScore} position={pos} isMe />
                        }
                        return <UserScore key={eachResponse._id} name={`${eachResponse.firstName} ${eachResponse.lastName}`} score={eachResponse.scores[difficulty].highScore} position={pos} />
                    })
                }
            </ul>

            {
                modal && <ScoreboardModal setModal={setModal} />
            }

        </aside>
    )
}

export default Scoreboard;