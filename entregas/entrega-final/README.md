
# Entrega Final

Entrega Final correspondiente al curso Programacion Backend Node JS 

## Documentacion de operaciones

### Operaciones de Sesion

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

#### 3. Verificar token  de usuario logeado
Esta operacion devuelve la informacion del token del usuario que envia el request, es necesario estar logeado (tener un token valido)
```http
  GET /api/sessions/current
```

#### 4. Refrescar el token
Esta operacion se agrego para poder modificar la informacion que tiene el usuario en su token sin necesidad de deslogear y volver a logear.
Surgio del requerimiento de contar con un endpoint para modificar el rol del usuario entre "user" y "premium", ambos cuentan con permisos diferentes y por ende es necesario actualizar sus credenciales para reflejar el nuevo estado.
```http
  PUT /api/sessions/refreshToken
```

#### 5. Modificar Password
Para modificar password es necesario primero obtener el link de modificacion intruduciendo la direccion de correo, esto enviara un email a la cuenta con el link, al hacer click sera redirigido a la pagina para modificar el password, sin embargo lo importante es que se establece un JWT el cual se agrega a las cookies el cual se utiliza para verificar la valides del link.

El primer paso para resetear sera ejecutar:
```http
  POST /api/sessions/resetLink
```
El segundo paso para resetear y luego de haber hecho click en el link, sera ejecutar:
```http
  PUT /api/sessions/resetPass
```

#### 6. Cerrar session o Logout
Ejecutar 
```http
  DELETE /api/sessions/logout
```

### Operaciones sobre usuario
#### 1. Creacion de cuenta

























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
