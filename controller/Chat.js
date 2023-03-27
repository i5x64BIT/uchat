import {
    queryGetConversationEmailsOfID,
    queryGetMessagesBySenderToReceiver,
    queryMessageCreate, queryRemoveChatsOf
} from "../services/MessegeTable.js";

import {MessageException} from "../lib/errors/MessageException.js";

class Chat{
    static async getChat(senderID, receiverID){
        try{
            const sender_time_contentArr = await queryGetMessagesBySenderToReceiver(senderID, receiverID);
            for(const msg of sender_time_contentArr){
                msg.time = Chat.formatTime(msg.time);
                //converts time integer into date object, then to string.
            }
            return new Promise(resolve => resolve(sender_time_contentArr));
        } catch (e) {
            throw MessageException(
                "Couldn't get chat between users",
                MessageException.CODES.SQL_ERR
            )
        }
    }
    static async getChatsOf(userID){
        const chatArr = await queryGetConversationEmailsOfID(userID);
        return new Promise( resolve => resolve(chatArr))
    }
    static async sendMessage(msg){
        if(!msg.content){
            throw new MessageException(
                'Message is missing content',
                MessageException.CODES.INPUT_ERR
            )
        }
        //const receiverID = await getUserIDByEmail(msg.receiver_id)
        try{
            await queryMessageCreate(msg);
        } catch (e) {
            throw new MessageException(
                `Couldn't send message`,
                MessageException.CODES.SQL_ERR
            )
        }
    }
    static async removeChats(userID) {
        try{
            await queryRemoveChatsOf(userID);
        } catch (e) {
            throw new MessageException(
                `Couldn't remove user chats`,
                MessageException.CODES.SQL_ERR
            )
        }

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
