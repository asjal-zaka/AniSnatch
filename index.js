import axios from "axios";
import {load} from "cheerio";
import express from "express";

import { searchModule } from "./modules/search.js";
import { getParams } from "./modules/getParams.js"
import {getEpisodeList} from "./modules/episodes.js";
import {getLinks,getDownload} from "./modules/download.js"

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.setHeader('Content-Txype', 'text/json')
    res.send(`Welcome to AniSnatch API!! Following are the API's routes:
        /search - To search for an anime - Paramaters are query and page.
        /episodeInfo - To get episode info - Paramater is id.
        /episodes - To get episodes - Paramater is id.
        /download - To download - Paramaters are id and res.
        `)
    
    res.end()
})

app.get('/search', async (req, res) => {
    await searchModule(req.query.query, req.query.page).then((data) => {
        res.send(JSON.stringify(data))
    })
    res.end()
})

app.get('/episodeInfo', async (req,res) => {
    await getParams(req.query.id).then((data) => {
        res.send(JSON.stringify(data))
    })
    res.end()
})

app.get('/episodes', async (req,res) => {
    await getEpisodeList(req.query.id).then((data) => {
        res.send(JSON.stringify(data))
    })
    res.end()
})

app.get('/download', async (req,res) => {
    const links = await getLinks(req.query.id); 
    await getDownload(links).then((data) => {
        if(req.query.res == "360p"){data = data[0]}
        else if(req.query.res == "480p"){data = data[1]}
        else if(req.query.res == "720p"){data = data[2]}
        else if(req.query.res == "1080p"){data = data[3]}
        res.send(JSON.stringify(data));   
    });
    res.end()
})

app.listen(3000, () => {
    console.log(`Listening to requests on port 3000 [https://localhost:3000]`)
})