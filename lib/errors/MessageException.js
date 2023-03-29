export class MessageException extends Error {
    static CODES = {
        SQL_ERR:  1000,
        INPUT_ERR: 1001
    };
    constructor(message, errCode, err) {
        super(message);
        this.name = 'MessageException';
        this.errCode = errCode || 0;
        this.stack = err.stack;
    }
}