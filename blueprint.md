# Visión General del Proyecto

Esta aplicación es una plataforma completa para la gestión de una clínica veterinaria. Permite a los usuarios dueños de mascotas encontrar servicios, reservar citas y gestionar la información de sus mascotas. Los administradores y empleados tienen un panel de control para gestionar clientes, turnos, productos y adopciones.

## Diseño y Estilo

La aplicación sigue un diseño moderno y limpio, con un enfoque en la facilidad de uso y la accesibilidad. La paleta de colores es vibrante y acogedora, con un uso prominente de azules y verdes para transmitir confianza y tranquilidad. La tipografía es clara y legible, con un buen contraste para garantizar la accesibilidad.

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

# Plan de Implementación Actual (Completado)

## Tarea: Implementar un Flujo de Registro Seguro con Modal para reCAPTCHA

### Pasos Realizados:

1.  **Crear Componente Modal Genérico:** Se ha creado un componente reutilizable `src/components/Modal.js` para mostrar contenido en un pop-up.
2.  **Separar Lógica de Registro:** Se dividió el proceso en dos etapas:
    *   `handleFormSubmit`: Valida el formulario y abre el modal.
    *   `handleFinalRegister`: Se ejecuta desde el modal, verifica el reCAPTCHA y completa el registro en Firebase.
3.  **Integrar el Modal en la Página de Login:** Se ha añadido el componente `Modal` a `src/app/login/page.js`, conteniendo el reCAPTCHA y el botón de confirmación final.
4.  **Carga Dinámica de reCAPTCHA:** Se ha utilizado `next/dynamic` para asegurar que el componente reCAPTCHA solo se cargue en el cliente, solucionando el error de renderizado del servidor.
5.  **Actualizar `blueprint.md`:** La documentación ha sido actualizada para reflejar la nueva arquitectura del flujo de registro.
