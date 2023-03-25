function onClick() {
    const res = confirm("Are you sure? there is no going back!");
    if(res){
        fetch(document.URL.replace('edit', 'delete'), { method: 'POST'})
            .then(()=> {alert('User successfully removed')})
            .catch(()=> {alert('Something went wrong, try again later.')})
    }
}