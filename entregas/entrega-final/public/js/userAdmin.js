
    const userAdminForm = document.getElementById('userAdminForm');
    const profileUserCard = document.getElementById('profileUserCard')
    //form buttons
    const findUserText = document.getElementById('findUserText')
    const findUserButtton = document.getElementById('findUserButtton')
    const deleteUserButtton = document.getElementById('deleteUserButtton')
    const setUserRoleButtton = document.getElementById('setUserRoleButtton')
    //user card fields
    const profileUserId = document.getElementById('profileUserId')
    const profileUserAvatar = document.getElementById('profileUserAvatar')
    const profileUserFName = document.getElementById('profileUserFName')
    const profileUserLName = document.getElementById('profileUserLName')
    const profileUserRole = document.getElementById('profileUserRole')
    const profileUserAge = document.getElementById('profileUserAge')
    const profileUserCart = document.getElementById('profileUserCart')

    //doc user card fields
    const idDoc = document.getElementById('idDoc')
    const accDoc = document.getElementById('accDoc')
    const addDoc = document.getElementById('addDoc')
    const idDocCheck = document.getElementById('idDocCheck')
    const addDocCheck = document.getElementById('addDocCheck')
    const accDocCheck = document.getElementById('accDocCheck')

    

userAdminForm.addEventListener('submit', async e => {
    e.preventDefault();
        
    if (e.submitter.id===findUserButtton.id  ){

        this.resetFields();

        if(findUserText.value!=""){

            const responseGetUser = await fetch('/api/users/'+findUserText.value, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json'
                }
            });
            const resultGetUser = await responseGetUser.json()
            const user = resultGetUser.Object;

            if (user){
                if(responseGetUser.status===200){

                    

                    if(user.documents){
                        user.documents.forEach(element => {
                            switch (element.name){
                                case "avatar": 
                                    element.reference = element.reference.replace("public","")
                                    profileUserAvatar.src=element.reference;
                                break;
                                case "userIdDoc" :
                                    idDoc.innerText=element.reference;    
                                break;
                                case "userAddressDoc" :
                                    addDoc.innerText=element.reference;
                                break;  
                                case "userAccountDoc" :
                                    accDoc.innerText=element.reference;
                                break;    
                            }
                        });}
                    profileUserId.value = user.id;
                    profileUserFName.innerText = "First Name: "+user.firstName;
                    profileUserLName.innerText = "Last Name: "+user.lastName;
                    profileUserRole.innerText = "Role: "+user.role;
                    profileUserAge.innerText = "Edad: "+user.age;
                    profileUserCart.innerText = "Carrito: "+user.cart;

                    if(idDoc.innerText){idDocCheck.src="/img/icons/check_24.png"} else {idDocCheck.src="/img/icons/delete_24.png"};
                    if(addDoc.innerText){addDocCheck.src="/img/icons/check_24.png"} else {addDocCheck.src="/img/icons/delete_24.png"};
                    if(accDoc.innerText){accDocCheck.src="/img/icons/check_24.png"} else {accDocCheck.src="/img/icons/delete_24.png"};
                    //if(profileUserAvatar.currentSrc==""){profileUserAvatar.src="/img/default.avatar.png"};
                    
                    profileUserCard.style.display="block";//mostramos la tarjeta una vez que se rellenaron todos los campos
                    deleteUserButtton.style.display=""
                    setUserRoleButtton.style.display=""
                } 
            } else {
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "El usuario no existe",
                    showConfirmButton: false,
                    timer: 10000,
                });
            }
        }else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Es necesario definir el Id de Usuario",
                showConfirmButton: false,
                timer: 10000,
            });
        }        
    }

    if (e.submitter.id===deleteUserButtton.id){

        const responseDeleteUser = await fetch('/api/users/'+profileUserId.value, {
            method: 'DELETE',
            headers: {
                "Content-Type": 'application/json'
            }
        });

        if(responseDeleteUser.status===200){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Se elimino el usuario",
                showConfirmButton: false,
                timer: 1500,
            });
            window.location.href='/userAdmin';
        }

    }

    if (e.submitter.id===setUserRoleButtton.id){

        const responseSetUserRole = await fetch('/api/users/premium/'+profileUserId.value, {
            method: 'PUT',
            headers: {
                "Content-Type": 'application/json'
            }
        });
        if(responseSetUserRole.status===200){
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Se ha modificado el Rol del usuario",
                showConfirmButton: false,
                timer: 1500,
            });
            window.location.href='/userAdmin';
        }else {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Es necesario cargar toda la documentacion",
                showConfirmButton: false,
                timer: 10000,
        });}

    }

})   

function resetFields () {

    profileUserCard.style.display="none"
    profileUserAvatar.src="/img/default.avatar.png";
    idDoc.innerText="";    
    addDoc.innerText="";
    accDoc.innerText="";
    idDocCheck.src="/img/icons/delete_24.png";
    addDocCheck.src="/img/icons/delete_24.png";
    accDocCheck.src="/img/icons/delete_24.png";
    profileUserId.value = "";
    profileUserFName.innerText = "First Name: ";
    profileUserLName.innerText = "Last Name: ";
    profileUserRole.innerText = "Role: ";
    profileUserAge.innerText = "Edad: ";
    profileUserCart.innerText = "Carrito: ";
    deleteUserButtton.style.display="none"
    setUserRoleButtton.style.display="none"

}