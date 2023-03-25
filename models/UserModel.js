export class UserModel {
    constructor({ id =null, email =null, password =null }) {
        this.id = id;
        this.email = email;
        this.password = password;
    }
}