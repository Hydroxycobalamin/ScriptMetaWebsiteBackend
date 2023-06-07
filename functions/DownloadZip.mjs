import fs from "fs";
import path from "path";

import { DownloadZIP, ExtractZIP } from "./ZIPHandler.mjs";
import { ReadFiles, ReadLineByLine } from "./FileReader.mjs";
import { GetProjectNameFromUrl, GetProjectPathFromUrl } from "./URLHandler.mjs";
import { uris } from "../config/config.mjs";

const downloadDirectory = "./data/downloads";
const zipDownloadInterval = 86400000;

function createDirectory(directory) {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

async function startZIP() {
    console.log("Start ZIP process");
    try {
        if (fs.existsSync(downloadDirectory)) {
            deleteFolderRecursive(downloadDirectory)
        }
        createDirectory(downloadDirectory);

        const processZIPs = async () => {
            const results = [];
            for (const url of uris) {
                const projectName = GetProjectNameFromUrl(url);
                const projectDirectoryName = `${projectName}`;
                const projectDirectory = path.join(downloadDirectory, projectDirectoryName);

                createDirectory(projectDirectory);
                const zipFilePath = await DownloadZIP(url, projectName);
                ExtractZIP(zipFilePath, projectDirectory);
                console.log("ZIP extraction complete");

                let objects = null;

                const dscFiles = ReadFiles(projectDirectory);
                const filePromises = dscFiles.map((file) => {
                    return ReadLineByLine(file, GetProjectPathFromUrl(url));
                });
                objects = await Promise.all(filePromises);
                objects = objects.flat().filter((object) => object && object !== null && Object.keys(object).length !== 0);
                results.push(objects);
            }
            const objectsFilePath = path.join(downloadDirectory, "objects.json");
            fs.writeFileSync(objectsFilePath, JSON.stringify(results));
            return results;
        };

        return await processZIPs();
    } catch (error) {
        console.error(error);
        return [];
    }
}

function isZipFileOlderThan24Hours(directory, projectName) {
    const zipFilePath = path.join(directory, `${projectName}.zip`);
    if (!fs.existsSync(zipFilePath)) {
        return true;
    }

    const stats = fs.statSync(zipFilePath);
    const now = new Date();
    const zipModifiedTime = new Date(stats.mtime);

    // ZIP older than 24h?
    return now - zipModifiedTime > zipDownloadInterval;
}

function deleteFolderRecursive(directory) {
    if (fs.existsSync(directory)) {
        fs.readdirSync(directory).forEach((file) => {
            const currentPath = path.join(directory, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                deleteFolderRecursive(currentPath);
            } else {
                fs.unlinkSync(currentPath);
            }
        });
        fs.rmdirSync(directory);
    }
}

export { startZIP, downloadDirectory };
