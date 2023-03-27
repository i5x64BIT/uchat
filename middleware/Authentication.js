export function isLoggedIn(req, res, next){
    if(!req.session.user){
        res.status(401)
        res.redirect('/login')
    }
    else{
        next();
    }
}