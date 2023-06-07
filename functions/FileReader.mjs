import readline from "readline";
import fs from "fs";
import path from "path";

import { GenerateMetaObject } from "../MetaTypes/MetaObject.mjs";
import { GetFileSource } from "./URLHandler.mjs";

function ReadFiles(directory) {
    let files = [];
    var dscFiles = [];

    function throughDirectory(directory) {
        fs.readdirSync(directory).forEach((file) => {
            const absolute = path.join(directory, file);
            if (fs.statSync(absolute).isDirectory()) return throughDirectory(absolute);
            else {
                return files.push(absolute);
            }
        });
    }

    throughDirectory(directory);
    files.forEach((file) => {
        if (!file.endsWith(".dsc")) {
            return;
        }
        dscFiles.push(file);
    });
    return dscFiles;
}

function ReadLineByLine(file, url) {
    return new Promise((resolve, reject) => {
        var lines = [];
        var type = "";
        var objects = [];
        var r = readline.createInterface({
            input: fs.createReadStream(file),
        });
        var i = 0;
        var ln;
        r.on("line", (text) => {
            i++;
            text = text.trim();
            if (text.startsWith("## <--[")) {
                ln = i;
                type = text.substring(text.indexOf("[") + 1);
                type = type.substring(0, type.indexOf("]"));
            } else if (text.startsWith("## -->")) {
                objects.push(GenerateMetaObject(lines, GetFileSource(file, url, ln), type));
                lines = [];
                type = "";
            } else if (text.startsWith("##")) {
                lines.push(text);
            }
        });

        r.on("close", () => {
            resolve(objects);
        });

        r.on("error", (error) => {
            reject(error);
        });
    });
}

export { ReadFiles, ReadLineByLine };
