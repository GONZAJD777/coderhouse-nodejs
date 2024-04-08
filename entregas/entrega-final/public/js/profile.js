

const changeRoleForm = document.getElementById('changeRoleForm');

changeRoleForm.addEventListener('submit', async e => {
    e.preventDefault();
    const profileChangeRoleUserId = document.getElementById('profileChangeRoleUserId')

    const response = await fetch('/api/users/premium/'+profileChangeRoleUserId.value, {
        method: 'PUT',
        headers: {
            "Content-Type": 'application/json'
        }
    })
            if (response.status === 200) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Se modifico el Rol del usuario",
                    showConfirmButton: false,
                    timer: 1500,
                });

                const refreshResponse=await fetch('/api/sessions/refreshToken', {
                    method: 'PUT',
                    headers: {
                        "Content-Type": 'application/json'
                    }});
                
                if (refreshResponse.status === 200){
                    window.location.href='/users/'+profileChangeRoleUserId.value;
                }       
            } else if (response.status === 401){
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "No tienes permiso para realizar esta tarea",
                    showConfirmButton: false,
                    timer: 10000,
                });

            } else {
                Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Es necesario cargar toda la documentacion",
                showConfirmButton: false,
                timer: 10000,
            });}

    
})


window.addEventListener('load', async e => {   
    e.preventDefault();
    const idDoc = document.getElementById('idDoc')
    const addDoc = document.getElementById('addDoc')
    const accDoc = document.getElementById('accDoc')
    const idDocCheck = document.getElementById('idDocCheck')
    const addDocCheck = document.getElementById('addDocCheck')
    const accDocCheck = document.getElementById('accDocCheck')
    const profileUserAvatar = document.getElementById('profileUserAvatar')
    const profileChangeRoleButton = document.getElementById('profileChangeRoleButton')
    const profileChangeRoleUserRole = document.getElementById('profileChangeRoleUserRole')

    if(idDoc.innerText){idDocCheck.src="/img/icons/check_24.png"} else {idDocCheck.src="/img/icons/delete_24.png"};
    if(addDoc.innerText){addDocCheck.src="/img/icons/check_24.png"} else {addDocCheck.src="/img/icons/delete_24.png"};
    if(accDoc.innerText){accDocCheck.src="/img/icons/check_24.png"} else {accDocCheck.src="/img/icons/delete_24.png"};
    if(profileUserAvatar.currentSrc==""){profileUserAvatar.src="/img/default.avatar.png"};
    if(profileChangeRoleUserRole.value==="user"){profileChangeRoleButton.value="Cambiar a PREMIUM"}else{profileChangeRoleButton.value="Cambiar a USER"}   
    })




