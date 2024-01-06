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

export {
    registerScore,
}