import {
    queryGetConversationEmailsOfID,
    queryGetMessegesBySenderToReciver,
    queryMessegeCreate, queryRemoveChatsOf
} from "../services/MessegeTable.js";
import {getUserIDByEmail} from "./User.js";
import {MessegeModel} from "../models/MessegeModel.js";

class Chat{
    static async getChat(senderID, receiverID){
        const sender_time_contentArr = await queryGetMessegesBySenderToReciver(senderID, receiverID);
        for(const msg of sender_time_contentArr){
            //msg.time = (new Date(msg.time)).toString();

            msg.time = Chat.formatTime(msg.time);
            //converts time integer into date object, then to string.
        }
        return new Promise(resolve => resolve(sender_time_contentArr));
    }
    static async getChatsOf(userID){
        const chatArr = await queryGetConversationEmailsOfID(userID);
        return new Promise( resolve => resolve(chatArr))
    }
    static async sendMessage(msg){
        console.log(`sendMessage: `)
        //const receiverID = await getUserIDByEmail(msg.receiver_id)
        await queryMessegeCreate(msg);
    }
    static async removeChats(userID) {
        await queryRemoveChatsOf(userID);
    }
    static formatTime(time){
        const d = new Date(time) //unformatted date
        const day = 86_400_000;
        if((Date.now() - d) < (day*7)){
            const formattedDay = Intl.DateTimeFormat('en-US', { weekday:'short' }).format(d);
            return `${formattedDay}, ${d.getHours()}:${d.getMinutes()}`
        } else {
            return`${d.getDate()}/${d.getMonth()}/${d.getFullYear().toString().slice(-2)}, ${d.getHours()}:${d.getMinutes()}`
        }
    }
}
export default Chat;
