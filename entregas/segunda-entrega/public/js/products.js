const socketClient = io();


const formAddToCart = document.getElementById("formAddToCart");
formAddToCart.addEventListener("submit", (evt) => {
    evt.preventDefault();
    
    let cartId = document.getElementById("cartId").value;
    let productId = evt.submitter.id;

    socketClient.emit("AddToCart", cartId,productId);
    //let id = idValue;//se remueve el parseo para trabajar con los ID alfanumericos generados por MONGODB
    //let id = parseInt(idValue);
    
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Agregado al carrito",
        showConfirmButton: false,
        timer: 1500,
    });
});