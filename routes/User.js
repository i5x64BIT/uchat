import {
    createUser, deleteUser, getUserByID,
    loginUser, updateUser
} from "../controller/User.js";
import path from "path";
import { fileURLToPath } from 'url';
import express from "express";

import {asyncUserHandler} from "../services/AsyncHandler.js";

const router = express.Router();

import session from 'express-session';

const __filename = fileURLToPath(import.meta.url);
const routesdir= path.dirname(__filename);
const __dirname = routesdir.replace('routes', '');
const viewsDir = path.join(__dirname, '/views/');

//app.use(bodyParser.json());  // for parsing application/json
//app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded (tf is this)
//Cookies


//Home
router.get('/', (req, res) => {
    const options = {'user': req.session.user}
    res.render(path.join(viewsDir, '/home.ejs',), options);
})

//User
router.get('/login/', (req, res) => {
    res.render(path.join(viewsDir, 'login.ejs'));
})
router.post('/login/', (req, res) => {
    //Input checker
    loginUser(req.body.email, req.body.password)
        .then( user => {
            req.session.user = user;
            res.redirect('/')
        }).catch((e) => {
            res.redirect('/');
    });
})
router.get('/register/', (req, res) => {
    res.render(path.join(viewsDir, 'register.ejs'));
})
router.post('/register/', (req, res) => {
    //Input checker
        createUser(req.body.email, req.body.password)
            .then( () => {
                res.redirect('/');
            })
            .catch((e) =>{
                asyncUserHandler(e);
            });

});
router.get('/logout', (req, res) =>{
    req.session.destroy();
    res.redirect('/');
})
router.get('/user/:id', (req, res) =>{
    //check id
    getUserByID(req.params.id)
        .then( user => {
            res.render(path.join(viewsDir, 'user.ejs'),{"user": req.session.user, 'displayUser': user})
        })
});
router.get('/user/:id/edit', (req, res) =>{
    //check if user logged in
    if(req.session.user){
        res.render(path.join(viewsDir, '/user_edit.ejs'), {'user': req.session.user})
    }
    else{
        console.log(`User with id ${req.params.id} is not in session`)
        res.redirect('/');
    }
});
router.post('/user/:id/edit', (req, res) =>{
    //check if user logged in
    if(req.session.user){
        updateUser(req.session.user.id, req.body.email, req.body.password)
            .then(()=>{
                console.log(`User ${req.session.user.email} got updated`)
            });
    }
    else{
        console.log(`User with id ${req.params.id} is not in session`)
        res.redirect('/');
    }
});
router.post('/user/:id/delete', (req, res) =>{
    //check if user logged in
    if(req.session.user){
        deleteUser(req.session.user.id)
            .then(()=>{
                console.log(`User ${req.session.user.email} got removed!`)
                req.session.destroy();
            });
    }
    else{
        console.log(`User with id ${req.params.id} is not in session`)
        res.redirect('/');
    }
});

export let UserRouter = router;
