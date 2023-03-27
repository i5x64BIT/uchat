import { UserModel } from '../models/UserModel.js';
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

export async function queryUserCreate(user) {
    try{
        const db = await connectDB();
        const insertQuery =
            'INSERT INTO users (email, password) VALUES (?,?)';
        await db.run(insertQuery, [user.email, user.password])
            .then(() => console.log(`User ${newUser.email} created!`));
        await db.close();
    } catch (e) {
        userHandler(e);
    }
}
export async function queryUserUpdate(id, email, password) {
    try{
        console.log('UserTable: queryUserUpdate is running')
        let query = '';

        if(email && password){
            query = `UPDATE users
        SET email = ?, password = ?
        WHERE id = ?`;

            const db = await connectDB();
            await db.run(query, email,password, id);
            await db.close();
        }
        else if(password){
            query = `UPDATE users
        SET password = ?
        WHERE id = ?`;

            const db = await connectDB();

            await db.run(query, [password, id]);
            await db.close();
        }
        else if(email) {
            query = `UPDATE users
        SET email = ?
        WHERE id = ?`;

            const db = await connectDB();
            await db.run(query, [email, id]);
            await db.close();
        }
    } catch (e){
        userHandler(e);
    }
}
export async function queryUserDelete(id) {
    const query = 'DELETE FROM users WHERE id = ?'
    const db = await connectDB();
    await db.run(query, [id]);
    await db.close();
}
export async function queryGetUserByID(id){
    try {
        const db = await connectDB();
        const selectQuery = `SELECT * FROM users WHERE id=?`;
        const res = await db.get(selectQuery, [id]);
        const user = new UserModel({id:res.id, email:res.email, password:res.password});
        await db.close();
        return new Promise( resolve => resolve(user));
    } catch (e){
        userHandler(e);
    }
}
export async function queryGetUserIDByEmail(email){
    const db = await connectDB();
    const selectQuery = `SELECT id FROM users WHERE email=?`;
    const res = await db.get(selectQuery, [email]);
    await db.close();
    return new Promise( (resolve,reject) => {
        if(res){
            resolve(res.id);
        }
        else{
            reject(new Error('UserNotFoundException'))
        }
    });
}
export async function queryGetUserByLogin(email, password){
    //fetch api and resolve a user obj
    try{
        const db  = await connectDB();
        const userArr = await db.all('SELECT * FROM users WHERE email = ? AND password = ?',
            [email, password]);
        await db.close();
        return new Promise((resolve, reject) =>{
            (userArr[0]) ? resolve(userArr[0]) : reject(new Error('Username or password are incorrect'));
        });
    } catch (e) {
    }
}


