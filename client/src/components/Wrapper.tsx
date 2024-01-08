"use client"


import { StateContext } from '@/contexts/state';
import React, { ReactNode, useReducer, useEffect, useCallback, useState, useRef } from 'react';

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import { initialState, stateReducer } from '@/reducers/State';
import axios from 'axios';

const Wrapper = ({ children }: { children: ReactNode }) => {

    const hasRendered = useRef(false);

    const [ state, dispatch ] = useReducer(stateReducer, initialState);

    const { darkMode, signedIn } = state;

    const verifyToken = useCallback(() => {
      if (signedIn) return;

      const token = localStorage.getItem("typingToken");

      if (!token) return;

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
      axios.get(`${process.env.NEXT_PUBLIC_SERVER}/user/checkToken`, config)
      .then(response => {
        dispatch({ type: "SET_SIGNED_IN_STATE", payload: true });
        dispatch({ type: "SET_USER", payload: response.data.user });
      })
      .catch(() => {
        dispatch({ type: "SET_LOGIN", payload: true });
      })
    }, []);

    const getPresets = useCallback(() => {
      if (!localStorage.getItem("typingMode")) {
        localStorage.setItem("typingMode", "true");
      }
  
      if (!localStorage.getItem("audioPreset")) {
        localStorage.setItem("audioPreset", "false");
      }
  
      const audioPreset = localStorage.getItem("audioPreset");
      const typingMode = localStorage.getItem("typingMode");
  
      if (typingMode === "true") {
        dispatch({ type: "SET_MODE", payload: true });
      } else {
        dispatch({ type: "SET_MODE", payload: false });
      }
  
      if (audioPreset === "true") {
        dispatch({ type: "SET_AUDIO_SETTING", payload: true });
      } else {
        dispatch({ type: "SET_AUDIO_SETTING", payload: false });
      }
    }, []);

    useEffect(() => {
      if (hasRendered.current) return;

      verifyToken();
      hasRendered.current = true;
    }, []);

    useEffect(() => {
      getPresets();
    }, []);

    return (
        <StateContext.Provider value={{
            state,
            dispatch
          }}>

            <main className={`overflow-hidden relative py-4 min-h-screen transitionItem dark:bg-slate-900 dark:text-slate-300 ${darkMode ? "darkBg darkText" : "lightBg lightText"}`}>
                
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

export default React.memo(Wrapper);