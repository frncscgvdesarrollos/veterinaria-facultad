module.exports = [
"[externals]/firebase-admin [external] (firebase-admin, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("firebase-admin", () => require("firebase-admin"));

module.exports = mod;
}),
"[project]/src/lib/firebaseAdmin.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getUserIdFromSession",
    ()=>getUserIdFromSession
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/firebase-admin [external] (firebase-admin, cjs)");
;
// Esta es la forma correcta y recomendada de inicializar el Admin SDK.
// Se asegura de que la inicialización solo ocurra una vez.
if (!__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].apps.length) {
    try {
        // Al llamar a initializeApp() sin argumentos, el SDK buscará automáticamente
        // las credenciales del entorno (Application Default Credentials), que es
        // la práctica recomendada en entornos de Google Cloud como Firebase Studio.
        __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].initializeApp();
    } catch (error) {
        console.error('Error en la inicialización de Firebase Admin SDK:', error);
    }
}
async function getUserIdFromSession(sessionCookie) {
    if (!sessionCookie) {
        return null;
    }
    try {
        // Verificamos la cookie de sesión. El `true` comprueba si ha sido revocada.
        const decodedClaims = await __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"].auth().verifySessionCookie(sessionCookie, true);
        return decodedClaims.uid;
    } catch (error) {
        // La cookie de sesión es inválida o ha expirado.
        console.error('Error al verificar la cookie de sesión:', error.code);
        return null;
    }
}
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2d$admin__$5b$external$5d$__$28$firebase$2d$admin$2c$__cjs$29$__["default"];
}),
"[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"408ab6792b0821f39cb07c2cc68899e7caf2810bd6":"solicitarTurnoPeluqueria","40ee6d2b131e078c3d3c97d4d5f08185db97354768":"solicitarTurno"},"",""] */ __turbopack_context__.s([
    "solicitarTurno",
    ()=>solicitarTurno,
    "solicitarTurnoPeluqueria",
    ()=>solicitarTurnoPeluqueria
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$app$2d$render$2f$encryption$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/app-render/encryption.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebaseAdmin.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
;
// --- Lógica para Turnos de Peluquería ---
const MAX_PERROS_GRANDES_POR_DIA = 2;
const MAX_TURNOS_POR_TURNO_PELUQUERIA = 8;
async function solicitarTurnoPeluqueria(turnoData) {
    const { clienteId, mascotaId, fecha, turno, servicios } = turnoData;
    if (!clienteId || !mascotaId || !fecha || !turno) {
        return {
            success: false,
            error: 'Faltan datos esenciales para solicitar el turno.'
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
async function solicitarTurno(turnoData) {
    const { clienteId, mascotaId, fecha, motivo } = turnoData;
    if (!clienteId || !mascotaId || !fecha || !motivo) {
        return {
            success: false,
            error: 'Faltan datos esenciales para solicitar el turno.'
        };
    }
    const firestore = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseAdmin$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"].firestore();
    try {
        const nuevoTurnoRef = firestore.collection('turnos').doc();
        await nuevoTurnoRef.set({
            ...turnoData,
            tipo: 'consulta',
            estado: 'pendiente',
            createdAt: new Date().toISOString()
        });
        // Revalidamos la ruta para que el usuario vea su nueva solicitud
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
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    solicitarTurnoPeluqueria,
    solicitarTurno
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(solicitarTurnoPeluqueria, "408ab6792b0821f39cb07c2cc68899e7caf2810bd6", null);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(solicitarTurno, "40ee6d2b131e078c3d3c97d4d5f08185db97354768", null);
}),
"[project]/.next-internal/server/app/turnos/consulta/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$turnosActions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)");
;
}),
"[project]/.next-internal/server/app/turnos/consulta/page/actions.js { ACTIONS_MODULE0 => \"[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "40ee6d2b131e078c3d3c97d4d5f08185db97354768",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$turnosActions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["solicitarTurno"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f2e$next$2d$internal$2f$server$2f$app$2f$turnos$2f$consulta$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$src$2f$app$2f$actions$2f$turnosActions$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/.next-internal/server/app/turnos/consulta/page/actions.js { ACTIONS_MODULE0 => "[project]/src/app/actions/turnosActions.js [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
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
"[project]/src/app/turnos/consulta/page.js [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/turnos/consulta/page.js <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/turnos/consulta/page.js <module evaluation>", "default");
}),
"[project]/src/app/turnos/consulta/page.js [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

// This file is generated by next-core EcmascriptClientReferenceModule.
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/app/turnos/consulta/page.js from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/app/turnos/consulta/page.js", "default");
}),
"[project]/src/app/turnos/consulta/page.js [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$turnos$2f$consulta$2f$page$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/app/turnos/consulta/page.js [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$turnos$2f$consulta$2f$page$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/app/turnos/consulta/page.js [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$turnos$2f$consulta$2f$page$2e$js__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/app/turnos/consulta/page.js [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/turnos/consulta/page.js [app-rsc] (ecmascript)"));
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a661cb51._.js.map