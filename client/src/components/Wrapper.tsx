"use client"


import { StateContext } from '@/contexts/state';
import React, { ReactNode, useReducer, useEffect } from 'react';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { initialState, stateReducer } from '@/reducers/State';

const Wrapper = ({ children }: { children: ReactNode }) => {

    const [ state, dispatch ] = useReducer(stateReducer, initialState);

    const { darkMode } = state;

    useEffect(() => {
      if (!localStorage.getItem("typingMode")) {
        localStorage.setItem("typingMode", "true");
      }
  
      if (!localStorage.getItem("audioPreset")) {
        localStorage.setItem("audioPreset", "false");
      }
  
      const audioPreset = localStorage.getItem("audioPreset");
      const typingMode = localStorage.getItem("typingMode");
  
      if (typingMode === "true") {
        dispatch({ type: "CHANGE_MODE", payload: true });
      } else {
        dispatch({ type: "CHANGE_MODE", payload: false });
      }
  
      if (audioPreset === "true") {
        dispatch({ type: "CHANGE_AUDIO_SETTING", payload: true });
      } else {
        dispatch({ type: "CHANGE_AUDIO_SETTING", payload: false });
      }
  
    }, []);

    return (
        <StateContext.Provider value={{
            state,
            dispatch
          }}>

            <main className={`overflow-hidden relative flex justify-center py-4 min-h-screen transitionItem dark:bg-slate-900 dark:text-slate-300 ${darkMode ? "darkBg darkText" : "lightBg lightText"}`}>
                
                {children}
            
            </main>

            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme={darkMode ? "dark" : "light"}
            ></ToastContainer>
          </StateContext.Provider>
    )
}

export default Wrapper;