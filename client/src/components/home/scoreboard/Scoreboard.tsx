import {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  memo,
  useRef,
} from "react";
import UserScore from "./UserScore";

import axios from "axios";
import { errorNotification } from "@/utils/notifications";
import { ClipLoader } from "react-spinners";
import { override, overrideLight } from "@/utils/cliploader";
import { StateContext } from "@/contexts/state";
import ScoreboardModal from "./ScoreboardModal";

const Scoreboard = () => {
  const { state, dispatch } = useContext(StateContext);
  const { darkMode, user } = state;
  const { result, difficulty } = state.presets;

  const hasFetchedTop5 = useRef(false);

  const [response, setResponse] = useState([]);
  const [position, setPosition] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [prevDifficulty, setPrevDifficulty] = useState("");

  // scoreboard modal
  const [modal, setModal] = useState(false);

  const fetchScoreBoard = useCallback(
    (signal: AbortSignal) => {
      const allScores = user && user?.scores[difficulty].scores;
      hasFetchedTop5.current = false;
      // we need to check the last one before the current score to check if higher
      if (
        result > 0 ||
        (prevDifficulty == difficulty && allScores[allScores.length - 1]?.score !==
          user?.scores[difficulty]?.highScore)
      ) {
        setLoading(false);
        return;
      }

      setPrevDifficulty(difficulty);

      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("typingToken")}`,
        },
        signal,
      };

      axios
        .get(
          `${process.env.NEXT_PUBLIC_SERVER}/scoreboard/myPos?difficulty=${difficulty}&number=${2}`,
          config,
        )
        .then((response) => {
          setResponse(response.data.scoreboard);
          setPosition(response.data.position);
        })
        .catch((err: any) => {
          if (!axios.isCancel(err)) {
            console.log(err);
            errorNotification(
              "Error getting scoreboard. Please check your internet connection!",
            );
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [difficulty, result, user],
  );

  const fetchTop5 = useCallback(
    (signal: AbortSignal) => {
      if (hasFetchedTop5.current) {
        setLoading(false);
        return;
      }

      hasFetchedTop5.current = true;

      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        signal,
      };
      setLoading(true);

      axios
        .get(
          `${process.env.NEXT_PUBLIC_SERVER}/scoreboard/top?difficulty=${difficulty}&number=5`,
          config,
        )
        .then((response) => {
          setResponse(response.data.scoreboard);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            console.error(err);
            errorNotification(
              "Error fetching scoreboard. Please check your internet connection!",
            );
          }
        })
        .finally(() => setLoading(false));
    },
    [difficulty],
  );

  const getIndex = useMemo(() => {
    if (response.length > 0 && user) {
      return response.findIndex(
        (eachResponse: any) => eachResponse._id === user._id,
      );
    }
    return -1;
  }, [response, user]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    if (!user) {
      fetchTop5(signal);
      return;
    }

    fetchScoreBoard(signal);

    return () => {
      controller.abort();
    };
  }, [fetchScoreBoard, fetchTop5, user]);

  return (
    <aside className="px-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="lg:text-xl text-md font-bold">Scoreboard</h3>

        <button
          className="bg-orange-500 hover:bg-orange-600 p-4 py-1 text-white rounded-lg"
          onClick={() => setModal(true)}
        >
          View
        </button>
      </div>

      <ul className="flex justify-between">
        <li
          className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${difficulty === "easy" && "border-b-2 border-slate-400 font-semibold"}`}
          onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "easy" })}
        >
          Easy
        </li>
        <li
          className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${difficulty === "medium" && "border-b-2 border-slate-400 font-semibold"}`}
          onClick={() =>
            dispatch({ type: "SET_DIFFICULTY", payload: "medium" })
          }
        >
          Medium
        </li>
        <li
          className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${difficulty === "hard" && "border-b-2 border-slate-400 font-semibold"}`}
          onClick={() => dispatch({ type: "SET_DIFFICULTY", payload: "hard" })}
        >
          Hard
        </li>
      </ul>

      <ul className="mt-4 flex flex-col gap-2">
        {loading && (
          <div className="flex h-center">
            <ClipLoader
              size={40}
              loading={loading}
              cssOverride={darkMode ? override : overrideLight}
            />
          </div>
        )}

        {!user && !loading && (
          <h4 className="font-semibold text-md">
            Please log in to check your position
          </h4>
        )}

        {response.length <= 0 && !loading && user && <h4>No records</h4>}

        {response.length > 0 &&
          !loading &&
          response.map((eachResponse: any, index) => {
            // initialize position if fetching top 5 instead of user's position
            let pos = index + 1;

            if (user) {
              if (position > 0) {
                if (user._id === eachResponse._id) {
                  pos = position;
                } else if (getIndex > index) {
                  pos = position - (getIndex - index);
                } else {
                  pos = position + (index - getIndex);
                }
              }

              if (user && user._id === eachResponse._id) {
                return (
                  <UserScore
                    key={eachResponse._id}
                    name={`${eachResponse.firstName} ${eachResponse.lastName}`}
                    score={eachResponse.scores[difficulty].highScore}
                    position={pos || index + 1}
                    isMe
                  />
                );
              }
            }
            return (
              <UserScore
                key={eachResponse._id}
                name={`${eachResponse.firstName} ${eachResponse.lastName}`}
                score={eachResponse.scores[difficulty].highScore}
                position={pos || index + 1}
              />
            );
          })}
      </ul>

      {modal && <ScoreboardModal setModal={setModal} />}
    </aside>
  );
};

export default memo(Scoreboard);
