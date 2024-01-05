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

    let response = false;
    
    try {
        await User.findOneAndUpdate({ _id: user._id }, { $set: updatedUser }, { new: true, reValidators: true });
        
        response = true;
    }
    catch(err) {
        console.log(err)
        response = false;
    }
    
    return response;
}

export {
    registerScore,
}