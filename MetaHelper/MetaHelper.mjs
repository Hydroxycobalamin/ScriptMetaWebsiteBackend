import { metaFields } from "../MetaTypes/MetaTypes.mjs";

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

function isValidField(field, metaType) {
    var fields = metaFields[metaType].requiredFields + metaFields[metaType].optionalFields
    if (!fields.includes(field)) {
        console.error("Unknown field found for meta " + metaType + ": " + field);
    }
}

export { trimTextLines, isValidField };
