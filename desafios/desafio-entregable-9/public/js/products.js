

window.addEventListener('load', async () => {
    const response = await fetch('/api/sessions/current', {
        method: 'GET',
        headers: {
            "Content-Type": 'application/json'
        }
    });
    if (response.status != 200) {
        alert('necesitas loguearte para ver esta info!')
        return (window.location.href = '/login')
    }else {
        const result = await response.json()
        const user = result.payload;

        const userName = document.getElementById('UserName')
        const userRole = document.getElementById('UserRole')
        const userEmail =  document.getElementById('UserEmail')
        const userCart = document.getElementById('UserCart')
        const cartRef = document.getElementById('CartRef')
        const cartId = document.getElementById('cartId')


        userName.innerText= user.firstName + ' ' + user.lastName;
        userRole.innerText= user.role;
        userEmail.innerText= user.email;
        userCart.innerText= "Carrito Activo: "+ user.cart;
        cartRef.href="/carts/"+user.cart;
        cartId.value=user.cart;
    }
    
})

const logoutForm = document.getElementById('logoutForm');
const addToCartForm = document.getElementById('addToCartForm');

logoutForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(logoutForm);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    const response = await fetch('/api/sessions/current', {
        method: 'DELETE',
        headers: {
            "Content-Type": 'application/json'
        }
    })

    if (response.status === 200) {
        window.location.replace('/login');
    }
})

addToCartForm.addEventListener('submit', async e => {
    e.preventDefault();
    let cid = document.getElementById("cartId").value;
    let pid = e.submitter.id;
    const data = new FormData(addToCartForm);
    const obj = {cid,pid};

    data.forEach((value, key) => obj[key] = value);
    const response = await fetch('/api/carts/AddToCart', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    })

    if (response.status === 200) {
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Agregado al carrito",
            showConfirmButton: false,
            timer: 1500,
        });
    }
})



