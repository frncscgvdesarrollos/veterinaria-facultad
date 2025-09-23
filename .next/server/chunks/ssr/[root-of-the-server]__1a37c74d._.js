module.exports = [
"[externals]/firebase-admin [external] (firebase-admin, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("firebase-admin", () => require("firebase-admin"));

module.exports = mod;
}),
"[project]/src/lib/firebaseAdmin.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Historia de Usuario 5: Gestión de Roles de Usuario
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getUserIdFromSession",
    ()=>getUserIdFromSession
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs)");
;
// Comprobación para asegurar que el código se ejecuta solo en el servidor.
if ("TURBOPACK compile-time truthy", 1) {
    if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].apps.length) {
        try {
            // Para que el Admin SDK funcione en Vercel, necesita las credenciales de la cuenta de servicio.
            // Estas deben ser almacenadas como una variable de entorno en el proyecto de Vercel.
            const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
            __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].initializeApp({
                credential: __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].credential.cert(serviceAccount)
            });
            console.log('Firebase Admin SDK inicializado correctamente.');
        } catch (error) {
            // Este error es común si la variable de entorno no está configurada en Vercel.
            console.error('ERROR AL INICIALIZAR FIREBASE ADMIN SDK:', error);
            console.error('Asegúrate de haber configurado la variable de entorno FIREBASE_SERVICE_ACCOUNT_KEY en Vercel con el JSON de tu cuenta de servicio.');
        }
    }
}
async function getUserIdFromSession(sessionCookie) {
    if (!sessionCookie) {
        return null;
    }
    try {
        const decodedClaims = await __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].auth().verifySessionCookie(sessionCookie, false);
        return decodedClaims.uid;
    } catch (error) {
        // Si el SDK no se inicializó, este error puede ocurrir.
        if (error.code === 'auth/invalid-session-cookie') {
            console.error("La cookie de sesión no es válida. Puede que haya expirado o el SDK de Admin no esté configurado correctamente.");
        } else {
            console.error('Error al verificar la cookie de sesión:', error.code);
        }
        return null;
    }
}
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"];
}),
"[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4023f484cfc7978ffe72ebc27cb3ef35fdf337c6d4":"cancelarTurnoUsuario","40f04a978b523f8db9a71e69d2ff55b681f0c487bd":"solicitarTurnoPeluqueria","40f3851fa82a1cdd976d911fc02bab21b6987feaa3":"solicitarTurnoConsulta"},"",""] */ __turbopack_context__.s([
    "cancelarTurnoUsuario",
    ()=>cancelarTurnoUsuario,
    "solicitarTurnoConsulta",
    ()=>solicitarTurnoConsulta,
    "solicitarTurnoPeluqueria",
    ()=>solicitarTurnoPeluqueria
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebaseAdmin.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
;
;
// --- Lógica para Turnos de Peluquería ---
const MAX_PERROS_GRANDES_POR_DIA = 2;
const MAX_TURNOS_POR_TURNO_PELUQUERIA = 8;
async function solicitarTurnoPeluqueria(turnoData) {
    const { clienteId, mascotaId, fecha, turno, servicios, transporte, metodoPago } = turnoData;
    if (!clienteId || !mascotaId || !fecha || !turno || !metodoPago) {
        return {
            success: false,
            error: 'Faltan datos esenciales, incluido el método de pago.'
        };
    }
    const firestore = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].firestore();
    try {
        const mascotaRef = firestore.collection('users').doc(clienteId).collection('mascotas').doc(mascotaId);
        const mascotaSnap = await mascotaRef.get();
        if (!mascotaSnap.exists) {
            return {
                success: false,
                error: 'La mascota seleccionada no existe.'
            };
        }
        const tamañoMascota = mascotaSnap.data().tamaño;
        const resultado = await firestore.runTransaction(async (transaction)=>{
            const turnosRef = firestore.collection('turnos');
            if (tamañoMascota === 'grande') {
                const qGrandes = turnosRef.where('fecha', '==', fecha).where('tipo', '==', 'peluqueria').where('tamañoMascota', '==', 'grande').where('estado', 'in', [
                    'pendiente',
                    'confirmado'
                ]);
                const snapGrandes = await transaction.get(qGrandes);
                if (snapGrandes.docs.length >= MAX_PERROS_GRANDES_POR_DIA) {
                    throw new Error('El cupo para perros grandes en esta fecha ya está completo.');
                }
            }
            const qTurno = turnosRef.where('fecha', '==', fecha).where('turno', '==', turno).where('tipo', '==', 'peluqueria').where('estado', 'in', [
                'pendiente',
                'confirmado'
            ]);
            const snapTurno = await transaction.get(qTurno);
            if (snapTurno.docs.length >= MAX_TURNOS_POR_TURNO_PELUQUERIA) {
                throw new Error(`El turno de la ${turno} para esta fecha ya está completo.`);
            }
            const nuevoTurnoRef = firestore.collection('turnos').doc();
            transaction.set(nuevoTurnoRef, {
                ...turnoData,
                tamañoMascota,
                estado: 'pendiente',
                createdAt: new Date().toISOString()
            });
            return {
                success: true,
                turnoId: nuevoTurnoRef.id
            };
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/turnos');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/mis-turnos');
        return resultado;
    } catch (error) {
        console.error('Error en la transacción de solicitud de turno de peluquería:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
async function solicitarTurnoConsulta(turnoData) {
    // Añadimos 'metodoPago' a la desestructuración
    const { clienteId, mascotaId, fecha, turno, motivo, metodoPago } = turnoData;
    // Añadimos validación para el nuevo campo
    if (!clienteId || !mascotaId || !fecha || !turno || !motivo || !metodoPago) {
        return {
            success: false,
            error: 'Faltan datos esenciales, incluido el método de pago.'
        };
    }
    const firestore = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].firestore();
    try {
        const nuevoTurnoRef = firestore.collection('turnos').doc();
        // El operador '...' se asegura de que 'metodoPago' se guarde en la BD
        await nuevoTurnoRef.set({
            ...turnoData,
            tipo: 'consulta',
            estado: 'pendiente',
            createdAt: new Date().toISOString()
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/turnos');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/mis-turnos');
        return {
            success: true,
            turnoId: nuevoTurnoRef.id
        };
    } catch (error) {
        console.error('Error al solicitar el turno de consulta:', error);
        return {
            success: false,
            error: 'Ocurrió un error inesperado al guardar la solicitud.'
        };
    }
}
async function cancelarTurnoUsuario(turnoId) {
    const sessionCookie = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])().get('__session')?.value || '';
    const userId = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getUserIdFromSession"])(sessionCookie);
    if (!userId) {
        return {
            success: false,
            error: 'No estás autenticado.'
        };
    }
    if (!turnoId) {
        return {
            success: false,
            error: 'No se proporcionó un ID de turno.'
        };
    }
    const firestore = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].firestore();
    const turnoRef = firestore.collection('turnos').doc(turnoId);
    try {
        const turnoSnap = await turnoRef.get();
        if (!turnoSnap.exists) {
            return {
                success: false,
                error: 'El turno no existe.'
            };
        }
        const turnoData = turnoSnap.data();
        if (turnoData.clienteId !== userId) {
            return {
                success: false,
                error: 'No tienes permiso para cancelar este turno.'
            };
        }
        if ([
            'cancelado',
            'completado'
        ].includes(turnoData.estado)) {
            return {
                success: false,
                error: 'Este turno ya no se puede cancelar.'
            };
        }
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaTurno = new Date(turnoData.fecha + 'T12:00:00');
        if (fechaTurno < hoy) {
            return {
                success: false,
                error: 'No se puede cancelar un turno que ya ha pasado.'
            };
        }
        await turnoRef.update({
            estado: 'cancelado',
            canceladoAt: new Date().toISOString(),
            canceladoPor: 'usuario'
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/mis-turnos');
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/admin/turnos');
        return {
            success: true
        };
    } catch (error) {
        console.error('Error al cancelar el turno:', error);
        return {
            success: false,
            error: 'Ocurrió un error inesperado al intentar cancelar el turno.'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    solicitarTurnoPeluqueria,
    solicitarTurnoConsulta,
    cancelarTurnoUsuario
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(solicitarTurnoPeluqueria, "40f04a978b523f8db9a71e69d2ff55b681f0c487bd", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(solicitarTurnoConsulta, "40f3851fa82a1cdd976d911fc02bab21b6987feaa3", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(cancelarTurnoUsuario, "4023f484cfc7978ffe72ebc27cb3ef35fdf337c6d4", null);
}),
"[project]/.next-internal/server/app/mis-turnos/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$turnosActions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/mis-turnos/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "4023f484cfc7978ffe72ebc27cb3ef35fdf337c6d4",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$turnosActions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cancelarTurnoUsuario"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$mis$2d$turnos$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$turnosActions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/mis-turnos/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$turnosActions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)");
}),
"[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/favicon.ico.mjs { IMAGE => \"[project]/src/app/favicon.ico (static in ecmascript)\" } [app-rsc] (structured image object, ecmascript)"));
}),
"[project]/src/app/layout.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/layout.js [app-rsc] (ecmascript)"));
}),
"[project]/src/app/error.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/error.js [app-rsc] (ecmascript)"));
}),
"[project]/src/app/loading.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/loading.js [app-rsc] (ecmascript)"));
}),
"[project]/src/app/mis-turnos/page.js [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/mis-turnos/page.js <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/mis-turnos/page.js <module evaluation>", "default");
}),
"[project]/src/app/mis-turnos/page.js [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/mis-turnos/page.js from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/mis-turnos/page.js", "default");
}),
"[project]/src/app/mis-turnos/page.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$mis$2d$turnos$2f$page$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/mis-turnos/page.js [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$mis$2d$turnos$2f$page$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/mis-turnos/page.js [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$mis$2d$turnos$2f$page$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/mis-turnos/page.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/mis-turnos/page.js [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1a37c74d._.js.map