# Visión General del Proyecto

Esta aplicación es una plataforma completa para la gestión de una clínica veterinaria. Permite a los usuarios dueños de mascotas encontrar servicios, reservar citas y gestionar la información de sus mascotas. Los administradores y empleados tienen un panel de control para gestionar clientes, turnos, productos y adopciones.

## Diseño y Estilo

La aplicación sigue un diseño moderno y limpio, con un enfoque en la facilidad de uso y la accesibilidad. La paleta de colores es vibrante y acogedora, con un uso prominente de azules y verdes para transmitir confianza y tranquilidad. La tipografía es clara y legible, con un buen contraste para garantizar la accesibilidad.

## Arquitectura de Datos en Firestore

La base de datos se estructura de la siguiente manera:

*   **`users/{userId}`**: Colección que almacena la información de cada usuario registrado.
    *   **Subcolección `mascotas/{mascotaId}`**: Almacena la información de cada mascota (nombre, especie, raza, **tamaño**).
        *   **Subcolección `turnos/{turnoId}`**: Almacena cada turno reservado para esa mascota específica. Contiene detalles como el servicio, la fecha, el precio y el estado.
            *   **Subcolección `medicamentos/{medicamentoId}`**: Almacena cualquier medicamento o tratamiento aplicado durante un turno específico, creando un historial clínico detallado.

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

## Tarea: Re-arquitectura del Sistema de Turnos y Formulario de Peluquería Avanzado

**Objetivo:** Implementar un flujo de reserva de turnos de peluquería detallado y migrar la estructura de datos de `turnos` para que esté anidada dentro de cada mascota, permitiendo un historial clínico más robusto.

### 1. Modificación de Estructura de Datos y Formularios Existentes

-   [ ] **Añadir Campo `tamaño` a Mascotas:**
    -   Modificar el formulario de "Nueva Mascota" (`/mascotas/nueva`) para incluir un campo de selección para el tamaño (`Pequeño`, `Mediano`, `Grande`).
    -   Actualizar la lógica de guardado para incluir este campo en el documento de la mascota.
-   [ ] **Actualizar Reglas de Seguridad de Firestore:**
    -   Modificar `firestore.rules` para reflejar la nueva estructura anidada `users/{userId}/mascotas/{mascotaId}/turnos/{turnoId}`.
    -   Asegurar que los usuarios solo puedan leer/escribir en sus propias subcolecciones y que los `admin` tengan acceso global.

### 2. Diseño del Nuevo Formulario de Peluquería

-   [ ] **Componente Principal del Formulario:**
    -   Crear un nuevo componente de React para el flujo de peluquería.
    -   El formulario permitirá la **selección de múltiples mascotas** de una lista (con checkboxes).
-   [ ] **Detalles por Mascota Seleccionada:**
    -   Para cada mascota seleccionada, se mostrará una sección donde el usuario debe elegir el **servicio de peluquería específico** (ej. "Baño y Corte", "Solo Baño").
-   [ ] **Cálculo de Precio Dinámico:**
    -   El sistema calculará el precio total en tiempo real.
    -   `Precio Total = Suma(precio_servicio_mascota_1 + precio_servicio_mascota_2 + ...)`
    -   El precio de cada servicio dependerá del **tamaño de la mascota**. Esto requiere tener una estructura de precios en los documentos de `servicios` (ej. `precio: {pequeno: 20, mediano: 25, grande: 30}`).
-   [ ] **Logística y Opciones Adicionales:**
    -   Añadir un interruptor (toggle) para "Necesita Transporte" (Sí/No).
    -   Añadir botones de selección para "Método de Pago" (Efectivo / Transferencia).
-   [ ] **Selector de Fecha y Turno (Calendario):**
    -   Implementar un calendario donde el usuario elija el día.
    -   Para el día seleccionado, se mostrarán los dos turnos fijos disponibles: "Turno Mañana (9:00)" y "Turno Tarde (14:00)".
    -   La disponibilidad de estos turnos se consultará de la colección `turnos_peluqueria`.

### 3. Lógica de Creación de Turnos

-   [ ] **Acción de Envío (`handleSubmit`):**
    -   Al confirmar el formulario, la función recorrerá la lista de mascotas seleccionadas.
    -   Para **cada mascota**, se creará un **documento de turno individual** en su correspondiente subcoleión: `users/USER_ID/mascotas/MASCOTA_ID/turnos/`.
    -   Cada documento de turno guardará toda la información relevante: `servicioId`, `precioFinal`, `fecha`, `horarioTurno` ("Mañana" o "Tarde"), `necesitaTransporte`, `metodoPago`.
-   [ ] **Actualización de Disponibilidad:**
    -   Después de crear los turnos, se actualizará el documento del día correspondiente en `turnos_peluqueria` para reducir la capacidad del turno (mañana/tarde) según la cantidad de mascotas añadidas.
