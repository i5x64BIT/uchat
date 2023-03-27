import express from 'express';
const app = express();

import path from "path";
import {fileURLToPath} from "url";

import fs from 'fs';
import init from "./database/init.js";
import {ChatRouter} from "./routes/ChatRouter.js";
import { UserRouter } from "./routes/UserRouter.js";

import bodyParser from "body-parser";
import {WebSocketController} from "./controller/WebSocketsController.js";

import RedisStore from "connect-redis"
import session from "express-session"
import {createClient} from "redis"
import ErrorHandler from "./middleware/ErrorHandler.js";

// Initialize client.
let redisClient = createClient()
redisClient.connect().catch(console.error)

// Initialize store.
let redisStore = new RedisStore({
    client: redisClient,
    prefix: "myapp:",
})

// Initialize session parser.
const sessionParser = session({
    store: redisStore,
    resave: false, //force lightweight session keep alive (touch)
    saveUninitialized: false, //only save session when data exists
    secret: "marsel cache",
})

createDB() //Utils
const __dirname = setDirname() //Utils



app.use(express.static(path.join(__dirname, '/static')));
app.use(bodyParser.urlencoded( {extended: true} ));
// Initialize session store.
app.use(sessionParser)
app.use(UserRouter);
app.use(ChatRouter);
app.use(ErrorHandler);

//The listen function in express v4 returns a server object
const server = app.listen(80,() => {
    console.log('port 80 is open');
});

WebSocketController.init(server, sessionParser);

//Utils
function createDB() {
    if(!(fs.existsSync('./tmp') && fs.existsSync('./tmp/database.db'))){
        (async () =>{
            await fs.mkdir('./tmp', () =>{
                console.log("tmp directory was created!")
            });
            await new Promise((resolve, reject) =>{
                fs.writeFile('./tmp/database.db','', (err) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        console.log("database.db was created!")
                        resolve();
                    }
                })
            });
            await init();
        })();
    }

}
export function setDirname() {
    const __filename = fileURLToPath(import.meta.url);
    const routesdir= path.dirname(__filename);
    return routesdir.replace(__filename, '')
}
export let appDir = setDirname();
