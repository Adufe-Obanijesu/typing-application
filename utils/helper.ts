import User from "../models/User";

interface updatedUser {
    scores: {
            [key: string]: {
            [key: string]: number | number[]
        }
    }
}

interface props {
    score: number
    difficulty: string
    user: any
}

interface response {
    user: any
    status: boolean
}

interface getTop {
    difficulty: string
    number: number
}

const registerScore = async ({ score, difficulty, user }: props) => {
    const { scores } = user;

    let updatedUser : undefined | updatedUser;
    
    const newScores = scores[difficulty].scores;
    newScores.push(score);
    if (score > scores[difficulty].highScore) {
        updatedUser = {
            scores: {
                ...scores,
                [difficulty]: {
                    highScore: score,
                    scores: newScores,
                }
            }
        }
    } else {
        updatedUser = {
            scores: {
                ...scores,
                [difficulty]: {
                    ...scores[difficulty],
                    scores: newScores,
                }
            }
        }
    }

    let response: response = {
        user: null,
        status: false,
    };
    
    try {
        const scoreResponse = await User.findOneAndUpdate({ _id: user._id }, { $set: updatedUser }, { new: true, reValidators: true });
        
        response = {
            user: scoreResponse,
            status: true,
        };
    }
    catch(err) {
        console.log(err)
        response = {
            user,
            status: false,
        };
    }
    
    return response;
}

const getTop = async ({ difficulty, number }: getTop) => {

    let response = {
        status: false,
        data: [],
    }

    try {
        const users:any = await User.find({ [`scores.${difficulty}.highScore`]: {$ne: 0} })
        .select("-password")
        .sort({ [`scores.${difficulty}.highScore`]: -1 })
        .limit(number)
        
        response = {
            status: true,
            data: users,
        }
    }
    catch(err) {
        response = {
            status: false,
            data: [],
        }
    }

    return response;
}

export {
    registerScore,
    getTop,
}