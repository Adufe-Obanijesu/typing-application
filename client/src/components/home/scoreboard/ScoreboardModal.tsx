"use client";

import Modal from "@/components/Modal";
import { StateContext } from "@/contexts/state";
import { useContext, useState, useCallback, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import UserScore from "./UserScore";
import { errorNotification } from "@/utils/notifications";
import { ClipLoader } from "react-spinners";
import { override, overrideLight } from "@/utils/cliploader";

type nav = "top10" | "all" | "myPos";

const ScoreboardModal = ({
  setModal,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { state } = useContext(StateContext);
  const { darkMode, presets, user } = state;
  const { difficulty } = presets;

  const [nav, setNav] = useState<nav>("top10");
  const [scopedDifficulty, setScopedDifficulty] = useState("");
  const [response, setResponse] = useState([]);
  const [position, setPosition] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setScopedDifficulty(difficulty);
  }, [difficulty]);

  const fetchTop10 = useCallback(
    (signal: AbortSignal) => {
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
          `${process.env.NEXT_PUBLIC_SERVER}/scoreboard/top?difficulty=${scopedDifficulty}&number=10`,
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
    [scopedDifficulty],
  );

  const fetchAll = useCallback(
    (signal: AbortSignal) => {
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
          `${process.env.NEXT_PUBLIC_SERVER}/scoreboard/all?difficulty=${scopedDifficulty}`,
          config,
        )
        .then((response) => {
          setResponse(response.data.scoreboard);
        })
        .catch((err) => {
          if (!axios.isCancel(err)) {
            errorNotification(
              "Error fetching scoreboard. Please check your internet connection!",
            );
            console.log(err);
          }
        })
        .finally(() => setLoading(false));
    },
    [scopedDifficulty],
  );

  const fetchMyPos = useCallback(
    (token: string, signal: AbortSignal) => {
      if (!user) {
        setResponse([]);
        return;
      }
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
          `${process.env.NEXT_PUBLIC_SERVER}/scoreboard/myPos?difficulty=${scopedDifficulty}&number=${3}`,
          config,
        )
        .then((response) => {
          const findUser = response.data.scoreboard.findIndex(
            (eachUser: any) => eachUser._id === user._id,
          );

          if (findUser < 0) {
            return;
          }
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
    [scopedDifficulty, user],
  );

  useEffect(() => {
    if (scopedDifficulty === "") return;

    const controller = new AbortController();
    const { signal } = controller;

    if (nav === "top10") {
      fetchTop10(signal);
    } else if (nav === "all") {
      fetchAll(signal);
    } else {
      const token = localStorage.getItem("typingToken");

      if (!token) {
        return;
      }

      fetchMyPos(token, signal);
    }

    return () => {
      controller.abort();
      setResponse([]);
    };
  }, [nav, fetchAll, fetchMyPos, fetchTop10, scopedDifficulty]);

  const dismissModal = () => {
    setModal(false);
  };

  const searchResult = debounce((value: string) => {}, 500, {
    trailing: true,
    leading: true,
  });

  const mSearchResult = useCallback(
    (value: string) => searchResult(value),
    [searchResult],
  );

  const searchWord = (value: string) => {
    setSearch(value);
    mSearchResult(value);
  };

  const getIndex = useMemo(() => {
    if (response.length > 0 && user) {
      return response.findIndex(
        (eachResponse: any) => eachResponse._id === user._id,
      );
    }
    return -1;
  }, [response, user]);

  return (
    <Modal dismiss={dismissModal}>
      <div
        className={`z-10 relative md:rounded-2xl md:shadow-lg md:px-10 px-5 py-12 lg:w-1/3 md:w-2/3 max-h-[90%] min-h-[90%] flex flex-col gap-4 md:h-auto ${darkMode ? "secondaryDarkBg" : "secondaryLightBg"}`}
      >
        <ul className="flex justify-around gap-4">
          <li
            className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${nav === "top10" && "border-b-2 border-slate-400 font-semibold"}`}
            onClick={() => setNav("top10")}
          >
            Top 10
          </li>
          <li
            className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${nav === "all" && "border-b-2 border-slate-400 font-semibold"}`}
            onClick={() => setNav("all")}
          >
            All
          </li>
          <li
            className={`py-1 transitionItem cursor-pointer ${darkMode ? "hover:text-white" : "hover:text-black hover:font-semibold"} ${nav === "myPos" && "border-b-2 border-slate-400 font-semibold"}`}
            onClick={() => setNav("myPos")}
          >
            My Position
          </li>
        </ul>

        <div
          className={`transitionItem py-2 px-4 rounded-lg dark:bg-slate-700 ${darkMode ? "bg-slate-700" : "bg-slate-200"}`}
        >
          <div className="flex gap-4 items-center">
            <input
              type="text"
              className="grow bg-transparent focus:outline-none"
              placeholder="Name"
              value={search}
              onChange={(e) => searchWord(e.target.value)}
              autoFocus
            />

            <select
              className="focus:outline-none cursor-pointer bg-transparent"
              onChange={(e) => setScopedDifficulty(e.target.value)}
              value={scopedDifficulty}
            >
              <option
                className={`dark:bg-slate-800 ${darkMode ? "darkBg" : "lightBg"} dark:bg-slate-800`}
                value="easy"
              >
                Easy
              </option>
              <option
                className={`dark:bg-slate-800 ${darkMode ? "darkBg" : "lightBg"} dark:bg-slate-800`}
                value="medium"
              >
                Medium
              </option>
              <option
                className={`dark:bg-slate-800 ${darkMode ? "darkBg" : "lightBg"} dark:bg-slate-800`}
                value="hard"
              >
                Hard
              </option>
            </select>
          </div>
        </div>

        <div className="grow overflow-y-scroll custom-scrollbar pr-2 flex flex-col gap-2">
          {loading && (
            <div className="hv-center">
              <ClipLoader
                size={30}
                cssOverride={darkMode ? override : overrideLight}
              />
            </div>
          )}

          {response.length > 0 &&
            !loading &&
            nav !== "myPos" &&
            response.map((eachResponse: any, index: number) => {
              if (user) {
                if (eachResponse._id === user._id)
                  return (
                    <UserScore
                      key={eachResponse._id}
                      name={`${eachResponse.firstName} ${eachResponse.lastName}`}
                      position={index + 1}
                      score={eachResponse.scores[scopedDifficulty].highScore}
                      isMe
                    />
                  );
              }

              return (
                <UserScore
                  key={eachResponse._id}
                  name={`${eachResponse.firstName} ${eachResponse.lastName}`}
                  position={index + 1}
                  score={eachResponse.scores[scopedDifficulty].highScore}
                />
              );
            })}

          {response.length <= 0 && !loading && !user && <h4>Please log in</h4>}

          {response.length <= 0 && !loading && user && (
            <h4>You have no record for level {scopedDifficulty}</h4>
          )}

          {response.length > 0 &&
            user &&
            !loading &&
            nav === "myPos" &&
            response.map((eachResponse: any, index) => {
              let pos;

              if (user._id === eachResponse._id) {
                pos = position;
              } else if (getIndex > index) {
                pos = position - (getIndex - index);
              } else {
                pos = position + (index - getIndex);
              }

              if (user && user._id === eachResponse._id) {
                return (
                  <UserScore
                    key={eachResponse._id}
                    name={`${eachResponse.firstName} ${eachResponse.lastName}`}
                    score={eachResponse.scores[scopedDifficulty].highScore}
                    position={pos}
                    isMe
                  />
                );
              }
              return (
                <UserScore
                  key={eachResponse._id}
                  name={`${eachResponse.firstName} ${eachResponse.lastName}`}
                  score={eachResponse.scores[scopedDifficulty].highScore}
                  position={pos}
                />
              );
            })}
        </div>
      </div>
    </Modal>
  );
};

export default ScoreboardModal;
