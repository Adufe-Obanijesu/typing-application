import { stateType } from "@/reducers/State";
import { Dispatch, createContext } from "react";
import { action } from "@/reducers/State";


interface context {
    state: stateType
    dispatch: Dispatch<action>
}

export const StateContext = createContext({} as context);