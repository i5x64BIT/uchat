export class UserException extends  Error{
    static CODES = {
        SQL_ERR: 1100,
        INPUT_ERR: 1101,
        MISSING_USER: 1102,
        MISSING_USER_EMAIL: 1103,
        MISSING_USER_ID: 1104,
        CREDENTIAL_ERR: 1105,
        UPDATE_ERR: 1106,
        DELETE_ERR: 1107,
        CREATE_USER: 1108,
        EMAIL_IN_USE: 1109
    }
    constructor(message, errCode, e) {
        super(message);
        this.name = 'UserException';
        this.errCode = errCode || 0;
        e ? this.stack = e.stack : null;
    }
}