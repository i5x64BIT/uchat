export function asyncUserHandler(e){
    if(e.name === "User not found"){

    }else{
        console.error(`Async Error: \x1b[33m${e}\x1b[0m`);
        console.error(e.stack);
    }
}
export function asyncMessegeHandler(e){
    console.error(`Async Error: \x1b[33m${e}\x1b[0m`);
    console.error(e.stack);
}