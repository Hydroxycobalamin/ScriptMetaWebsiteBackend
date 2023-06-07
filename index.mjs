import express from "express";
import cors from "cors";
import crypto from "crypto";

import { startZIP } from "./functions/DownloadZip.mjs";
import { token } from "./config/config.mjs";

const PORT = process.env.PORT || 3050;
const app = express();

app.use(cors());
app.use(express.json());

let cachedData = null;

app.post("/api/reload", (req, res) => {
    try {
        const expectedSignature = req.headers["x-hub-signature-256"];
        const calculatedSignature = `sha256=${crypto.createHmac("sha256", token).update(JSON.stringify(req.body)).digest("hex")}`;

        if (expectedSignature === calculatedSignature) {
            cachedData = startZIP();

            res.status(200).json({ message: "Reload successful" });
        } else {
            console.log("Signature is invalid");
            res.status(401).json({ error: "Invalid signature" });
        }
    } catch (error) {
        console.error("Error while reloading:", error);
        res.status(500).json({ error: "Reload failed" });
    }
});

app.get("/api/all", (req, res) => {
    res.json({ returnMessage: cachedData });
});

app.get("/api/task", (req, res) => {
    const filteredData = cachedData.filter((obj) => obj?.type === "task");
    res.json({ returnMessage: filteredData });
});

app.get("/api/script", (req, res) => {
    const filteredData = cachedData.filter((obj) => obj?.type === "script");
    res.json({ returnMessage: filteredData });
});

app.get("/api/procedure", (req, res) => {
    const filteredData = cachedData.filter((obj) => obj?.type === "procedure");
    res.json({ returnMessage: filteredData });
});

app.get("/api/information", (req, res) => {
    const filteredData = cachedData.filter((obj) => obj?.type === "information");
    res.json({ returnMessage: filteredData });
});

app.get("/api/event", (req, res) => {
    const filteredData = cachedData.filter((obj) => obj?.type === "event");
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
    console.log("Server initialization complete");
}

initializeServer();
