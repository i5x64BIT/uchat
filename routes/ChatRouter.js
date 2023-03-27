import express from 'express';
import Chat from "../controller/Chat.js";
import {fileURLToPath} from "url";
import path from "path";
import {MessageModel} from "../models/MessageModel.js";
import {getUserIDByEmail} from "../controller/User.js";
import {isLoggedIn} from "../middleware/Authentication.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const routesdir= path.dirname(__filename);
const __dirname = routesdir.replace('routes', '');
const viewsDir = path.join(__dirname, '/views/');

router.use(isLoggedIn);
router.get('/chats/', (req, res, next) => {
    if(req.session.user){
        Chat.getChatsOf(req.session.user.id)
            .then( email_idArr => {
                res.json(email_idArr)})
            .catch(e => next(e));
    }
})
router.get('/chat/new', (req, res) =>{
    res.render(path.join(viewsDir, '/chat_new.ejs'), {'user': req.session.user});
});
router.post('/chat/new', (req, res, next) =>{
    //check if user typed content
    getUserIDByEmail(req.body.email)
        .then(id =>{
            const message = new MessageModel({
                senderID: req.session.user.id,
                receiverID: id,
                content: req.body.content
            })
            Chat.sendMessage(message)
                .then(() => res.redirect('/'))
                .catch(e => next(e));
        })
        .catch(e => next(e));

});
router.get('/chat/:receiver_id', (req, res, next) => {
    Chat.getChat(req.session.user.id, req.params.receiver_id)
        .then( sender_time_contentArr => {
            res.json(sender_time_contentArr)})
        .catch(e => next(e));
})
export let ChatRouter = router;