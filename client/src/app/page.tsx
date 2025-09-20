"use client";

import { faker } from "@faker-js/faker/locale/en";
import React, {
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
  useMemo,
} from "react";

// utils
import { calcWPM, capitalize } from "@/utils/helper";

// components
import Result from "@/components/home/Result";
import Signup from "@/components/Signup";
import Settings from "@/components/home/Settings";
import { StateContext } from "@/contexts/state";
import Login from "@/components/Login";
import ProgressModal from "@/components/ProgressModal";
import Scoreboard from "@/components/home/scoreboard/Scoreboard";
import Disclaimer from "@/components/Disclaimer";

const Home = () => {
  const { state, dispatch } = useContext(StateContext);

  const { showLogin, showSignup, presets, viewProgress } = state;
  const { wordNumber, difficulty, error, result } = presets;

  const typingContainer = useRef<HTMLDivElement>(null);

  // State to track focus
  const [isFocused, setIsFocused] = useState(false);

  const [text, setText] = useState<string[]>([]);
  const [pointer, setPointer] = useState(0);
  const [errPointer, setErrPointer] = useState(-1);
  const [shouldShow, setShouldShow] = useState<"true" | "false">("false");

  // Tracking time
  const [startTime, setStartTime] = useState(0);

  const [showResult, setShowResult] = useState(false);

  const allowedPattern = useMemo(() => /^[a-zA-Z0-9!,.?_\- ]$/, []);

  const reset = useCallback(() => {
    let newText: string[] = [];

    if (difficulty === "easy") {
      newText = faker.word.words(wordNumber).split("");
    } else if (difficulty === "medium") {
      const splittedText = faker.word.words(wordNumber).split(" ");

      newText = [...capitalize(splittedText)];
    } else {
      const splittedText = faker.lorem.words(wordNumber).split(" ");

      newText = [...capitalize(splittedText)];
    }

    setText(newText);
    setPointer(0);
    dispatch({ type: "SET_ERROR", payload: 0 });
    setStartTime(0);
    dispatch({ type: "SET_RESULT", payload: -1 });
    setShowResult(false);
  }, [difficulty, dispatch, wordNumber]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

    useEffect(() => {
        const disclaimerDismissed = localStorage.getItem('disclaimerDismissed');
        let timeout: NodeJS.Timeout
        if (disclaimerDismissed === "false") {
           timeout = setTimeout(() => setShouldShow("true"), 2000)
        }

        return () => {
          if (timeout) {
            clearTimeout(timeout)
          }
        }
    }, []);

  useEffect(() => {
    dispatch({ type: "SET_UI_LOADED", payload: true });
  }, [dispatch]);

  useEffect(() => {
    reset();
  }, [reset]);

  const handleInput = useCallback(
    (e: KeyboardEvent) => {
      // test for allowed keys
      if (!allowedPattern.test(e.key)) return;

      // prevent default actions like space moving the scrollbar
      e.preventDefault();

      if (pointer === 0) {
        const time = new Date().getTime();
        setStartTime(time);
      }

      // test if correct key was pressed
      if (e.key !== text[pointer]) {
        if (pointer !== errPointer) {
          dispatch({ type: "SET_ERROR", payload: error + 1 });
          setErrPointer(pointer);
        }
        return;
      }

      if (pointer === text.length - 1) {
        const endtime = new Date().getTime();
        const timeTaken = endtime - startTime;
        const wpm = calcWPM(timeTaken, text.length, error);
        dispatch({ type: "SET_RESULT", payload: wpm });
        setShowResult(true);
        return;
      }

      setPointer((prev) => prev + 1);
    },
    [allowedPattern, dispatch, errPointer, error, pointer, startTime, text],
  );

  useEffect(() => {
    const typingEl = typingContainer.current;
    typingEl?.addEventListener("keypress", handleInput);

    if (result > -1) {
      typingEl?.removeEventListener("keypress", handleInput);
    }

    return () => {
      typingEl?.removeEventListener("keypress", handleInput);
    };
  }, [handleInput, result]);

  useEffect(() => {
    typingContainer.current?.focus();
    setIsFocused(true);
  }, [text, difficulty]);

  return (
    <section className="grid grid-cols-10 gap-4 h-full">
      <div className="col-span-7 flex flex-col">
        <Settings />

        <div
          ref={typingContainer}
          tabIndex={0}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="grow relative tracking-wide leading-relaxed py-4 mt-2 px-3 focus:outline-none"
          autoFocus
        >
          {text.map((letter, index) => {
            return (
              <span
                key={letter + index}
                className={`ml-[3px] font-semibold lg:text-lg border-slate-400 ${letter === " " && "px-[2px]"} ${index === pointer && "text-orange-500 border-b"} ${index < pointer && "text-slate-400"}`}
              >
                {letter}
              </span>
            );
          })}

          {!isFocused && !showResult && (
            <div className="absolute top-0 left-0 h-full w-full z-10">
              <div className="h-full w-full bg-slate-600/20 rounded-lg backdrop-blur-sm hv-center"></div>
              <div className="absolute top-0 left-0 w-full h-full hv-center cursor-pointer">
                <p className="text-xl font-semibold">Click to continue</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {showResult && (
        <Result
          charCount={text.length}
          reset={reset}
          setShowResult={setShowResult}
        />
      )}

      {showSignup && <Signup func={reset} />}

      {showLogin && <Login func={reset} />}

      {viewProgress && <ProgressModal />}

      <div className="col-span-3">
        <Scoreboard />
      </div>

      {
        shouldShow === "true" && <Disclaimer setShouldShow={setShouldShow} />
      }
    </section>
  );
};

export default React.memo(Home);
