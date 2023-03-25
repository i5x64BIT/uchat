import express from 'express';
import Chat from "../controller/Chat.js";
import {fileURLToPath} from "url";
import path from "path";
import {MessegeModel} from "../models/MessegeModel.js";
import {getUserIDByEmail} from "../controller/User.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const routesdir= path.dirname(__filename);
const __dirname = routesdir.replace('routes', '');
const viewsDir = path.join(__dirname, '/views/');

router.get('/chats/', (req, res) => {
    if(req.session.user){
        Chat.getChatsOf(req.session.user.id)
            .then( email_idArr => {
                res.json(email_idArr)});
    }
})
router.get('/chat/new', (req, res) =>{
    res.render(path.join(viewsDir, '/chat.ejs'), {'user': req.session.user});
});
router.post('/chat/new', (req, res) =>{
    //check if user typed content
    getUserIDByEmail(req.body.email)
        .then(id =>{
            const message = new MessegeModel({
                senderID: req.session.user.id,
                receiverID: id,
                content: req.body.content
            })
            Chat.sendMessage(message)
                .then(() => res.redirect('/'))
        })

});
router.get('/chat/:receiver_id', (req, res) => {
    Chat.getChat(req.session.user.id, req.params.receiver_id)
        .then( sender_time_contentArr => {
            res.json(sender_time_contentArr)});
})
export let ChatRouter = router;