const addToCartForm = document.getElementById('addToCartForm');

addToCartForm.addEventListener('submit', async e => {
    e.preventDefault();
    let cid = document.getElementById("sidebarCartId").value;
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
            } else if (response.status === 401){
                Swal.fire({
                    position: "top-end",
                    icon: "error",
                    title: "No puedes agregar tus propios productos al carrito",
                    showConfirmButton: false,
                    timer: 10000,
                });

            } else {
                Swal.fire({
                position: "top-end",
                icon: "error",
                title: "No fue posible agregar el producto al carrito",
                showConfirmButton: false,
                timer: 10000,
            });}

})



