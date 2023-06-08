import { multiLineFields, metaFields, validMetaObjects } from "./MetaTypes.mjs";
import { trimTextLines, isValidField } from "../MetaHelper/MetaHelper.mjs";

function GenerateMetaObject(dataLines, source, metaType) {
    var trimmedLines = trimTextLines(dataLines);
    var metaObject = {};
    var isMultiLine = false;
    var currentField = "";
    var fieldValueArray = [];

    for (let i = 0; i < trimmedLines.length; i++) {
        // multiline logic
        if (isMultiLine) {
            if (!trimmedLines[i].startsWith("@")) {
                if (i + 2 > trimmedLines.length) {
                    if (trimmedLines[i].length > 0) {
                        fieldValueArray.push(trimmedLines[i]);
                    }
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
            // Warn if field isn't known.
            isValidField(currentField, metaType);
        } else if (line.startsWith("@")) {
            var parts = line.substring(1).split(" ");
            var field = parts[0].toLowerCase();
            var value = parts.splice(1).join(" ");
            // Do not allow unknown meta types to be loaded.
            if (!validMetaObjects.includes(metaType)) {
                console.error("metaType: " + metaType + " is not a valid metaType.");
                return null;
            }
            // Save fields, but warn.
            isValidField(field, metaType);
            metaObject[field] = value;
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
