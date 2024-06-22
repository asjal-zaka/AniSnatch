import express from 'express';
import { searchModule } from './modules/search.js';
import { getParams } from './modules/getParams.js';
import { getEpisodeList } from './modules/episodes.js';
import { getLinks, getDownload } from './modules/download.js';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/json');
    res.send(`Welcome to AniSnatch API!! Following are the API's routes:
        /search - To search for an anime - Parameters are query and page.
        /episodeInfo - To get episode info - Parameter is id.
        /episodes - To get episodes - Parameter is id.
        /download - To download - Parameters are id and res.
        `);
});

app.get('/search', async (req, res) => {
    try {
        const data = await searchModule(req.query.query, req.query.page);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/episodeInfo', async (req, res) => {
    try {
        const data = await getParams(req.query.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/episodes', async (req, res) => {
    try {
        const data = await getEpisodeList(req.query.id);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/download', async (req, res) => {
    try {
        const links = await getLinks(req.query.id);
        let data = await getDownload(links);
        if (req.query.res === '360p') {
            data = data[0];
        } else if (req.query.res === '480p') {
            data = data[1];
        } else if (req.query.res === '720p') {
            data = data[2];
        } else if (req.query.res === '1080p') {
            data = data[3];
        }
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default app;
