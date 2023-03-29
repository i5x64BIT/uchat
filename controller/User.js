import { UserModel } from '../models/UserModel.js';
import {
    queryUserCreate,
    queryUserUpdate,
    queryUserDelete,
    queryGetUserByLogin, queryGetUserByID, queryGetUserIDByEmail
} from '../services/UserTable.js';
import Chat from "./Chat.js";
import {UserException} from "../lib/errors/UserException.js";



export async function createUser(email, password){
    try{
        if(!email || !password){
            throw new UserException('Missing input',
                UserException.CODES.INPUT_ERR);
        }
        const user = new UserModel({email: email, password: password});
        await queryUserCreate(user);
    } catch (e) {
        console.log(e.message);
        if(e.stack.includes('UNIQUE constraint failed:')){ //checks if the unique attribute is responsible for sql error
            throw new UserException(
                'This email is already used',
                UserException.CODES.EMAIL_IN_USE
            )
        }
        else throw new UserException(
            "Couldn't create a user",
            UserException.CODES.CREATE_USER,
            e);
    }
}
export async function deleteUser(id){
    try{
        await queryUserDelete(id);
    } catch(e) {
        throw new UserException(
            "Couldn't delete user",
            UserException.CODES.DELETE_ERR,
            e
        )
    }
    await Chat.removeChats(id); // has it's own try catch block in Chat controller.
}
export async function updateUser(id, email, password){
    try{
        await queryUserUpdate(id, email, password);
    } catch(e) {
        throw new UserException(
            "Couldn't update user",
            UserException.CODES.UPDATE_ERR,
            e
        )
    }
}
export async function loginUser(email, password){
    try{
        const user = await queryGetUserByLogin(email,password);
        console.log(`User \x1b[33m${user.email}\x1b[0m Logged in!`);
        return new Promise(resolve => resolve(user));
    } catch {
        throw new UserException(
            'Email or password is incorrect',
            UserException.CODES.CREDENTIAL_ERR
        )
    }
}
export async function getUserByID(id){
    try{
        const user = await queryGetUserByID(id);
        return new Promise( resolve => resolve(user));
    } catch {
        throw new UserException(
            "Couldn't find the user by email",
            UserException.CODES.MISSING_USER_EMAIL
        )
    }
}
export async function getUserIDByEmail(email){
    if(!email){
        throw new UserException('Email field is missing',
            UserException.CODES.INPUT_ERR);
    }
    try{
        const userID = await queryGetUserIDByEmail(email);
        return new Promise( resolve => resolve(userID));
    } catch {
        throw new UserException(
            "Couldn't find user by id",
            UserException.CODES.MISSING_USER_ID
        )
    }

}
