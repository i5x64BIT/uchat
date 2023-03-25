import { UserModel } from '../models/UserModel.js';
import {
    queryUserCreate,
    queryUserUpdate,
    queryUserDelete,
    queryGetUserByLogin, queryGetUserByID, queryGetUserIDByEmail
} from '../services/UserTable.js';
import Chat from "./Chat.js";



export async function createUser(email, password){
    const user = new UserModel({email: email, password: password});
    await queryUserCreate(user);
}
export async function deleteUser(id){
    await queryUserDelete(id);
    await Chat.removeChats(id);
}
export async function updateUser(id, email, password){
    await queryUserUpdate(id, email, password);
}
export async function loginUser(email, password){
    const user = await queryGetUserByLogin(email,password);
    console.log(`User \x1b[33m${user.email}\x1b[0m Logged in!`);
    return new Promise(resolve => resolve(user));
}
export async function getUserByID(id){
    const user = await queryGetUserByID(id);
    return new Promise( resolve => resolve(user));
}
export async function getUserIDByEmail(email){
    const userID = await queryGetUserIDByEmail(email);
    return new Promise( resolve => resolve(userID));
}
