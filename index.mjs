import express from "express";
import cors from "cors";
import { startZIP } from "./functions/DownloadZip.mjs";

const PORT = process.env.PORT || 3050;
const app = express();

app.use(cors());

let cachedData = null;

app.get("/api/all", (req, res) => {
    res.json({ returnMessage: cachedData });
});

app.get("/api/task", (req, res) => {
    const filteredData = cachedData.flat().filter(obj => obj?.type === "task");
    res.json({ returnMessage: filteredData });
});

app.get("/api/script", (req, res) => {
    const filteredData = cachedData.flat().filter(obj => obj?.type === "script");
    res.json({ returnMessage: filteredData });
});

app.get("/api/procedure", (req, res) => {
    const filteredData = cachedData.flat().filter(obj => obj?.type === "procedure");
    res.json({ returnMessage: filteredData });
});

app.get("/api/information", (req, res) => {
    const filteredData = cachedData.flat().filter(obj => obj?.type === "information");
    res.json({ returnMessage: filteredData });
});

app.get("/api/event", (req, res) => {
    const filteredData = cachedData.flat().filter(obj => obj?.type === "event");
    res.json({ returnMessage: filteredData });
});

async function initializeServer() {
    try {
        cachedData = await startZIP();

        app.listen(PORT, () => {
            console.log(`Server listening on ${PORT}`);
        });
    } catch (error) {
        console.error("Error while starting the server:", error);
    }
    console.log('Server initialization complete');
}

initializeServer();
