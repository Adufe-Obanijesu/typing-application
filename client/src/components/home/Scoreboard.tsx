import { useContext, useEffect, useState } from "react";
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
        })
        .catch((err: any) => {
            console.log(err);
            errorNotification("Error getting scoreboard");
        })
        .finally(() => {
            setLoading(false);
        })
    }

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
                    (response.length > 0 && !loading && user) && response.map((eachResponse: any) => {

                        if (user && (user._id === eachResponse._id)) {
                            return <UserScore key={eachResponse._id} name={`${eachResponse.firstName} ${eachResponse.lastName}`} score={eachResponse.scores[difficulty].highScore} position={2} isMe />
                        }
                        return <UserScore key={eachResponse._id} name={`${eachResponse.firstName} ${eachResponse.lastName}`} score={eachResponse.scores[difficulty].highScore} position={2} />
                    })
                }
            </ul>

        </aside>
    )
}

export default Scoreboard;