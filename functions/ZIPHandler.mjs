import path from "path";
import AdmZip from "adm-zip";
import axios from "axios";
import fs from "fs";

import { downloadDirectory } from "./DownloadZip.mjs";

async function DownloadZIP(zipUrl, projectName) {
    try {
        const response = await axios({
            method: "GET",
            url: zipUrl,
            responseType: "stream",
        });

        const zipFilePath = path.join(downloadDirectory, projectName, `${projectName}.zip`);
        const writer = fs.createWriteStream(zipFilePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on("finish", () => {
                resolve(zipFilePath);
            });
            writer.on("error", reject);
        });
    } catch (error) {
        console.error("Fehler beim Herunterladen der ZIP-Datei:", error);
        throw error;
    }
}

function ExtractZIP(zipFilePath, extractPath) {
    try {
        const zip = new AdmZip(zipFilePath);
        zip.extractAllTo(extractPath, true);
        console.log("ZIP-Datei erfolgreich entpackt.");
    } catch (error) {
        console.error("Fehler beim Entpacken der ZIP-Datei:", error);
        throw error;
    }
}

export { DownloadZIP, ExtractZIP };
