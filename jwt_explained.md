### **Paso 1: El Usuario Inicia Sesión**

El proceso comienza cuando el usuario envía su email y contraseña desde el formulario de inicio de sesión a un endpoint específico en nuestro backend (por ejemplo, `/api/login`).

**Ejemplo de código del Backend (usando Node.js y Express):**

Este código simula cómo el servidor recibe los datos, los verifica y, si son correctos, crea y firma un JWT para devolverlo al cliente.

```javascript
// Se necesitan las librerías express, jsonwebtoken y bcrypt
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
app.use(express.json());

// --- ESTA ES LA CLAVE SECRETA QUE SOLO EL SERVIDOR DEBE CONOCER ---
// En una aplicación real, esto estaría en una variable de entorno (process.env.JWT_SECRET)
const JWT_SECRET = 'esta-es-una-clave-super-secreta-y-larga-para-proteger-mis-tokens';

// Simulación de una base de datos de usuarios
const users = [
  {
    id: 1,
    email: 'usuario@test.com',
    // La contraseña se guarda "hasheada" por seguridad, nunca en texto plano.
    passwordHash: '$2b$10$abcdefghijklmnopqrstuv' // Ejemplo de un hash de bcrypt
  }
];

// 1. ENDPOINT DE LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // a. Buscar al usuario en la base de datos
  const user = users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // b. Comparar la contraseña enviada con el hash guardado
  // bcrypt.compare se encarga de hashear la contraseña que llega y compararla con la que está en la BD.
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  // c. Si todo es correcto, crear el "Payload" para el token
  const payload = {
    userId: user.id,
    email: user.email,
    // Se puede añadir cualquier información NO sensible que se quiera.
    // También se añade una fecha de expiración.
  };

  // d. Crear y FIRMAR el token
  const token = jwt.sign(
    payload,
    JWT_SECRET,
    { expiresIn: '1h' } // El token será válido por 1 hora
  );

  // e. Enviar el token al cliente
  res.json({ token: token });
});
```

---

### **Paso 2: El Cliente Guarda el Token y lo Envía en Peticiones Futuras**

Una vez que el navegador recibe el token, lo guarda (normalmente en `localStorage` o una cookie segura).

Para cada petición a una ruta protegida (ej: `/api/mi-perfil`), el cliente debe incluir este token en la cabecera `Authorization`.

**Ejemplo de petición desde el cliente:**
`Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW...`

---

### **Paso 3: El Servidor Protege sus Rutas y Verifica el Token**

Para proteger las rutas, se usa un "middleware". Un middleware es simplemente una función que se ejecuta *antes* de que la petición llegue a la lógica de la ruta final. Este middleware se encarga de verificar el token.

**Ejemplo de código del Middleware de Verificación:**

```javascript
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  // 1. Revisar si la cabecera 'Authorization' existe
  if (!authHeader) {
    return res.status(403).json({ error: 'Acceso denegado. No se proveyó un token.' });
  }

  // 2. Extraer el token (el formato es "Bearer <token>")
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(403).json({ error: 'Formato de token inválido.' });
  }

  // 3. VERIFICAR LA FIRMA Y LA VALIDEZ DEL TOKEN
  try {
    // jwt.verify() hace el trabajo mágico:
    // - Decodifica el token.
    // - Comprueba que la firma coincida usando nuestra JWT_SECRET.
    // - Comprueba si el token ha expirado.
    // Si algo falla, lanza un error.
    const decodedPayload = jwt.verify(token, JWT_SECRET);
    
    // 4. Si el token es válido, guardamos los datos del usuario en el objeto 'req'
    // para que la siguiente función pueda usarlos.
    req.user = decodedPayload;
    
    // 5. Dejar que la petición continúe hacia la ruta protegida.
    next();

  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado.' });
  }
}

// EJEMPLO DE USO DEL MIDDLEWARE EN UNA RUTA PROTEGIDA
app.get('/api/mi-perfil', verifyToken, (req, res) => {
  // Gracias al middleware, si llegamos aquí, el token es válido.
  // Podemos acceder a los datos del usuario que guardamos en req.user.
  res.json({
    message: `Bienvenido a tu perfil, usuario con ID: ${req.user.userId}`,
    email: req.user.email
  });
});

```

Este flujo `Login -> Crear y Firmar Token -> Enviar Token -> Guardar Token -> Enviar en Peticiones -> Verificar Token en Middleware` es la base de la autenticación manual con JWT que tu profesora quiere que entiendas.

---

### **Parte 4: El Código del Frontend (Cliente)**

Este es un ejemplo de cómo se vería un componente de Login en React. Se encarga de capturar los datos del usuario, enviarlos al backend y, si el login es exitoso, guardar el token JWT.

**Ejemplo de un componente `LoginPage.js` en React:**

```javascript
import React, { useState } from 'react';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // 1. FUNCIÓN PARA MANEJAR EL LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage('');

    try {
      // a. Enviar la petición POST a nuestro backend
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // b. Si la respuesta no es exitosa, mostrar el error
      if (!response.ok) {
        throw new Error(data.error || 'Algo salió mal');
      }

      // c. SI TODO SALE BIEN: Guardar el token en localStorage
      // localStorage es un almacenamiento en el navegador que persiste.
      localStorage.setItem('jwt_token', data.token);

      setSuccessMessage('¡Inicio de sesión exitoso! El token ha sido guardado.');
      
      // Aquí normalmente redirigirías al usuario a su perfil:
      // window.location.href = '/perfil';

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Iniciar Sesión (Método Manual JWT)</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Entrar</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
    </div>
  );
}
```

---

### **Parte 5: Realizar Peticiones Autenticadas desde el Frontend**

Una vez que el token está guardado, el cliente debe incluirlo en cada petición a las rutas protegidas del backend.

**Ejemplo de cómo obtener datos del perfil del usuario:**

```javascript
async function fetchUserProfile() {
  try {
    // 1. Obtener el token guardado en localStorage
    const token = localStorage.getItem('jwt_token');

    if (!token) {
      console.error('No hay un token de autenticación.');
      return;
    }

    // 2. Realizar la petición a la ruta protegida, incluyendo el token
    const response = await fetch('/api/mi-perfil', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // ¡ESTA ES LA PARTE CLAVE!
        // Se añade la cabecera 'Authorization' con el formato "Bearer <token>"
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo obtener el perfil.');
    }

    // 3. Si todo va bien, usar los datos del perfil
    console.log('Datos del perfil:', data);
    // Ejemplo: "Bienvenido a tu perfil, usuario con ID: 1"

  } catch (err) {
    console.error('Error al obtener el perfil:', err.message);
    // Si el token es inválido o expiró, el backend devolverá un error 401,
    // y este bloque 'catch' lo manejará.
  }
}

// Podrías llamar a fetchUserProfile() cuando el componente de perfil se cargue.
```