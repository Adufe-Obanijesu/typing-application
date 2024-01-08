import { useContext, useEffect, useState, useMemo } from "react";
import UserScore from "./scoreboard/UserScore";

import axios from "axios"
import { errorNotification } from "@/utils/notifications";
import { ClipLoader } from "react-spinners";
import { override, overrideLight } from "@/utils/cliploader";
import { StateContext } from "@/contexts/state";

const Scoreboard = () => {

    const { state, dispatch } = useContext(StateContext);
    const { darkMode, user } = state;
    const { result, difficulty } = state.presets;

    const [ response, setResponse ] = useState([]);
    const [ position, setPosition ] = useState(-1);
    const [ loading, setLoading ] = useState(true);

    const fetchScoreBoard = () => {
        
        const allScores = user && user?.scores[difficulty].scores;

        // we need to check the last one before the current score to check if higher
        if (!user || (result > 0 && allScores[allScores.length - 1] !== user?.highScore)) {
            setLoading(false);
            return;
        };

        setLoading(true);

        const data = {
            difficulty,
            number: 2,
        }

        const config = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": localStorage.getItem("typingToken"),
            }
        }

        axios.post(`${process.env.NEXT_PUBLIC_SERVER}/user/scoreboard`, data, config)
        .then(response => {
            setResponse(response.data.scoreboard);
            setPosition(response.data.position);
        })
        .catch((err: any) => {
            console.log(err);
            errorNotification("Error getting scoreboard");
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
            fetchScoreBoard();
    }, [difficulty, user]);

    return (
        <aside className="px-4">
            
            <h3 className="text-xl font-bold mb-2">Scoreboard</h3>

            <ul className="flex justify-between">
                <li className={`py-1 transitionItem cursor-pointer hover:text-white ${difficulty === "easy" && "border-b-2"}`} onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "easy" })}>Easy</li>
                <li className={`py-1 transitionItem cursor-pointer hover:text-white ${difficulty === "medium" && "border-b-2"}`} onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "medium" })}>Medium</li>
                <li className={`py-1 transitionItem cursor-pointer hover:text-white ${difficulty === "hard" && "border-b-2"}`} onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "hard" })}>Hard</li>
            </ul>

            <ul className="mt-4 flex flex-col gap-2">

                {
                    loading && <div className="flex h-center"><ClipLoader size={40} loading={loading} cssOverride={darkMode ? override : overrideLight} /></div>
                }

                {
                    !user && !loading && <h4>Please log in</h4>
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

        </aside>
    )
}

export default Scoreboard;