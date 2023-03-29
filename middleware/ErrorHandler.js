import path from "path";
import {appDir} from "../app.js";
import {UserException} from "../lib/errors/UserException.js";
import {MessageException} from "../lib/errors/MessageException.js";
const ErrorHandler = (err, req, res, next) => {
    //1000 to 1999 - Message exception codes
    //1100 to 1199 - User exception codes
    //let errStatus = err.statusCode || 500;
    const USR_CODES = UserException.CODES;
    const MSG_CODES = MessageException.CODES;

    console.log(Object.keys(err));
    if(process.env.DEBUG_MODE !== 1){
        err.stack = {}
    }
    let errStatus = err.errCode; //pooling from err object
    let errMsg = err.message;

    //change err for user, convert to http codes
    switch (errStatus) {
        case USR_CODES.INPUT_ERR:
            errStatus = 400;
            break;
        case USR_CODES.CREDENTIAL_ERR || USR_CODES.MISSING_USER_EMAIL:
            errStatus = 400; //Bad Request
            break;
        case USR_CODES.MISSING_USER_ID:
            errStatus = 400;
            errMsg = 'User not found';
            break;
        case MSG_CODES.INPUT_ERR || USR_CODES.INPUT_ERR:
            errStatus = 500;
            break;
        case USR_CODES.EMAIL_IN_USE:
            errStatus = 400;
            errMsg = 'This email is already used, try another'
            break;
        default:
            errStatus = 500;
            errMsg = 'Something went wrong';
            break;
    }
    try{
        res.status(errStatus).render(path.join(appDir, '/views/error.ejs'), {'errMsg': errMsg, 'errStatus': errStatus})
    } catch (e) {
        console.log("Couldn't render error.ejs")
        res.status(500).send('Something went wrong');
    }

}
export default ErrorHandler;