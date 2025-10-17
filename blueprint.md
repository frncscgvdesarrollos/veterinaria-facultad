# Visión General del Proyecto

Esta aplicación es una plataforma completa para la gestión de una clínica veterinaria. Permite a los usuarios dueños de mascotas encontrar servicios, reservar citas y gestionar la información de sus mascotas. Los administradores y empleados tienen un panel de control para gestionar clientes, turnos, productos y adopciones.

## Diseño y Estilo

La aplicación sigue un diseño moderno y limpio, con un enfoque en la facilidad de uso y la accesibilidad. La paleta de colores es vibrante y acogedora, con un uso prominente de azules y verdes para transmitir confianza y tranquilidad. La tipografía es clara y legible, con un buen contraste para garantizar la accesibilidad.

## Arquitectura de Datos en Firestore

La base de datos se estructura de la siguiente manera:

*   **`usuarios`**: Colección que almacena la información de cada usuario registrado, incluyendo su rol (dueño, empleado, admin).
*   **`mascotas`**: Colección que almacena la información de cada mascota, vinculada a un usuario `dueño` por su ID.
*   **`turnos`**: Colección que almacena cada turno reservado, vinculado a un `dueño` y a una `mascota`.
*   **`servicios`**: Colección que contiene un único documento llamado `catalogo`.
    *   **Documento `catalogo`**: Este documento contiene mapas (objetos) para las diferentes categorías de servicios: `peluqueria`, `clinica` y `medicamentos`. Cada mapa contiene los servicios individuales como objetos, identificados por un ID único. Esta colección actúa como un catálogo central para los servicios que se pueden seleccionar en los formularios.
*   **`configuracion`**: Colección que contiene un documento llamado `servicios`.
    *   **Documento `servicios`**: Almacena los estados de activación (booleano) para categorías de servicios completas (ej. `peluqueria_activa`), permitiendo a los administradores habilitar o deshabilitar secciones enteras de servicios de forma centralizada.

## Características Implementadas

### Autenticación y Perfiles de Usuario

*   **Autenticación:** Los usuarios pueden registrarse e iniciar sesión utilizando su cuenta de Google o mediante correo electrónico y contraseña.
*   **Perfiles de Usuario:** Después de registrarse, los usuarios completan su perfil con información adicional, como DNI, teléfono y dirección.
*   **Roles de Usuario:** El sistema admite tres roles de usuario:
    *   `dueño`: Clientes de la veterinaria.
    *   `empleado`: Personal de la veterinaria con acceso al panel de administración.
    *   `admin`: Administradores con control total sobre la aplicación.

### Flujo de Registro Seguro en Dos Pasos (con Modal)

El proceso de registro se ha diseñado para ser seguro y amigable para el usuario, utilizando un modal para la verificación reCAPTCHA:

1.  **Rellenar el Formulario:** El usuario completa sus datos en un formulario de registro limpio.
2.  **Validación y Apertura del Modal:** Al hacer clic en "Registrarme", la aplicación valida los datos localmente. Si son correctos, se abre un modal de verificación de seguridad.
3.  **Verificación reCAPTCHA:** Dentro del modal, el usuario completa el desafío reCAPTCHA v2 ("No soy un robot").
4.  **Finalización del Registro:** Al confirmar en el modal, la aplicación envía los datos y el token de reCAPTCHA a Firebase para crear la cuenta de forma segura. Este enfoque evita conflictos de renderizado en el servidor y mejora la experiencia del usuario.

### Funcionalidades para Dueños de Mascotas

*   **Gestión de Mascotas:** Los usuarios pueden agregar y ver las mascotas asociadas a su cuenta.
*   **Reservas de Turnos:** Los usuarios pueden reservar turnos para consultas veterinarias y servicios de peluquería.
*   **Tienda Online:** Los usuarios pueden explorar y comprar productos para sus mascotas.
*   **Adopciones:** Los usuarios pueden ver una galería de mascotas disponibles para adopción.

### Panel de Administración

*   **Gestión de Clientes:** Los administradores y empleados pueden ver y gestionar la información de los clientes.
*   **Gestión de Turnos:** Visualización y gestión de todos los turnos reservados.
*   **Gestión de Productos:** Creación, edición y eliminación de productos de la tienda.
*   **Gestión de Servicios:** Creación, edición y eliminación de servicios y medicamentos del catálogo central.

# Plan de Implementación Actual (Completado)

## Tarea: Refactorizar la Colección `precios` a `servicios`

### Pasos Realizados:

1.  **Análisis de la Arquitectura:** Se identificó que la colección `precios` contenía no solo precios, sino también servicios y medicamentos aplicables, lo que generaba confusión semántica.
2.  **Refactorización del Código:** Se actualizó el archivo `src/app/admin/servicios/actions.js` para cambiar la referencia de la colección de `precios` a `servicios` y el documento interno de `lista` a `catalogo`, nombres más descriptivos.
3.  **Actualización de `blueprint.md`:** La documentación ha sido actualizada para reflejar la nueva y más clara arquitectura de datos en Firestore.
4.  **Instrucciones para la Base de Datos:** Se proporcionaron instrucciones claras al usuario para renombrar manualmente la colección y el documento en la consola de Firebase, completando así la migración.
