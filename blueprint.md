# Visión General del Proyecto

Esta aplicación es una plataforma completa para la gestión de una clínica veterinaria. Permite a los usuarios dueños de mascotas encontrar servicios, reservar citas y gestionar la información de sus mascotas. Los administradores y empleados tienen un panel de control para gestionar clientes, turnos, productos y adopciones.

## Diseño y Estilo

La aplicación sigue un diseño moderno y limpio, con un enfoque en la facilidad de uso y la accesibilidad. La paleta de colores es vibrante y acogedora, con un uso prominente de azules y verdes para transmitir confianza y tranquilidad. La tipografía es clara y legible, con un buen contraste para garantizar la accesibilidad.

## Arquitectura de Datos en Firestore

La base de datos se estructura de la siguiente manera:

*   **`users/{userId}`**: Colección que almacena la información de cada usuario registrado.
    *   **Subcolección `mascotas/{mascotaId}`**: Almacena la información de cada mascota (nombre, especie, raza, **tamaño**).
        *   **Subcolección `turnos/{turnoId}`**: Almacena cada turno reservado para esa mascota específica. Contiene detalles como el servicio, la fecha, el precio y el estado.
            *   **Subcolección `medicamentos/{medicamentoId}`**: Almacena any medicamento o tratamiento aplicado durante un turno específico, creando un historial clínico detallado.

*   **`servicios/{servicioId}`**: Colección principal que actúa como catálogo de todos los servicios ofrecidos. Cada documento representa un servicio con su nombre, descripción, precio base y a qué categoría pertenece (`clinica`, `peluqueria`).

*   **`productos/{productoId}`**: Colección principal que contiene todos los productos de la tienda online.

*   **`turnos_peluqueria/{fecha}`**: Colección para gestionar la disponibilidad de la peluquería. Cada documento representa un día (ej. "2024-12-25") y contiene la capacidad disponible para los turnos de mañana y tarde.

## Características Implementadas

*   **Autenticación Segura:** Registro e inicio de sesión con Correo/Contraseña y Google, protegido con reCAPTCHA.
*   **Gestión de Perfiles y Mascotas:** Los usuarios pueden gestionar su información personal y añadir/editar/ver sus mascotas.
*   **Formularios de Turnos (Rediseñados):** Formularios con diseño mejorado, siguiendo el estilo general de la aplicación.
*   **Panel de Administración (Básico):** Funcionalidades para que los administradores gestionen servicios y productos.

---

# Plan de Implementación Actual

## Tarea: Rediseño del Panel de Administración de Turnos

**Objetivo:** Mejorar drásticamente la experiencia de usuario de la dueña de la veterinaria, organizando los turnos en secciones lógicas y fáciles de gestionar, y aplicando un diseño visual moderno y atractivo.

### 1. Re-estructuración de la Interfaz de Usuario (UI)

-   [ ] **Implementar Interfaz de Pestañas (Tabs):**
    -   Crear una navegación principal con tres vistas claras:
        1.  **Turnos del Día**
        2.  **Turnos Próximos (por confirmar)**
        3.  **Historial (Turnos finalizados)**
-   [ ] **Sub-secciones por Tipo de Servicio:**
    -   Dentro de cada pestaña, separar visualmente los turnos en dos listas distintas: **"Clínica"** y **"Peluquería"**.

### 2. Lógica de Filtrado y Obtención de Datos

-   [ ] **Actualización de `turnos.admin.actions.js`:**
    -   Modificar la función `getAllTurnsForAdmin` para que filtre los turnos según su estado y fecha.
    -   Se crearán tres categorías de turnos:
        -   **Turnos del Día:** Turnos cuya fecha coincide con el día actual.
        -   **Turnos Próximos:** Turnos con fecha futura y estado `pendiente`.
        -   **Turnos Finalizados:** Turnos con estado `finalizado`.
-   [ ] **Optimización de Consultas a Firestore:**
    -   Asegurar que las consultas a la base de datos sean eficientes para no cargar datos innecesarios en el cliente.

### 3. Diseño de Componentes y Estética

-   [ ] **Crear Componente `TurnoCardAdmin`:**
    -   Diseñar una tarjeta visualmente atractiva para cada turno.
    -   Mostrará la información clave: Nombre de la mascota, nombre del dueño, servicio, horario y estado.
    -   Utilizará colores e íconos para diferenciar rápidamente el tipo de servicio (clínica/peluquería) y el estado del turno.
-   [ ] **Diseño General y Estilo:**
    -   Crear un layout limpio y espaciado para las pestañas y las listas.
    -   Aplicar la paleta de colores y tipografía de la aplicación para una apariencia cohesiva y profesional.
-   [ ] **Acciones del Administrador:**
    -   Añadir botones o controles en cada tarjeta de turno para realizar acciones rápidas como "Confirmar", "Marcar como Finalizado" o "Cancelar".

