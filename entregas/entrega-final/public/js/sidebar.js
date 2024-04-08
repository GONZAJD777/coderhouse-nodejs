const sidebarLogoutForm = document.getElementById('sidebarLogoutForm');

window.addEventListener('load', async e => {
    e.preventDefault();
    const responseCurrent = await fetch('/api/sessions/current', {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json'
        }
    });
    if (responseCurrent.status != 200) {
        alert('necesitas loguearte para ver esta info!');
        return (window.location.href = '/login');
    }else {
        const resultCurrent = await responseCurrent.json()

        const responseGetUser = await fetch('/api/users/'+resultCurrent.payload.id, {
            method: 'GET',
            headers: {
                "Content-Type": 'application/json'
            }
        });

        const resultGetUser = await responseGetUser.json()
        const user = resultGetUser.Object;

        const sidebarUserName = document.getElementById('sidebarUserName')
        const sidebarUserRole = document.getElementById('sidebarUserRole')
        const sidebarUserEmail = document.getElementById('sidebarUserEmail')
        const sidebarUserRef = document.getElementById('sidebarUserRef')
        const sidebarCartRef = document.getElementById('sidebarCartRef')
        const sidebarCartId = document.getElementById('sidebarCartId')
        const sidebarUserAvatar = document.getElementById('sidebarUserAvatar')
        const sidebarUserAdminListItem = document.getElementById('sidebarUserAdminListItem')
        const sidebarProductAdminListItem = document.getElementById('sidebarProductAdminListItem')
        const sidebarChatListItem = document.getElementById('sidebarChatListItem')


        sidebarUserName.innerText= user.firstName + ' ' + user.lastName;
        sidebarUserRole.innerText= user.role;
        sidebarUserEmail.innerText= user.email;
        sidebarUserRef.href="/users/"+user.id;
        sidebarCartRef.href="/carts/"+user.cart;

        sidebarUserAdminListItem.style.display='none';
        sidebarProductAdminListItem.style.display='none';
        sidebarChatListItem.style.display='none';
        
        if(sidebarCartId)sidebarCartId.value=user.cart;
        
        if(user.role=='admin'){
            sidebarUserAdminListItem.style.display='block';
            sidebarProductAdminListItem.style.display='block';
            sidebarChatListItem.style.display='none';
        }
        
        if(user.role=='premium') {
            sidebarUserAdminListItem.style.display='none';
            sidebarProductAdminListItem.style.display='block';
            sidebarChatListItem.style.display='block';
        }
        if(user.role=='user') {
            sidebarUserAdminListItem.style.display='none';
            sidebarProductAdminListItem.style.display='none';
            sidebarChatListItem.style.display='block';
        }

        if(user.documents){
        user.documents.forEach(element => {
            if(element.name==="avatar"){
                element.reference = element.reference.replace("public","")
                sidebarUserAvatar.src=element.reference;
            }
        });}

        
        
        
        
    }
})

sidebarLogoutForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(sidebarLogoutForm);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    const response = await fetch('/api/sessions/logout', {
        method: 'DELETE',
        headers: {
            "Content-Type": 'application/json'
        }
    })

            if (response.status === 200) {
                window.location.replace('/login');
            }
})