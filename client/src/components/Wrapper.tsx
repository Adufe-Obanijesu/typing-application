"use client";

import { StateContext } from "@/contexts/state";
import React, {
  ReactNode,
  useReducer,
  useEffect,
  useCallback,
  useState,
  useRef,
} from "react";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { initialState, stateReducer } from "@/reducers/State";
import axios from "axios";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const hasRendered = useRef(false);

  const [state, dispatch] = useReducer(stateReducer, initialState);

  const { darkMode, user, UIloaded } = state;

  const verifyToken = useCallback(() => {
    if (user) return;

    const token = localStorage.getItem("typingToken");

    if (!token) return;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER}/user/checkToken`, config)
      .then((response) => {
        dispatch({ type: "SET_USER", payload: response.data.user });
      })
      .catch(() => {
        dispatch({ type: "SET_LOGIN", payload: true });
      });
  }, [user]);

  const getPresets = useCallback(() => {
    if (!localStorage.getItem("typingMode")) {
      localStorage.setItem("typingMode", "true");
    }

    const typingMode = localStorage.getItem("typingMode");
    const typingSong = localStorage.getItem("typingSong");

    if (typingMode === "true") {
      dispatch({ type: "SET_MODE", payload: true });
    } else {
      dispatch({ type: "SET_MODE", payload: false });
    }

    if (typingSong) {
      dispatch({ type: "SET_SONG", payload: typingSong });
    }
  }, []);

  useEffect(() => {
    if (hasRendered.current) return;

    verifyToken();
    hasRendered.current = true;
  }, [verifyToken]);

  useEffect(() => {
    getPresets();
  }, [getPresets]);

  const closeNavDropDown = () => {
    dispatch({ type: "SET_DROPDOWN", payload: false });
  };

  return (
    <StateContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <main
        className={`overflow-hidden relative py-4 min-h-screen transitionItem dark:bg-slate-900 dark:text-slate-300 ${darkMode ? "darkBg darkText" : "lightBg lightText"} min-h-screen`}
        onClick={closeNavDropDown}
      >
        {children}

        {!UIloaded && (
          <div className="fixed top-0 left-0 w-screen h-screen z-50 backdrop-blur-sm bg-black bg-opacity-20 hv-center">
            <div className="border-t-2 border-black rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}
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
  );
};

export default React.memo(Wrapper);
