import { stateType } from "@/reducers/State";
import { Dispatch, createContext } from "react";
import { actionType } from "@/reducers/State";


interface context {
    state: stateType
    dispatch: Dispatch<actionType>
}

export const StateContext = createContext({} as context);