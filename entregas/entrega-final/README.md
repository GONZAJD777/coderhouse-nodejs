
# Entrega Final

Entrega Final correspondiente al curso Programacion Backend Node JS 

## Documentacion de operaciones
Para realizar cualquier operacion, exceptuando el registro y logeo, es necesario primero logearse, una vez realizado esto, se podra ejecutar cualquier operacion que permita el rol del usuario logeado.

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

### Operaciones sobre productos

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

#### 2. Crear producto
Endpoint destinado a la creacion de productos, esta operacion solo puede ser realizada por usuario con role 'premium' o 'admin'

##### a. Si no se encuentra logeado, realizar la operacion de login:
```http
  POST /api/sessions/login
```
##### b. Ejecutar la operacion GET:
```http
  POST /api/products
```



















