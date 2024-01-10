type stateType = {
    darkMode: boolean
    showSignup: boolean
    showLogin: boolean
    user: any
    song: string
    presets: {
        wordNumber: 20 | 30 | 40 | 50 | 60
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
    showSignup: false,
    showLogin: false,
    user: null,
    song: "music 1",
    presets: {
        wordNumber: 20,
        difficulty: "easy",
        error: 0,
        result:  -1
    }
};

const stateReducer = (state: stateType, action: actionType) => {
    switch(action.type) {
        case "SHOW_SIGNUP":
            const showSigninState = {
                ...state,
                showSignup: action.payload,
            }

            return showSigninState;

        case "SHOW_LOGIN":
            const showLoginState = {
                ...state,
                showLogin: action.payload,
            }

            return showLoginState;

        case "SET_MODE":
            const modeState = {
                ...state,
                darkMode: action.payload,
            }
            return modeState;

        case "SET_SONG":
            const songState = {
                ...state,
                song: action.payload,
            }
            return songState;

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

        case "SET_USER":
            const user = {
                ...state,
                user: action.payload,
            }
            return user;

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