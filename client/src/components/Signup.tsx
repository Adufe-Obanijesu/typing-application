"use client"

import { useContext, useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";

// component
import Modal from "./Modal";
import Text from "./inputs/Input";

import { successNotification, errorNotification } from "../utils/notifications";

// context
import { StateContext } from "@/contexts/state";
import { override } from "@/utils/cliploader";

interface userDetails {
    firstName: string
    lastName: string
    email: string
    password: string
}

interface props {
    func: () => void
}

// func is any extra function you will like to run

const Signup = ({ func }: props) => {

    const { state, dispatch } = useContext(StateContext);
    const { darkMode, presets } = state;
    const { result, difficulty } = presets;

    const [ loading, setLoading ] = useState(false);

    const initialState = result ? {
        score: result,
        difficulty,
    } : {}

    const [ userDetails, setUserDetails ] = useState(initialState as userDetails);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUser = {
            ...userDetails,
            [e.target.name]: e.target.value,
        };

        setUserDetails(newUser);
    }

    const signup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (userDetails.password.length < 6) {
            errorNotification("Password can not be less than 6 characters");
            return;
        }

        setLoading(true);

        const config = {
            headers: {
                "Content-Type": "application/json",
            }
        }

        axios.post(`${process.env.NEXT_PUBLIC_SERVER}/user/signup`, userDetails, config)
        .then((response: any) => {
            
            successNotification("User signed up successfully");
            localStorage.setItem("typingToken", response.data.token);
            dispatch({ type: "SET_USER", payload: response.data.user });
            if (func) {
                func();
            }

            dispatch({ type: "SHOW_SIGNUP", payload: false });

        })
        .catch(err => {
            errorNotification(err.response?.data ? err.response.data.msg : "Error signing you up. Please check your network and try again.");
            console.log(err);
        })
        .finally(() => {
            setLoading(false);
        });
        
    }

    const login = () => {
        dispatch({ type: "SHOW_LOGIN", payload: true });
        dispatch({ type: "SHOW_SIGNUP", payload: false });
    }

    const dismissModal = () => {
        if (func) {
            func();
        }

        dispatch({ type: "SHOW_SIGNUP", payload: false });
    }

    return (
        <Modal dismiss={dismissModal}>
          <div className={`z-10 relative md:rounded-2xl md:shadow-lg md:px-8 px-8 py-8 lg:w-1/3 md:w-2/3 h-full md:h-auto ${darkMode ? "darkBg" : "lightBg"}`}>
            
            <h2 className="text-3xl mb-4 font-bold text-center">Sign Up!</h2>

            <form onSubmit={signup}>
              <Text name="First Name" input="firstName" value={userDetails.firstName || ""} setInput={handleInput} />
              <Text name="Last Name" input="lastName" value={userDetails.lastName || ""} setInput={handleInput} />
              <Text name="Email" type="email" input="email" value={userDetails.email || ""} setInput={handleInput} />
              <p className="text-sm mb-1">Password should be 6 characters long</p>
              <Text name="Password" type="password" input="password" value={userDetails.password || ""} setInput={handleInput} />

              <button
                className="bg-orange-500 hover:bg-orange-600 w-full text-center text-white rounded-md py-3 focus:outline-none"
                disabled={loading}
                >
                {
                !loading ? (
                    <>Sign Up</>
                ) : (
                    <div className="hv-center">
                        <ClipLoader
                        size={20}
                        loading={loading}
                        cssOverride={override}
                        />
                    </div>
                )
                }
                </button>
            </form>
            <p className="text-end text-sm mt-2">Already a user? Log in <span className="font-semibold text-orange-500 hover:text-orange-600 cursor-pointer transitionItem" onClick={login}>here</span></p>

          </div>
        </Modal>
    )
}

export default Signup;