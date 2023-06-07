import { multiLineFields, metaFields, validMetaObjects } from "./MetaTypes.mjs";
import { trimTextLines } from "../MetaHelper/MetaHelper.mjs";

function GenerateMetaObject(dataLines, source, metaType) {
    var trimmedLines = trimTextLines(dataLines);
    var metaObject = {};
    var isMultiLine = false;
    var currentField = "";
    var fieldValueArray = [];

    for (let i = 0; i < trimmedLines.length; i++) {
        if (isMultiLine) {
            if (!trimmedLines[i].startsWith("@") && i !== trimmedLines.length - 1) {
                if (currentField !== "description" && !trimmedLines[i]) {
                    metaObject[currentField] = fieldValueArray;
                    isMultiLine = false;
                    fieldValueArray = [];
                } else {
                    fieldValueArray.push(trimmedLines[i]);
                }
            } else {
                metaObject[currentField] = fieldValueArray;
                isMultiLine = false;
                fieldValueArray = [];
            }
        }

        var line = trimmedLines[i];
        var trimmedField = line.substring(1, line.indexOf(" ") !== -1 ? line.indexOf(" ") : line.length).toLowerCase();
        if (trimmedField in multiLineFields) {
            var fieldInfo = multiLineFields[trimmedField];
            // multiline support for inline fields
            if (trimmedField.length + 1 < line.length) {
                fieldValueArray.push(line.substring(line.indexOf(" "), line.length));
            }
            isMultiLine = fieldInfo.multiline;
            currentField = trimmedField;
        } else if (line.startsWith("@")) {
            var parts = line.substring(1).split(" ");
            var field = parts[0].toLowerCase();
            var value = parts.splice(1).join(" ");
            if (!validMetaObjects.includes(metaType)) {
                console.error("metaType: " + metaType + " is not a valid metaType.");
                return null;
            }
            // Do not save field if it's not valid.
            if (metaFields[metaType].requiredFields.includes(field) || metaFields[metaType].optionalFields.includes(field)) {
                metaObject[field] = value;
            } else {
                console.error("Unknown field found for meta: " + metaType + field);
            }
        }
    }

    metaObject["type"] = metaType;
    metaObject["source"] = source;
    // Check if meta has all required objects.
    var missingFields = metaFields[metaType].requiredFields.filter((field) => !metaObject.hasOwnProperty(field));
    if (missingFields.length > 0) {
        console.error("Missing fields: " + missingFields.join(", ") + " in " + source);
    }

    return metaObject;
}

export { GenerateMetaObject };
