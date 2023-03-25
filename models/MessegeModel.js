export class MessegeModel {
    constructor({senderID,receiverID, content}) {
        this.sender_id = senderID;
        this.time = Date.now();
        this.receiver_id = receiverID
        this.content = content;
    }
}