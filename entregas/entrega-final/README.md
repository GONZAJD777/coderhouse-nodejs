
# Entrega Final

Entrega Final correspondiente al curso Programacion Backend Node JS 

## Documentacion de operaciones
Para realizar cualquier operacion, exceptuando el registro y logeo, es necesario primero logearse, una vez realizado esto, se podra ejecutar cualquier operacion que permita el rol del usuario logeado.

<details>
<summary>Operaciones de sesion </summary>
  
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
</details>


<details>
<summary>Operaciones sobre usuario</summary>
  
#### 1. Listar todos los usuarios
Esta funcion esta reservada para el administrador, y solo puede ejecutarla un usuario con el rol "admin".
Listara todos los usuarios con informacion reducida.

```http
  GET /api/users
```
#### 2. Buscar usuario
Este endpoint esta destinado a devolver toda la informacion de 1 usuario particular, puede ser ejecutada por un usuario con rol 'admin' o bien por el propio usuario tanto rol 'user' como 'premium'.
Es similar a la funcionalidad de /api/sessions/current sin embargo el request puede realizarse con el id del usuario, esta destinada para que el admin pueda verificar el estado de la cuenta de un usuario.
```http
  GET /api/users/{uid}
```
#### 2. Cargar documentacion de usuario
Este endpoint esta destinado a que el usuario pueda cargar la documentacion que la plataforma requeire para establecer el rol 'premium' en la cuenta.
Puede ser ejecutada por el usuario con rol 'user' o 'premium' en su propia cuenta, o bien el admin en la cuenta de otro usuario.
```http
  POST /api/users/{uid}/documents
```
#### 3. Cambiar rol de usuario
Este endpoint se diseño para que el usuario modifique su rol de usuario de 'user' a 'premium' y viceversa. 
Requiere tener toda la documentacion cargada para pasar de 'user' --> 'premium' pero no en sentido contrario, ademas si se da este ultimo caso, la documentacion cargada en la cuenta del usuario se elimina por considerarse que si se ha hecho downgrade de la cuenta es porque la documentacion no fue correctamente cargada.
Esta operacion puede ser realizada por cualquier usuario sobre su cuenta personal, en ambos sentidos y el administrado puede modificar el rol de cualquier cuenta (excepto de la cuenta admin)
El orden de las operaciones para cambiar un usuario de rol 'user' a 'premium':

##### a. Logearse con la cuenta del usuario con rol 'user' con alguna de las operaciones de login:
```http
  POST /api/sessions/login
```
##### b. Cargar la documentacion del usuario que se requiere modificar el rol con el id del usuario {uid} a modificar:
```http
  POST /api/users/{uid}/documents
```
##### c. Ejecutar la operacion de upgrade con el id de usuario a realizar el upgrade {uid}:
```http
  PUT /api/users/premium/{uid}
```

#### 4. Elimina Usuario
Este enpoint esta orientado al uso exclusivo del administrador, permite eliminar por completo 1 usuario de la base.

##### a. Logearse como administrador:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion DELETE del usuario con el id de usuario {uid} a eliminar:
```http
  DELETE /api/users/{uid}
```
#### 5. Eliminar Usuarios inactivos
Este enpoint esta orientado al uso exclusivo del administrador, permite eliminar por completo TODOS los usuarios INACTIVOS por 48hs.

##### a. Logearse como administrador:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion DELETE:
```http
  DELETE /api/users/clearInactives
```
</details>

<details>
<summary>Operaciones sobre productos</summary>
  
#### 1. Listar TODOS los productos
Este endpoint esta destinado a mostrar la informacion de todos los productos creados, cualquier tipo de usuario puede realizar esta operacion siempre que este logeado.

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion GET:
```http
  GET /api/products
```

#### 2. Buscar un productos
Endpoint destinado a la busqueda de 1 producto en particular, cualquier tipo de usuario puede realizar esta operacion siempre que este logeado.

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion GET con el id de producto {pid} a buscar:
```http
  GET /api/products/{pid}
```

#### 3. Crear producto
Endpoint destinado a la creacion de productos, esta operacion solo puede ser realizada por usuario con role 'premium' o 'admin'

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion GET:
```http
  POST /api/products
```

#### 4. Actualizar un productos
Endpoint a modificar un producto en particular, solo usuarios con rol 'premium' y 'admin' pueden actualizar un producto, el usuario 'premium' solo puede actualizar sus propios productos, el usuario 'admin' puede actualizar tanto sus productos como los de otros usuarios. 

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion PUT con el id de producto {pid} a actualizar:
```http
  PUT /api/products/{pid}
```

#### 5. Eliminar un productos
Endpoint a eliminar un producto en particular, solo usuarios con rol 'premium' y 'admin' pueden eliminar un producto, el usuario 'premium' solo puede eliminar sus propios productos, el usuario 'admin' puede eliminar tanto sus productos como los de otros usuarios. 
Si el producto pertenece a un usuario con rol 'premium' en el momento de ser eliminado, se le notificara via email de la eliminacion del mismo, notificando los detalles del producto y quien elimino el producto.

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion PUT con el id de producto {pid} a eliminar:
```http
  DELETE /api/products/{pid}
```
</details>


