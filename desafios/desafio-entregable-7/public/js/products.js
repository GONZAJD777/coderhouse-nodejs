

const logoutForm = document.getElementById('logoutForm');
const addToCartForm = document.getElementById('addToCartForm');

logoutForm.addEventListener('submit', async e => {
    e.preventDefault();
    const data = new FormData(logoutForm);
    const obj = {};

    data.forEach((value, key) => obj[key] = value);
    const response = await fetch('/api/sessions/logout', {
        method: 'POST',
        body: JSON.stringify(obj),
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



