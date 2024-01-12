"use client"

import { faker } from '@faker-js/faker/locale/en';
import React, { useEffect, useState, useContext, useRef } from 'react';

// utils
import { calcWPM, capitalize } from '@/utils/helper';

// components
import Result from '@/components/home/Result';
import Signup from '@/components/Signup';
import Settings from '@/components/home/Settings';
import { StateContext } from '@/contexts/state';
import Login from '@/components/Login';
import Scoreboard from '@/components/home/scoreboard/Scoreboard';

const Home = () => {

    const { state, dispatch } = useContext(StateContext);

    const { showLogin, showSignup, presets } = state;
    const { wordNumber, difficulty, error, result } = presets;

    const typingContainer = useRef<HTMLDivElement>(null);

    // State to track focus
    const [isFocused, setIsFocused] = useState(false);

    const [ text, setText ] = useState<string[]>([]);
    const [ pointer, setPointer ] = useState(0);
    const [ errPointer, setErrPointer ] = useState(-1);

    // Tracking time
    const [ startTime, setStartTime ] = useState(0);
    const [ endTime, setEndTime ] = useState(0);

    const [ showResult, setShowResult ] = useState(false);
    
    const allowedPattern = /^[a-zA-Z0-9!,.?_\- ]$/;

    const reset = () => {
        let newText: string[] = [];

        if (difficulty === "easy") {
            newText = faker.word.words(wordNumber).split("")
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
        setEndTime(0);
        dispatch({ type: "SET_RESULT", payload: -1 });
        setShowResult(false);
    }

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };
   

    useEffect(() => {
        reset();
    }, [wordNumber, difficulty]);

    const handleInput = (e: KeyboardEvent) => {

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

        setPointer(prev => prev + 1);
    }

    useEffect(() => {
        typingContainer.current?.addEventListener("keypress", handleInput);

        if (result > -1) {
            typingContainer.current?.removeEventListener("keypress", handleInput);
        }

        return () => {
            typingContainer.current?.removeEventListener("keypress", handleInput);
        }
    }, [text, pointer, errPointer, startTime, endTime, result]);

    useEffect(() => {
        typingContainer.current?.focus();
        setIsFocused(true);
    }, [text, difficulty]);


    return (
      <section className="grid grid-cols-10 gap-4 h-full">

        <div className='col-span-7 flex flex-col'>

            <Settings />
            
            <div 
            ref={typingContainer}
            tabIndex={0}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="grow relative tracking-wide leading-relaxed py-4 mt-2 px-3 focus:outline-none"
            autoFocus
            >
                
                {
                text.map((letter, index) => {
                    
                    return <span key={letter + index} className={`ml-[3px] font-semibold text-lg border-slate-400 ${letter === " " && "px-[2px]"} ${index === pointer && "text-orange-500 border-b"} ${index < pointer && "text-slate-400"}`}>{letter}</span>;
                })
                }

                {
                    !isFocused && (
                        <div className="absolute top-0 left-0 h-full w-full z-10">
                            <div className="h-full w-full bg-slate-600/20 rounded-lg backdrop-blur-sm hv-center">
                            </div>
                            <div className="absolute top-0 left-0 w-full h-full hv-center cursor-pointer">
                                <p className="text-xl font-semibold">Click to continue</p>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
        
        {
        showResult && <Result charCount={text.length} reset={reset} setShowResult={setShowResult} />
        }

        {
            showSignup && <Signup func={reset} />
        }

        {
            showLogin && <Login func={reset} />
        }
        
        <div className="col-span-3">
            <Scoreboard />
        </div>
      </section>
    )
}

export default React.memo(Home);