<details>
<summary>Operaciones sobre carritos</summary>
  
#### 1. Listar TODOS los carritos
Endpoint destinado al Administrador, permite visualizar TODOS los carritos de TODOS los usuarios.

##### a. Si no se encuentra logeado, realizar la operacion de login con credenciales de Administrador:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion GET:
```http
  GET /api/carts
```
#### 2. Buscar un carrito
Endpoint destinado a visualizar los articulos de un carrito en particular, usuarios con rol 'user' y 'premium' solo pueden visualizar su propio carrito, el usuario 'admin' puede buscar TODOS los carritos.

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion GET con el id de carrito {cid} a buscar:
```http
  GET /api/carts/{cid}
```

#### 3. Crear un carrito
Endpoint destinado a crear un carrito, destinado solo al admin.

##### a. Si no se encuentra logeado, realizar la operacion de login con credenciales de Administrador:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion POST :
```http
  POST /api/carts
```
#### 4. Actualizar el Detalle del carrito carrito
Endpoint destinado a modificar por completo el detalle del carrito, este reemplaza totalmente los items con del detalle con sus cantidades con las que se pasan como parametro.
Solo utilizable por el Administrador, este endpoint no valida si el producto pertenece o no al usuario dueño del carrito.

##### a. Si no se encuentra logeado, realizar la operacion de login con credenciales de Administrado:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion PUT con el id de carrito {cid} a modificar:
```http
  PUT /api/carts/{cid}
```

#### 5. Limpiar carrito
Este endpoint se creo para limpiar el carrito, usuarios con rol 'user' y 'premium' solo pueden ejecutar esta operacion sobre su propio carrito, el usuario con rol 'admin' puede ejecutar la operacion sobre el carrito de cualquier usuario.

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion DELETE con el id de carrito {cid} a limpiar:
```http
  DELETE /api/carts/{cid}
```

#### 6. Agregar un producto al carrito
Este endpoint permite agregar una unidad de un producto al carrito del usuario, los usuarios con rol 'user' y 'premium' solo pueden agragar productos a su propio carrito, los usuarios 'premium' NO pueden agregar sus propios productos al carrito (productos creados por ellos mismos). El usuario con rol 'admin' puede agregar cualquier producto a su carrito y al carrito de cualquier usuario.

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion POST con el id de carrito {cid} y el id de producto {pid} a agregar:
```http
  POST /api/carts/{cid}/products/{pid}
```

#### 7. Actualizar la cantidad de un producto en el carrito
Este endpoint permite modificar la cantidad de un determinado producto que cargado en el carrito, los usuarios con rol 'user' y 'premium' solo pueden modificar su propio carrito, el usuario con rol 'admin' puede modificar TODOS los carritos.
En este endpoint tambien aplica la regla de no permitir a usuarios 'premium' sumar sus propios productos al carrito, sin embargo, solo se pueden sumar unidades de productos que ya esten dentro del carrito por lo que la regla resulta redundante.

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion PUT con el id de carrito {cid} y el id de producto {pid} a modificar dentro del carrito:
```http
  PUT /api/carts/{cid}/products/{pid}
```

#### 8. Quitar el producto del carrito
Este endpoint para quitar un producto especifico del carrito, los usuarios con rol 'user' y 'premium' solo pueden modificar su propio carrito, el usuario con rol 'admin' puede modificar TODOS los carritos.

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion DELETE con el id de carrito {cid} y el id de producto {pid} a modificar dentro del carrito:
```http
  DELETE /api/carts/{cid}/products/{pid}
```

#### 8. Agregar un producto al carrito
Este endpoint se creo para agregar un producto con parametros en el body del request, por lo que aplican las mismas reglas que en el punto 6 de esta seccion.

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion POST con el id de carrito {cid} y el id de producto {pid} a agregar:
```http
  POST /api/carts/AddToCart
```
</details>




<details>
<summary>Proceso de compra (generacion de ticket)</summary>
  
### Proceso de compra
Este endpoint fue diseñado para concretar el proceso de compra, este proceso se realizar sobre el carrito por lo que lo que solo el usuario dueño del carrito y el usuario 'admin' pueden ejecutar la operacion sobre un carrito determinado.
El mismo listara los detalles del la compra, y ademas indicara que productos no pudieron adquirirse por falta de stock, ademas enviara el resumen de la compra (ticket) por correo electronico.

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion POST con el id de carrito {cid} y el id de producto {pid} a agregar:
```http
  POST /api/carts/{cid}/products/{pid}
```
##### c. Ejecutar la operacion POST con el id de carrito {cid} para finalizar la compra y generar el ticket:
```http
  POST /api/carts/{cid]/purchase
```
</details>

