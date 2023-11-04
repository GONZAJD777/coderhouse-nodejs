const prompt = require("prompt-sync")();
const ProductManager = require('./manager/ProductManager.js');

const productManager = new ProductManager();

function menu() {
  let option;
  do {
    console.log('****** Menu *******');
    console.log('1 - Agregar producto');
    console.log('2 - Obtener todos los productos');
    console.log('3 - Buscar producto');
    console.log('4 - Salir');

    option = prompt('Ingrese una opción: ');

    switch (option) {
      case '1':
        chargeProduct();
        break;
      case '2':
        listProducts();
        break;
      case '3':
        searchProduct();
        break;
      case '4':
        console.log('Fin ejecucion.\n');
        break;
      default:
        console.log('Opción inválida.\n');
        break;
    }
  } while (option !== '4');
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
    confirmacion=prompt('Se dara de alta el siguiente producto, desea confirmar el alta? (Y para confirmar) -->  ');
   
    break
  }

  if (confirmacion='Y'){
    product = [title, description, price, thumbnail, code, stock];
    product = productManager.addProduct(...product);
    console.log('\nSe agrego el siguiente producto.\n', product.asPOJO());
    console.log('Fin carga datos del producto.\n');
  }else {
    console.log('Alta de producto cancelada.\n');
  }

  
}

function listProducts() {
  console.log('\nListado de todos los productos.');
  console.log(productManager.getProducts());
  console.log('Fin listado de todos los productos.\n');
}

function searchProduct() {
  console.log('\nBusqueda del producto por id.');
  const codeProduct = prompt('Ingrese el id del producto a buscar: ');
  console.log('\nResultado de la busqueda por id.\n', (productManager.getProductById(codeProduct) || 'Not Found'));
  console.log('Fin busqueda del producto por id.\n');
}

menu();
