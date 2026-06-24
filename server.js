const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");

const app = express();

app.use(express.static("public"));

const upload = multer({
    dest: "uploads/"
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "Backend connected successfully!"
    });
});

app.post("/transcribe", upload.single("audio"), (req, res) => {

    const audioPath = req.file.path;

    const python = spawn(
        "C:\\Users\\2023839000\\Desktop\\Tools\\python\\python.exe",
        ["transcribe.py", audioPath],
        {
            env: {
                ...process.env,
                PATH:
                    process.env.PATH +
                    ";C:\\Users\\2023839000\\Desktop\\Tools\\ffmpeg\\bin"
            }
        }
    );

    let transcript = "";
    let errorOutput = "";

    python.stdout.on("data", (data) => {
        transcript += data.toString();
    });

    python.stderr.on("data", (data) => {
        errorOutput += data.toString();
    });

    python.on("close", (code) => {
        if (code === 0) {
            res.json({
                transcript
            });
        } else {
            res.status(500).json({
                error: errorOutput
            });
        }
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});