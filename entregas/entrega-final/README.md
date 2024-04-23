
# Entrega Final

Entrega Final correspondiente al curso Programacion Backend Node JS 

## Documentacion de operaciones

### Operaciones de Usuario

#### 1. Creacion de cuenta
Para crear cuenta es posible realizarlo por 2 metodos
Cargando los datos manualmente:
```http
  POST /api/sessions/register
```
o bien logear a travez de github, si es la primera vez que logea se creara la cuenta y se iniciara sesion
(desde swagger devuelve error CORS por lo que se recomienda logear desde front de login)
```http
  GET /api/sessions/github
```
#### 2. Login de usuario
Para logear, de igual manera que para registrar la cuenta, puede realizarse cargando las credenciales manualmente o bien a travez de github
```http
  POST /api/sessions/login
```
```http
  GET /api/sessions/github
```























#### Obtener un producto

```http
  GET /api/products/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id del producto |

#### Agregar un producto

```http
  POST /api/products
```

#### Actualizar un producto

```http
  PUT /api/products/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id del producto |

#### Eliminar un producto

```http
  DELETE /api/products/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id del producto |

## API Carts

#### Obtener todos los carritos de compras

```http
  GET /api/carts
```

#### Obtener un carrito de compra

```http
  GET /api/carts/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id del carrito de compra |

#### Crear carrito de compra

```http
  POST /api/carts
```

#### Agregar un producto al carrito de compra

```http
  POST /api/carts/${cid}/products/${pid}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `cid`      | `int` | **Required**. Id del carrito de compras |
| `pid`      | `int` | **Required**. Id del producto |

#### Agregar producto por cantidad al carrito de compra

```http
  POST /api/carts/${cid}/products/${pid}/${units}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `cid`      | `int` | **Required**. Id del carrito de compras |
| `pid`      | `int` | **Required**. Id del producto |
| `units`      | `int` | **Required**. Cantidad de productos |

#### Eliminar el carrito de compra

```http
  POST /api/carts/${id}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `int` | **Required**. Id del carrito de compras |

#### Eliminar producto del carrito de compra

```http
  DELETE /api/carts/${cid}/products/${pid}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `cid`      | `int` | **Required**. Id del carrito de compras |
| `pid`      | `int` | **Required**. Id del producto |

#### Eliminar producto por cantidad del carrito de compra

```http
  DELETE /api/carts/${cid}/products/${pid}/${units}
```
| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `cid`      | `int` | **Required**. Id del carrito de compras |
| `pid`      | `int` | **Required**. Id del producto |
| `units`      | `int` | **Required**. Cantidad de productos |



## Autor

- [@jwqm](https://github.com/Jwqm)


![Logo](https://upload.wikimedia.org/wikipedia/commons/d/d9/Node.js_logo.svg)


## Run Locally

Clone the project

```bash
  gh repo clone Jwqm/coderhouse-nodejs
```

Go to the project directory

```bash
  cd entregas/primera-entrega
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```
