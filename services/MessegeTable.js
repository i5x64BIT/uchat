import sqlite3 from "sqlite3";
import { open } from 'sqlite';

//open wrapper
function connectDB(){
    sqlite3.verbose();
    return open({
        filename: './tmp/database.db',
        driver: sqlite3.Database
    });
}

export async function queryGetMessegesByUserID(userID){
    const db = await connectDB();
    const querySelect = `
            SELECT * FROM messeges
            WHERE sender_id = ?
            OR receiver_id = ?
            ORDER BY (time)
            `;
    const msgArray = await db.all(querySelect,[userID, userID]);
    await db.close();
    return new Promise( resolve => resolve(msgArray));
}
//for conversations
export async function queryGetMessagesBySenderToReceiver(senderID, receiverID){
    const db = await connectDB();
    const querySelect = `
            SELECT sender_id, receiver_id, time, content FROM messeges
            WHERE 
            (sender_id = ? AND receiver_id = ?)
            OR
            (sender_id = ? AND receiver_id = ?)
            ORDER BY (time)
            `;
    const msgArray = await db.all(querySelect,[senderID, receiverID, receiverID, senderID]);
    await db.close();
    return new Promise( resolve => resolve(msgArray));
    //returns [{sender_id,time,content}]
}

//for group chats
/*export async function queryGetMessegesBySenders(...sendersIDs){
    try{
        const db = await connectDB();
        let querySelect = `SELECT * FROM messeges `;
        for(let i =0; i <= sendersIDs.length; i++){
            querySelect += `WHERE sender=? `;
        }
        querySelect += `ORDER BY (time)`;

        const msgArray = await db.all(querySelect,[sendersIDs]);
        await db.close();
        return new Promise( resolve => msgArray);
    } catch (e) {
        messageHandler(e);
    }
}*/

export async function queryMessageCreate(messege){
    const db = await connectDB();
    let queryInsert = `
        INSERT INTO messeges (sender_id, receiver_id, time, content) VALUES (?, ?, ?, ?)`;

    await db.run(queryInsert,[messege.sender_id, messege.receiver_id, messege.time, messege.content])
        .then(() => {
            console.log(`Messege sent to ${messege.receiver_id}, by ${messege.sender_id}`);
        });
    await db.close();
}
export async function queryGetConversationEmailsOfID(userID) {
    const db = await connectDB();
    const query = `
        SELECT DISTINCT users.id, users.email FROM users
        JOIN messeges
        ON users.id = sender_id OR users.id  = receiver_id
        WHERE users.id != ? AND (messeges.sender_id = ? OR messeges.receiver_id = ?)
        ORDER BY time`;
    const email_idArray = await db.all(query, [userID, userID, userID]);
    await db.close();
    return new Promise( resolve => resolve(email_idArray));
    //returns [{id, email}]
}
export async function queryRemoveChatsOf(userID){
    const db = await connectDB();
    const query = `DELETE FROM messeges
    WHERE sender_id = ? OR receiver_id = ?`

    await db.run(query, [userID, userID]);
    await db.close();
}
