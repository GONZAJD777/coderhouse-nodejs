const logoutForm = document.getElementById('logoutForm');

window.addEventListener('load', async () => {
    const response = await fetch('/api/sessions/current', {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json'
        }
    });
    if (response.status != 200) {
        alert('necesitas loguearte para ver esta info!');
        return (window.location.href = '/login');
    }else {
        const result = await response.json()
        const user = result.payload;

        const userName = document.getElementById('UserName')
        const userRole = document.getElementById('UserRole')
        const userEmail = document.getElementById('UserEmail')
        const userRef = document.getElementById('UserRef')
        const cartRef = document.getElementById('CartRef')
        const cartId = document.getElementById('cartId')


        userName.innerText= user.firstName + ' ' + user.lastName;
        userRole.innerText= user.role;
        userEmail.innerText= user.email;
        cartRef.href="/carts/"+user.cart;
        userRef.href="/users/"+user._id;
        if(cartId){cartId.value=user.cart}
        
    }
})

logoutForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(logoutForm);
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