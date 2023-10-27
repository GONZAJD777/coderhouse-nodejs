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
  console.log('\nCarga datos del producto.');
  const title = prompt('Ingrese título del producto: ');
  const description = prompt('Ingrese descripción del producto: ');

  let price;
  while (true) {
    price = parseFloat(prompt('Ingrese precio del producto: '));
    if (isNumberPositive(price)) break;
    else console.log('El precio ingresado es inválido. Ingrese solo valores numéricos mayores o iguales a 0.');
  }

  const thumbnail = prompt('Ingrese ruta de la imagen del producto: ');

  let code;
  while (true) {
    code = prompt('Ingrese código del producto: ');
    if (isEmpty(code)) {
      console.log('No se ingresaron valores para el código de producto.');
      continue;
    }

    if (!productManager.getProductByCode(code)) break;
    else console.log('El código ingresado ya existe en el sistema, por favor utilice otro código.');
  }

  let stock;
  while (true) {
    stock = parseInt(prompt('Ingrese stock del producto: '));
    if (isNumberPositive(stock)) break;
    else console.log('El stock ingresado es inválido. Ingrese solo valores numéricos mayores o iguales a 0.');
  }

  const product = productManager.addProduct(title, description, price, thumbnail, code, stock);

  console.log('\nSe agrego el siguiente producto.\n', product);
  console.log('Fin carga datos del producto.\n');
}

function isNumberPositive(value) {
  return (!isNaN(value) && value >= 0);
}

function isEmpty(value) {
  return value.trim().length === 0;
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
