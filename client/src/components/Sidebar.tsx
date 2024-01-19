"use client"

import { StateContext } from "@/contexts/state";
import { successNotification } from "@/utils/notifications";
import { useContext, useRef, useState } from "react";

// icons
import { BiLogOut, BiLogIn } from "react-icons/bi";
import { FaChartLine } from "react-icons/fa";


import ProgressModal from "./ProgressModal";

const Sidebar = () => {

    const { state, dispatch } = useContext(StateContext);
    const { user } = state;

    const [ progressModal, setProgressModal ] = useState(false);

    const logoutRef = useRef<HTMLButtonElement>(null);
    const loginRef = useRef<HTMLButtonElement>(null);
    const chartRef = useRef<HTMLButtonElement>(null);

    const logout = () => {
        localStorage.removeItem("typingToken");
        dispatch({ type: "SET_USER", payload: null });
        successNotification("You are logged out");
        logoutRef.current?.blur();
    }

    const login = () => {
        dispatch({ type: "SHOW_LOGIN", payload: true });
        loginRef.current?.blur();
    }

    const viewProgress = () => {
        setProgressModal(true);
        chartRef.current?.blur();
    }

    return (
        <section>
            <aside className="sticky top-0 h-[calc(100vh-104px)]">
                <div className="flex flex-col justify-end gap-4 h-full">

                    <div>
                        {
                            user && (
                                <div className="mb-2">
                                    <button ref={chartRef} className="bg-orange-500 hover:bg-orange-600 transitionItem px-4 py-2 rounded w-full text-slate-50 flex items-center justify-center gap-2" onClick={viewProgress}><FaChartLine className="inline text-lg" /> My Progress</button>
                                </div>
                            )
                        }
                        <div>
                            {
                                user ? <button ref={logoutRef} className="bg-orange-500 hover:bg-orange-600 transitionItem px-4 py-2 rounded w-full text-slate-50 flex items-center justify-center gap-2" onClick={logout}><BiLogOut className="inline text-lg" /> Log out</button> : <button ref={loginRef} className="bg-orange-500 hover:bg-orange-600 transitionItem px-4 py-2 rounded w-full text-slate-50 flex items-center justify-center gap-2" onClick={login}><BiLogIn className="inline text-lg" /> Log in</button>
                            }
                            
                        </div>
                    </div>
                </div>

            </aside>
            {
                progressModal && <ProgressModal setProgressModal={setProgressModal} />
            }
        </section>
    );
}

export default Sidebar;