"use client"

import { faker } from '@faker-js/faker/locale/en';
import React, { useEffect, useState, useContext } from 'react';
import { calcWPM, capitalize } from '@/utils/helper';
import Result from '@/components/home/Result';

import Signup from '@/components/Signup';
import Settings from '@/components/home/Settings';
import { StateContext } from '@/contexts/state';
import Login from '@/components/Login';
import Scoreboard from '@/components/home/Scoreboard';

const Home = () => {

    const { state, dispatch } = useContext(StateContext);

    const { audio, showLogin, showSignup, presets, user } = state;
    const { wordNumber, difficulty, error, result } = presets;

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

    useEffect(() => {
        reset();
    }, [wordNumber, difficulty]);

    const handleInput = (e: KeyboardEvent) => {
        // test for allowed keys
        if (!allowedPattern.test(e.key)) return;

        if (pointer === 0) {
            const time = new Date().getTime();
            setStartTime(time);
        }
        
        // test if correct key was pressed
        if (e.key !== text[pointer]) {
            // Wrong typing sound
            if (audio) {
                if (typeof Audio !== 'undefined') {
                    const wrongTypingSound = new Audio("/audio/typing2.wav");
                    wrongTypingSound.play();
                }
            }

            if (pointer !== errPointer) {
              dispatch({ type: "SET_ERROR", payload: error + 1 });
                setErrPointer(pointer);

            }
            return;
        }

        // Typing sound
        if (audio && typeof Audio !== 'undefined') {
            const typingSound = new Audio("/audio/typing2.wav");
            typingSound.play();
            
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
        window.addEventListener("keypress", handleInput);

        if (result > -1) {
            window.removeEventListener("keypress", handleInput);
        }

        return () => {
            window.removeEventListener("keypress", handleInput);
        }
    }, [text, pointer, errPointer, startTime, endTime, result]);


    return (
      <section className="grid grid-cols-12 gap-4">

        <div className='col-span-2'></div>

        <div className='col-span-7'>

            <Settings />
            
            <div className="tracking-wide leading-relaxed py-2 mt-2">
                
                {
                text.map((letter, index) => {
                    
                    return <span key={letter + index} className={`ml-[3px] font-semibold text-lg border-slate-400 ${letter === " " && "px-[2px]"} ${index === pointer && "text-orange-500 border-b"} ${index < pointer && "text-slate-400"}`}>{letter}</span>;
                })
                }

                {
                showResult && <Result charCount={text.length} reset={reset} setShowResult={setShowResult} />
                }

                {
                    showSignup && <Signup func={reset} />
                }

                {
                    showLogin && <Login func={reset} />
                }
            
            </div>
        </div>
        
        <div className="col-span-3">
            <Scoreboard />
        </div>
      </section>
    )
}

export default React.memo(Home);