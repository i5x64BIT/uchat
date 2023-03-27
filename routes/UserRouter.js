import {
    createUser, deleteUser, getUserByID,
    loginUser, updateUser
} from "../controller/User.js";
import path from "path";
import { fileURLToPath } from 'url';
import express from "express";

import {isLoggedIn} from "../middleware/Authentication.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const routesdir= path.dirname(__filename);
const __dirname = routesdir.replace('routes', '');
const viewsDir = path.join(__dirname, '/views/');

//Home
router.get('/', (req, res) => {
    const options = {'user': req.session.user}
    res.render(path.join(viewsDir, '/home.ejs',), options);
})
//User
router.get('/login/', (req, res) => {
    res.render(path.join(viewsDir, 'login.ejs'));
})
router.post('/login/', (req, res, next) => {
    //Input checker
    loginUser(req.body.email, req.body.password)
        .then( user => {
            req.session.user = user;
            res.redirect('/')
        }).catch((e) => {
            next(e)
    });
})
router.get('/register/', (req, res) => {
    res.render(path.join(viewsDir, 'register.ejs'));
})
router.post('/register/', (req, res, next) => {
    //Input checker
        createUser(req.body.email, req.body.password)
            .then( () => {
                res.redirect('/');
            })
            .catch((e) =>{
                next(e)
            });

});

router.use(isLoggedIn); //User authentication middleware

router.get('/logout', (req, res) =>{
    req.session.destroy();
    res.redirect('/');
})
router.get('/user/:id', (req, res,next) =>{
    getUserByID(req.params.id) //lookup a user
        .then( user => {
            res.render(path.join(viewsDir, 'user_show.ejs'),{"user": req.session.user, 'displayUser': user})
        })
        .catch(e => next(e));
});
router.get('/user/:id/edit', (req, res) =>{
        res.render(path.join(viewsDir, '/user_edit.ejs'), {'user': req.session.user})
});
router.post('/user/:id/edit', (req, res,next) => {
    updateUser(req.session.user.id, req.body.email, req.body.password)
        .then(() => console.log(`User ${req.session.user.email} got updated`) )
        .catch(e => next(e));
});
router.post('/user/:id/delete', (req, res,next) =>{
        deleteUser(req.session.user.id)
            .then(()=>{
                console.log(`User ${req.session.user.email} got removed!`)
                req.session.destroy();
            })
            .catch(e => next(e));
});


export let UserRouter = router;
