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

    console.log(err);//prints more in depth err to console

    let errStatus = err.errCode; //pooling from err object
    let errMsg = err.message;

    //change err for user, convert to http codes
    switch (errStatus) {
        case USR_CODES.CREDENTIAL_ERR || USR_CODES.MISSING_USER_EMAIL:
            errStatus = '400 - Bad Request'; //Bad Request
            break;
        case USR_CODES.MISSING_USER_ID:
            errStatus = '400 - Bad Request';
            errMsg = 'User not found';
            break;
        case MSG_CODES.INPUT_ERR || USR_CODES.INPUT_ERR:
            errStatus = '400 - Bad Request';
            break;
        default:
            errStatus = '500 - Server Error';
            errMsg = 'Something went wrong';
            break;
    }
    try{
        res.render(path.join(appDir, '/views/error.ejs'), {'errMsg': errMsg, 'errStatus': errStatus})
    } catch (e) {
        console.log("Couldn't render error.ejs")
        res.status(500).send('Something went wrong');
    }
    /*
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: err.stack //change later when utilize env parameters
        //optimal: stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });*/

}
export default ErrorHandler;