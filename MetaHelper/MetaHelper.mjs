function trimTextLines(textLines) {
    var trimmedLines = [];
    textLines.forEach((textLine) => {
        if (textLine.startsWith("## ")) {
            trimmedLines.push(textLine.replace("## ", ""));
        } else if (textLine.startsWith("##")) {
            trimmedLines.push(textLine.replace("##", ""));
        }
    });
    return trimmedLines;
}

export { trimTextLines };
