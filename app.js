import { createReadStream, statSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.get("/", (req, res) => {
    res.send('send');
});

app.get("/video", (req, res) => {
    const filePath = `${__dirname}/public/video2.mp4`;
    const range = req.headers.range;

    if (!range) {
        return res.status(400).send("Requires Range header");
    }

    const stat = statSync(filePath);
    const fileSize = stat.size;

    const chunkSize = 10 ** 6; // 1MB chunks
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + chunkSize, fileSize - 1);

    res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": "video/mp4"
    });

    const fileStream = createReadStream(filePath, { start, end });
    fileStream.pipe(res);
});

app.listen(4000, () => {
    console.log('Server started on port 4000');
});
