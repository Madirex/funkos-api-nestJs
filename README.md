# Funkos API Rest

<p align="center">
  <img src="images/logo.png" alt="Funko Sockets Server">
</p>

## 📝 Descripción

API Rest de Funkos desarrollada en Typescript con Nest.Js.

Colección de Postman incluida para probar las consultas.

## ⚙ Herramientas

- **@nestjs/cache-manager**
- **@nestjs/common**
- **@nestjs/config**
- **@nestjs/core**
- **@nestjs/jwt**
- **@nestjs/mapped-types**
- **@nestjs/mongoose**
- **@nestjs/passport**
- **@nestjs/platform-express**
- **@nestjs/platform-socket.io**
- **@nestjs/swagger**
- **@nestjs/typeorm**
- **@nestjs/websockets**
- **@types/multer**
- **bcryptjs**
- **cache-manager**
- **class-transformer**

# Entidades

## Categoría (`public.category`)

**Descripción:** La entidad representa las categorías a las que pueden pertenecer los Funkos en el sistema.

**Atributos:**

- **id** (bigint): Identificador único generado automáticamente.
- **active** (boolean): Indica si la categoría está activa.
- **created_at** (timestamp): Fecha y hora de creación.
- **type** (varchar): Tipo de la categoría.
- **updated_at** (timestamp): Fecha y hora de la última actualización.

## Funko (`public.funko`)

**Descripción:** La entidad representa los Funkos disponibles en el sistema.

**Atributos:**

- **id** (uuid): Identificador único del Funko.
- **created_at** (timestamp): Fecha y hora de creación.
- **image** (varchar): URL de la imagen del Funko.
- **name** (varchar): Nombre del Funko.
- **price** (double precision): Precio del Funko (debe ser mayor o igual a 0).
- **quantity** (integer): Cantidad disponible del Funko (debe ser mayor o igual a 0).
- **updated_at** (timestamp): Fecha y hora de la última actualización.
- **category_id** (bigint): Referencia a la categoría a la que pertenece.

## Usuarios (`public.users`)

**Descripción:** La entidad representa a los usuarios del sistema.

**Atributos:**

- **id** (uuid): Identificador único del usuario.
- **created_at** (timestamp): Fecha y hora de creación.
- **email** (varchar): Correo electrónico del usuario (único).
- **is_deleted** (boolean): Indica si el usuario ha sido eliminado.
- **name** (varchar): Nombre del usuario.
- **password** (varchar): Contraseña del usuario.
- **surname** (varchar): Apellido del usuario.
- **updated_at** (timestamp): Fecha y hora de la última actualización.
- **username** (varchar): Nombre de usuario único.

## Roles de Usuario (`public.user_roles`)

**Descripción:** La entidad asigna roles a los usuarios del sistema.

**Atributos:**

- **user_id** (uuid): Referencia al usuario al que se le asigna el rol.
- **roles** (varchar): Rol del usuario (puede ser 'USER' o 'ADMIN').

## Arrancar proyecto

docker-compose up -d
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456

[circleci-url]: https://circleci.com/gh/nestjs/nest

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
