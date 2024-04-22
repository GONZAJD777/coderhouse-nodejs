
# Entrega Final

Entrega Final correspondiente al curso Programacion Backend Node JS 

## Operaciones por tarea

### Operaciones de Usuario

#### Registrar Usuario

##### Alta manual de datos
```http
  POST /api/sessions/register
```
##### Registrar con Github
```http
  GET /api/sessions/github
```

#### Login de usuario

##### Alta manual de datos
```http
  POST /api/sessions/login
```
##### Registrar con Github
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