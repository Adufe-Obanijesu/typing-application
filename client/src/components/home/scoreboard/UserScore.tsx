interface props {
    name: string
    score: number
    position: number
    isMe?: boolean
}

const UserScore = ({ name, score, position, isMe }: props) => {

    return (
        <li className={`text-lg flex gap-4 px-2 py-1 rounded-lg cursor-pointer items-center hover:bg-orange-600 hover:text-slate-50 transitionItem ${isMe && "bg-orange-600 text-slate-50"}`}>
            <span className="text-xl font-bold py-1 px-3 rounded-full bg-orange-500 text-white">
                {position}
            </span>
            <div>
                <p>
                    {name}
                </p>
                <p className="text-base">
                    {score} WPM
                </p>
            </div>
        </li>
    )
}

export default UserScore;