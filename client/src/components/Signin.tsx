"use client"

import { useContext, useState } from "react";
import { ClipLoader } from "react-spinners";

// component
import Modal from "./Modal";
import Text from "./inputs/Input";

import { successNotification, errorNotification } from "../utils/notifications";

// context
import { StateContext } from "@/contexts/state";

interface userDetails {
    firstName: string
    lastName: string
    email: string
    password: string
}

interface props {
    reset: () => void
    result?: number
    difficulty?: string
}

const Signin = ({ reset }: props) => {

    const { state } = useContext(StateContext);
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

        setLoading(true);

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userDetails),
        }

        fetch(`${process.env.NEXT_PUBLIC_SERVER}/user/signup`, config)
        .then(response => response.json())
        .then(response => {
            successNotification("User signed up successfully");
            localStorage.setItem("typingToken", response.token);
            reset();
        })
        .catch(err => {
            errorNotification(err.msg);
            console.log(err);
        })
        .finally(() => {
            setLoading(false);
        });
    }

    const override = {
        borderColor: "white",
        margin: "0",
        padding: "0",
      };

    return (
        <Modal dismiss={reset}>
          <div className={`z-10 relative md:rounded-2xl md:shadow-lg md:px-8 px-8 py-8 lg:w-1/3 md:w-2/3 h-full md:h-auto ${darkMode ? "darkBg" : "lightBg"}`}>
            
            <form onSubmit={signup}>
              <Text name="First Name" input="firstName" value={userDetails.firstName || ""} setInput={handleInput} />
              <Text name="Last Name" input="lastName" value={userDetails.lastName || ""} setInput={handleInput} />
              <Text name="Email" type="email" input="email" value={userDetails.email || ""} setInput={handleInput} />
              <Text name="Password" type="password" input="password" value={userDetails.password || ""} setInput={handleInput} />

              <button
                className="bg-orange-500 hover:bg-orange-600 mt-4 w-full text-center text-white rounded-md py-3 focus:outline-none"
                >
                {
                !loading ? (
                    <>Yes</>
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

          </div>
        </Modal>
    )
}

export default Signin;