const socketClient = io();

socketClient.on("sendProducts", (listProducts) => {
    updateProductList(listProducts);
});

function updateProductList(listProducts) {
    const productListContainer = document.getElementById("productListContainer");

    productListContainer.innerHTML = "";

    listProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "card";
        productCard.id = product.id;

        const cardBody = document.createElement("div");
        cardBody.className = "card-body";

        const productImage = document.createElement("img");
        productImage.className = "card-img";
        productImage.src = product.thumbnail;
        productImage.alt = product.title;

        const productTitle = document.createElement("h5");
        productTitle.className = "card-title";
        productTitle.textContent = product.title;      

        const cardInfo = document.createElement("div");
        cardInfo.className = "card-info";

        const productDescription = document.createElement("p");
        productDescription.className = "card-text";
        productDescription.textContent = product.description;

        const productCategory = document.createElement("p");
        productCategory.className = "card-text";
        productCategory.textContent = `Categoría: ${product.category}`;

        const productCode = document.createElement("p");
        productCode.className = "card-text";
        productCode.textContent = `Código: ${product.code}`;

        const productStock = document.createElement("p");
        productStock.className = "card-text";
        productStock.textContent = `Stock: ${product.stock}`;

        const productPrice = document.createElement("p");
        productPrice.className = "card-text";
        productPrice.textContent = `Precio: $${product.price}`;

        const productId = document.createElement("p");
        productId.className = "card-text";
        productId.textContent = `Id: ${product._id}`;

        // Agrega los elementos al cardBody
        cardBody.appendChild(productImage);
        cardBody.appendChild(productTitle);
        cardBody.appendChild(cardInfo);
        cardInfo.appendChild(productDescription);
        cardInfo.appendChild(productCategory);
        cardInfo.appendChild(productCode);
        cardInfo.appendChild(productStock);
        cardInfo.appendChild(productPrice);
        cardInfo.appendChild(productId);

        // Agrega el cardBody al productCard
        productCard.appendChild(cardBody);

        // Agrega el productCard al contenedor de la lista
        productListContainer.appendChild(productCard);
      
    });
}

const formAddProduct = document.getElementById("formAddProduct");
formAddProduct.addEventListener("submit",async (evt) => {
    evt.preventDefault();

    let title = formAddProduct.elements.title.value;
    let description = formAddProduct.elements.description.value;
    let stock = formAddProduct.elements.stock.value;
    let thumbnail = formAddProduct.elements.thumbnail.value;
    let category = formAddProduct.elements.category.value;
    let price = formAddProduct.elements.price.value;
    let code = formAddProduct.elements.code.value;

    const obj = { title,description,stock,thumbnail,category,price,code };

    const response = await fetch('/api/products', {
        method: 'POST',
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": 'application/json'
        }
    });

    if(response.status==200){
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto creado correctamente",
            showConfirmButton: false,
            timer: 1500,
        });
     } else if (response.status==401){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "No tienes permiso para crear productos",
            showConfirmButton: false,
            timer: 10000,
        });
     } else {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error y no es posible crear el producto",
            showConfirmButton: false,
            timer: 10000,
        });
     }

    formAddProduct.reset();
    //formAddProduct.style.display = "none";
});

const formDeleteProduct = document.getElementById("formDeleteProduct");
formDeleteProduct.addEventListener("submit", async (evt) => {
    evt.preventDefault();

    let idValue = formDeleteProduct.elements.id.value;
    let id = idValue;
   
     const response = await fetch('/api/products/'+id, {
         method: 'DELETE',
         headers: {
             "Content-Type": 'application/json'
         }
     });
     if(response.status==200){
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Producto eliminado",
            showConfirmButton: false,
            timer: 1500,
        });
     } else if (response.status==401){
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "No puedes borrar productos de otros usuarios",
            showConfirmButton: false,
            timer: 10000,
        });
     } else {
        Swal.fire({
            position: "top-end",
            icon: "error",
            title: "Ocurrio un error y no es posible borrar el producto",
            showConfirmButton: false,
            timer: 10000,
        });
     }
   

    formDeleteProduct.reset();
    //formDeleteProduct.style.display = "none";
});