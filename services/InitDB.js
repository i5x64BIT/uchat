import {open} from "sqlite";
import sqlite3 from "sqlite3";
import {asyncUserHandler} from "./AsyncHandler.js";

export default async function initDB(){
    try{
        const db = await open({
            filename: './tmp/database.db',
            driver: sqlite3.Database
        })

        await db.run(
            `CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL
                )`);
        await db.run(
            `CREATE TABLE messeges (
            sender_id INTEGER NOT NULL,
            time INTEGER NOT NULL,
            receiver_id INTEGER NOT NULL,
            content TEXT NOT NULL,
            FOREIGN KEY (sender_id) REFERENCES users(id),
            FOREIGN KEY (receiver_id) REFERENCES users(id),
            CONSTRAINT sender_time PRIMARY KEY (sender_id, time)
            )`
        );
        console.log("DB initialized!");
        await db.close();
    } catch (e){
        asyncUserHandler(e);
    }
}