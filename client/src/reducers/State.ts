type stateType = {
    darkMode: boolean
    signin: boolean
    audio: boolean
    presets: {
        wordNumber: number
        difficulty: "easy" | "medium" | "hard"
        error: number
        result: number
    }
}

type actionType = {
    type: string
    payload: any
}

const initialState: stateType = {
    darkMode: false,
    signin: false,
    audio: false,
    presets: {
        wordNumber: 20,
        difficulty: "easy",
        error: 0,
        result:  -1
    }
};

const stateReducer = (state: stateType, action: actionType) => {
    switch(action.type) {
        case "SIGNIN":
            const signinState = {
                ...state,
                signin: action.payload,
            }
            return signinState;

        case "CHANGE_MODE":
            const modeState = {
                ...state,
                darkMode: action.payload,
            }
            return modeState;

        case "CHANGE_AUDIO_SETTING":
        const audioState = {
            ...state,
            audio: action.payload,
        }
        return audioState;

        case "SET_DIFFICULTY":
            const difficultyState = {
                ...state,
                presets: {
                    ...state.presets,
                    difficulty: action.payload,
                }
            }

            return difficultyState;
        
            case "SET_WORD_NUMBER":
                const wordNumberState = {
                    ...state,
                    presets: {
                        ...state.presets,
                        wordNumber: action.payload,
                    }
                }
    
                return wordNumberState;

            case "SET_ERROR":
                const errorState = {
                    ...state,
                    presets: {
                        ...state.presets,
                        error: action.payload,
                    }
                }

                return errorState;

            case "SET_RESULT":
                const resultState = {
                    ...state,
                    presets: {
                        ...state.presets,
                        result: action.payload,
                    }
                }

                return resultState;

        default: return state;
    }
}

export {
    stateReducer,
    initialState,
}

export type {
    stateType,
    actionType,
}