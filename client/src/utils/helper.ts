const calcWPM = (timeTaken: number, charCount: number, errCount: number) => {
    return Math.round((charCount - errCount) / (5 * (timeTaken / (60 * 1000))));
}

const capitalize = (text: string[]) => {
    const newText: string[] = []
    text.forEach((eachText, index) => {
        eachText.split("").forEach((letter, i) => {
            if (i === 0) {
                newText.push(letter.toUpperCase());
                return;
            };
            newText.push(letter);
        });

        if (index !== text.length-1) {
            newText.push(" ");
        }
    });

    return newText;
}

export {
    calcWPM,
    capitalize,
}