# Sprint 1: Autenticación y Gestión de Usuarios

**Objetivo del Sprint:** Implementar un sistema de autenticación robusto y seguro que incluya registro, inicio de sesión, recuperación de contraseña y gestión de roles de usuario.

---

## Historias de Usuario

### 1. Registro de Nuevo Usuario

**Como** un nuevo visitante del sitio,
**Quiero** poder registrarme usando mi correo electrónico y una contraseña
**Para** poder acceder a los servicios de la plataforma.

**Criterios de Aceptación:**
-   El formulario de registro debe solicitar un correo electrónico y una contraseña.
-   La contraseña debe tener un requisito mínimo de seguridad (ej. 8 caracteres, una mayúscula, un número).
-   Se debe verificar que el correo electrónico no esté ya registrado en el sistema.
-   Tras un registro exitoso, se me debe redirigir a la página para completar mi perfil.
-   Si el registro falla, se debe mostrar un mensaje de error claro.

### 2. Inicio de Sesión de Usuario

**Como** un usuario registrado,
**Quiero** poder iniciar sesión con mi correo electrónico y contraseña
**Para** acceder a mi panel de usuario y a las funcionalidades de la aplicación.

**Criterios de Aceptación:**
-   El formulario de inicio de sesión debe tener campos para el correo electrónico y la contraseña.
-   Si las credenciales son correctas, se me debe redirigir a mi panel de usuario.
-   Si las credenciales son incorrectas, se debe mostrar un mensaje de error.
-   Debe existir una opción para "Recordar mi sesión" (opcional).

### 3. Inicio de Sesión con Google

**Como** un usuario,
**Quiero** poder registrarme e iniciar sesión usando mi cuenta de Google
**Para** un acceso más rápido y sin necesidad de crear una nueva contraseña.

**Criterios de Aceptación:**
-   Debe haber un botón "Iniciar sesión con Google" en las páginas de registro e inicio de sesión.
-   Al hacer clic, se me debe redirigir al flujo de autenticación de Google.
-   Si es mi primera vez, se debe crear una cuenta de usuario automáticamente.
-   Tras una autenticación exitosa, debo ser redirigido a mi panel de usuario.

### 4. Recuperación de Contraseña

**Como** un usuario que olvidó su contraseña,
**Quiero** poder solicitar un enlace para restablecer mi contraseña
**Para** poder recuperar el acceso a mi cuenta.

**Criterios de Aceptación:**
-   Debe haber un enlace de "¿Olvidaste tu contraseña?" en la página de inicio de sesión.
-   Al hacer clic, se me debe pedir que ingrese mi correo electrónico.
-   Si el correo electrónico existe en el sistema, se debe enviar un email con un enlace para restablecer la contraseña.
-   El enlace debe ser de un solo uso y tener una fecha de caducidad.
-   La página de restablecimiento debe permitirme ingresar y confirmar una nueva contraseña.

### 5. Gestión de Roles de Usuario

**Como** administrador del sistema,
**Quiero** poder asignar roles a los usuarios (`dueño`, `empleado`, `admin`)
**Para** controlar el acceso a las diferentes funcionalidades de la aplicación.

**Criterios de Aceptación:**
-   Por defecto, todos los usuarios nuevos se registran con el rol de `dueño`.
-   Un `admin` puede cambiar el rol de cualquier usuario desde el panel de administración.
-   El rol de `empleado` debe dar acceso al panel de administración con funciones limitadas (gestión de turnos y clientes).
-   El rol de `admin` debe dar acceso completo a todas las funciones del panel de administración.
-   Un usuario con rol `dueño` no debe tener acceso al panel de administración.

### 6. Completar Perfil de Usuario

**Como** un nuevo usuario que acaba de registrarse,
**Quiero** ser guiado para completar mi perfil con información adicional (DNI, teléfono, dirección)
**Para** que la clínica tenga toda la información necesaria para mis futuras visitas.

**Criterios de Aceptación:**
-   Inmediatamente después del registro, se me debe redirigir a una página de "Completar Perfil".
-   El formulario debe incluir campos para DNI, número de teléfono y dirección.
-   La información debe guardarse y asociarse a mi cuenta de usuario.
-   Debe ser posible omitir este paso y completarlo más tarde desde el panel de usuario.
