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
formAddProduct.addEventListener("submit", (evt) => {
    evt.preventDefault();

    let title = formAddProduct.elements.title.value;
    let description = formAddProduct.elements.description.value;
    let stock = formAddProduct.elements.stock.value;
    let thumbnail = formAddProduct.elements.thumbnail.value;
    let category = formAddProduct.elements.category.value;
    let price = formAddProduct.elements.price.value;
    let code = formAddProduct.elements.code.value;

    socketClient.emit("addProduct", {
        title,
        description,
        stock,
        thumbnail,
        category,
        price,
        code,
    });

    formAddProduct.reset();
    formAddProduct.style.display = "none";
});

const formDeleteProduct = document.getElementById("formDeleteProduct");
formDeleteProduct.addEventListener("submit", (evt) => {
    evt.preventDefault();

    let idValue = formDeleteProduct.elements.id.value;
    let id = idValue;//se remueve el parseo para trabajar con los ID alfanumericos generados por MONGODB
    //let id = parseInt(idValue);
    socketClient.emit("deleteProduct", id);
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Producto eliminado",
        showConfirmButton: false,
        timer: 1500,
    });

    formDeleteProduct.reset();
    formDeleteProduct.style.display = "none";
});