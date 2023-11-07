const prompt = require("prompt-sync")();
const ProductManager = require('./manager/ProductManager.js');
const Product = require('./model/Product.js');

const productManager = new ProductManager();

function menu() {
  let option;
  do {
    console.log('****** Menu *******');
    console.log('1 - Agregar producto');
    console.log('2 - Obtener todos los productos');
    console.log('3 - Buscar producto');
    console.log('4 - Actualizar producto');
    console.log('5 - Eliminar producto');
    console.log('6 - Salir');
    console.log('****** Fin Menu *******\n');

    option = prompt('Ingrese una opción: ');

    switch (option) {
      case '1':
        addProduct();
        break;
      case '2':
        listProducts();
        break;
      case '3':
        searchProduct();
        break;
      case '4':
        updateProduct();
        break;
      case '5':
        deleteProduct();
        break;
      case '6':
        console.log('Fin ejecucion.\n');
        break;
      default:
        console.log('Opción inválida.\n');
        break;
    }
  } while (option !== '6');
}

function chargeProduct() {
  let ArrayProduct= [];
  let description;
  let title; 
  let thumbnail;
  let code;
  let price;
  let stock;
  let confirmacion;

    while (true) {
    console.log('\nCarga datos del producto.');
    title = prompt('Ingrese TITULO del producto: ');
    ArrayProduct.push(title);
    console.log(ArrayProduct);
    description = prompt('Ingrese DESCRIPCION del producto: ');
    ArrayProduct.push(description);
    console.log(ArrayProduct);
    code = prompt('Ingrese CÓDIGO del producto: ');
    ArrayProduct.push(code);
    console.log(ArrayProduct);
    stock = parseInt(prompt('Ingrese STOCK del producto: '));
    ArrayProduct.push(stock);
    console.log(ArrayProduct);
    price = parseFloat(prompt('Ingrese PRECIO del producto: '));
    ArrayProduct.push(price);
    console.log(ArrayProduct);
    thumbnail = prompt('Ingrese RUTA DE IMAGEN del producto: ');
    ArrayProduct.push(thumbnail);
    console.log(ArrayProduct);
    confirmacion=prompt('Desea confirmar la operacion? (Y para confirmar) -->  ');
    //console.log('\n');
   
    break
  }

  if (confirmacion='Y'){
    //product = [title, description, price, thumbnail, code, stock];
    //console.log('\nSe agrego el siguiente producto.\n', product.asPOJO());
    //console.log('Fin carga datos del producto.\n');
    //console.log('\nCREANDO EL PRODUCTO.\n', new Product(title, description, price, thumbnail, code, stock), '\n');
      
    return new Product(title, description, price, thumbnail, code, stock);
  
  }
  else {
    console.log('Alta de producto cancelada.\n');
  }

  
}

function chargeIdProduct() {
  let id;
  while (true) {
    id = parseInt(prompt('Ingrese el id del producto: '));
    if (isNumberPositive(id)) break;
    else console.log('El id ingresado es inválido. Ingrese solo valores numéricos mayores a 0.');
  }
  return id;
}


function addProduct() {
  console.log('\nAgregar producto.');
  const product = chargeProduct();
  let result = productManager.addProduct(product);
  console.log(result);
}

function updateProduct() {
  console.log('\nActualizar producto.');
  const product = (productManager.getProductById(chargeIdProduct()) || false);
  if (product) {
    const updateProduct = chargeProduct();
    updateProduct.id = product.id;
    let result = productManager.updateProduct(updateProduct);
    console.log(result);
  }
  else {
    console.log('\nNo se encontro productos para el id ingresado.\n');
  }
}

function deleteProduct() {
  console.log('\nEliminar el producto por id.');
  const product = (productManager.getProductById(chargeIdProduct()) || false);
  if (product) {
    productManager.deleteProduct(product.id);
    console.log('\nSe elimino el producto correctamente.\n');
  }
  else {
    console.log('\nNo se encontro productos para el id ingresado.\n');
  }
}

function listProducts() {
  console.log('\nListado de todos los productos.');
  console.log(productManager.getProducts());
  console.log('Fin listado de todos los productos.\n');
}

function searchProduct() {
  console.log('\nBusqueda del producto por id.');
  const codeProduct = parseInt(prompt('Ingrese el id del producto a buscar: '));
  console.log('\nResultado de la busqueda por id.\n', (productManager.getProductById(codeProduct) || 'Not Found'));
  console.log('Fin busqueda del producto por id.\n');
}

function isNumberPositive(value) {
  return (!isNaN(value) && value >= 0);
}

menu();
