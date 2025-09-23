(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/lib/firebaseConfig.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "firebaseConfig",
    ()=>firebaseConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
const firebaseConfig = {
    apiKey: ("TURBOPACK compile-time value", "AIzaSyBvmwyq7FR80gNABQXS9s0w42uz_Iq7ml0"),
    authDomain: ("TURBOPACK compile-time value", "veterinaria-facultad.firebaseapp.com"),
    projectId: ("TURBOPACK compile-time value", "veterinaria-facultad"),
    storageBucket: ("TURBOPACK compile-time value", "veterinaria-facultad.firebasestorage.app"),
    messagingSenderId: ("TURBOPACK compile-time value", "14587884138"),
    appId: ("TURBOPACK compile-time value", "1:14587884138:web:028e382cabe3d302859013")
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/firebase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "app",
    ()=>app,
    "auth",
    ()=>auth,
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseConfig$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebaseConfig.js [app-client] (ecmascript)");
;
;
;
;
const app = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["initializeApp"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebaseConfig$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["firebaseConfig"]) : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getApp"])();
const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getFirestore"])(app);
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAuth"])(app);
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/data:a49213 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"607e2e33671e9af3b7c889b8ece695a8d12ed1593e":"completarPerfil"},"src/app/actions.js",""] */ __turbopack_context__.s([
    "completarPerfil",
    ()=>completarPerfil
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var completarPerfil = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("607e2e33671e9af3b7c889b8ece695a8d12ed1593e", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "completarPerfil"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vYWN0aW9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBIaXN0b3JpYSBkZSBVc3VhcmlvIDU6IEdlc3Rpw7NuIGRlIFJvbGVzIGRlIFVzdWFyaW9cbi8vIEhpc3RvcmlhIGRlIFVzdWFyaW8gNjogQ29tcGxldGFyIFBlcmZpbCBkZSBVc3VhcmlvXG5cbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcbmltcG9ydCBhZG1pbiBmcm9tICdAL2xpYi9maXJlYmFzZUFkbWluJztcblxuLyoqXG4gKiBAY29uc3RhbnQgYXBsaWNhdGlvblJvbGVzXG4gKiBAZGVzY3JpcHRpb24gRGVmaW5lIHJvbGVzIGVzcGVjaWFsZXMgYXNpZ25hZG9zIGEgdXN1YXJpb3MgZXNwZWPDrWZpY29zIHNlZ8O6biBzdSBETkkuXG4gKiBFc3RvIGNlbnRyYWxpemEgbGEgbMOzZ2ljYSBkZSBhc2lnbmFjacOzbiBkZSByb2xlcyBkZSBhZG1pbmlzdHJhZG9yIG8gZW1wbGVhZG8uXG4gKiBDb3JyZXNwb25kZSBhIGxhIFwiSGlzdG9yaWEgZGUgVXN1YXJpbyA1OiBHZXN0acOzbiBkZSBSb2xlcyBkZSBVc3VhcmlvXCIuXG4gKi9cbmNvbnN0IGFwbGljYXRpb25Sb2xlcyA9IHtcbiAgJzAwMDAwMDAxJzogJ2FkbWluJywgICAgICAvLyBNYWdhbGkgLSBETkkgc2luIHB1bnRvc1xuICAnMDAwMDAwMDInOiAncGVsdXF1ZXJhJyxcbiAgJzAwMDAwMDAzJzogJ3RyYW5zcG9ydGUnLFxufTtcblxuLyoqXG4gKiBAZnVuY3Rpb24gY29tcGxldGFyUGVyZmlsXG4gKiBAZGVzY3JpcHRpb24gU2VydmVyIEFjdGlvbiBwYXJhIGd1YXJkYXIgbG9zIGRhdG9zIGRlbCBwZXJmaWwgZGUgdW4gdXN1YXJpbyB5IGFzaWduYXJsZSB1biByb2wuXG4gKiBTZSBlamVjdXRhIGRlc3B1w6lzIGRlIHF1ZSB1biB1c3VhcmlvIHNlIHJlZ2lzdHJhIGV4aXRvc2FtZW50ZS5cbiAqIENvcnJlc3BvbmRlIGEgbGFzIFwiSGlzdG9yaWFzIGRlIFVzdWFyaW8gNSB5IDZcIi5cbiAqIEBwYXJhbSB7c3RyaW5nfSB1c2VySWQgLSBFbCBJRCBkZWwgdXN1YXJpbyBkZSBGaXJlYmFzZSBBdXRoZW50aWNhdGlvbi5cbiAqIEBwYXJhbSB7b2JqZWN0fSB1c2VyRGF0YSAtIExvcyBkYXRvcyBkZWwgcGVyZmlsIGRlbCBmb3JtdWxhcmlvLlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY29tcGxldGFyUGVyZmlsKHVzZXJJZCwgdXNlckRhdGEpIHtcbiAgY29uc3QgZmlyZXN0b3JlID0gYWRtaW4uZmlyZXN0b3JlKCk7XG4gIGNvbnN0IGF1dGggPSBhZG1pbi5hdXRoKCk7XG5cbiAgY29uc3QgeyBcbiAgICBub21icmUsIFxuICAgIGFwZWxsaWRvLCBcbiAgICBkbmksIFxuICAgIHRlbGVmb25vUHJpbmNpcGFsLCBcbiAgICB0ZWxlZm9ub1NlY3VuZGFyaW8sIFxuICAgIGRpcmVjY2lvbiwgXG4gICAgYmFycmlvLCBcbiAgICBub21icmVDb250YWN0b0VtZXJnZW5jaWEsIFxuICAgIHRlbGVmb25vQ29udGFjdG9FbWVyZ2VuY2lhIFxuICB9ID0gdXNlckRhdGE7XG4gIFxuICBpZiAoIXVzZXJJZCB8fCAhbm9tYnJlIHx8ICFhcGVsbGlkbyB8fCAhZG5pIHx8ICF0ZWxlZm9ub1ByaW5jaXBhbCB8fCAhZGlyZWNjaW9uIHx8ICFiYXJyaW8gfHwgIW5vbWJyZUNvbnRhY3RvRW1lcmdlbmNpYSB8fCAhdGVsZWZvbm9Db250YWN0b0VtZXJnZW5jaWEpIHtcbiAgICBjb25zb2xlLmVycm9yKCdWYWxpZGF0aW9uIGZhaWxlZC4gTWlzc2luZyBkYXRhOicsIHsgdXNlcklkLCAuLi51c2VyRGF0YSB9KTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdGYWx0YW4gZGF0b3MgZXNlbmNpYWxlcyBwYXJhIGNvbXBsZXRhciBlbCBwZXJmaWwuJyB9O1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyAxLiBBc2lnbmFjacOzbiBkZSBSb2wgKEhVIDUpXG4gICAgLy8gU2UgdmVyaWZpY2Egc2kgZWwgRE5JIGRlbCB1c3VhcmlvIGNvcnJlc3BvbmRlIGEgdW4gcm9sIGVzcGVjaWFsLlxuICAgIC8vIFNpIG5vLCBzZSBsZSBhc2lnbmEgZWwgcm9sICdkdWXDsW8nIHBvciBkZWZlY3RvLlxuICAgIGNvbnN0IHVzZXJSb2xlID0gYXBsaWNhdGlvblJvbGVzW2RuaV0gfHwgJ2R1ZcOxbyc7XG5cbiAgICAvLyBTZSBlc3RhYmxlY2UgZWwgXCJjdXN0b20gY2xhaW1cIiBlbiBGaXJlYmFzZSBBdXRoZW50aWNhdGlvbi4gRXN0ZSB0b2tlbiBkZSByb2xcbiAgICAvLyBzZSB1c2Fyw6EgZW4gdG9kYSBsYSBhcHAgcGFyYSBjb250cm9sYXIgZWwgYWNjZXNvLlxuICAgIGF3YWl0IGF1dGguc2V0Q3VzdG9tVXNlckNsYWltcyh1c2VySWQsIHsgcm9sZTogdXNlclJvbGUgfSk7XG5cbiAgICAvLyAyLiBHdWFyZGFyIERhdG9zIGRlbCBQZXJmaWwgZW4gRmlyZXN0b3JlIChIVSA2KVxuICAgIC8vIFNlIGFsbWFjZW5hbiBsb3MgZGV0YWxsZXMgZGVsIHBlcmZpbCBlbiBsYSBjb2xlY2Npw7NuICd1c2VycycuXG4gICAgYXdhaXQgZmlyZXN0b3JlLmNvbGxlY3Rpb24oJ3VzZXJzJykuZG9jKHVzZXJJZCkuc2V0KHtcbiAgICAgIG5vbWJyZSxcbiAgICAgIGFwZWxsaWRvLFxuICAgICAgZG5pLFxuICAgICAgdGVsZWZvbm9QcmluY2lwYWwsXG4gICAgICB0ZWxlZm9ub1NlY3VuZGFyaW86IHRlbGVmb25vU2VjdW5kYXJpbyB8fCAnJyxcbiAgICAgIGRpcmVjY2lvbixcbiAgICAgIGJhcnJpbyxcbiAgICAgIG5vbWJyZUNvbnRhY3RvRW1lcmdlbmNpYSxcbiAgICAgIHRlbGVmb25vQ29udGFjdG9FbWVyZ2VuY2lhLFxuICAgICAgcm9sZTogdXNlclJvbGUsXG4gICAgICBwcm9maWxlQ29tcGxldGVkOiB0cnVlLFxuICAgICAgY3JlYXRlZEF0OiBhZG1pbi5maXJlc3RvcmUuRmllbGRWYWx1ZS5zZXJ2ZXJUaW1lc3RhbXAoKSxcbiAgICB9LCB7IG1lcmdlOiB0cnVlIH0pO1xuXG4gICAgcmV2YWxpZGF0ZVBhdGgoJy8nKTtcbiAgICBcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCByb2xlOiB1c2VyUm9sZSB9O1xuXG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgY29uc29sZS5lcnJvcignRXJyb3IgYWwgY29tcGxldGFyIGVsIHBlcmZpbCBlbiBlbCBzZXJ2aWRvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnT2N1cnJpw7MgdW4gZXJyb3IgZW4gZWwgc2Vydmlkb3IgYWwgcHJvY2VzYXIgdHUgcGVyZmlsLicgfTtcbiAgfVxufVxuXG4vKipcbiAqIFNlcnZlciBBY3Rpb24gcGFyYSBhZ3JlZ2FyIHVuYSBudWV2YSBtYXNjb3RhIGEgdW4gdXN1YXJpby5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGFncmVnYXJNYXNjb3RhKHVzZXJJZCwgbWFzY290YURhdGEpIHtcbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdVc3VhcmlvIG5vIGF1dGVudGljYWRvLicgfTtcbiAgICB9XG5cbiAgICBjb25zdCB7IG5vbWJyZSwgZXNwZWNpZSwgcmF6YSwgZmVjaGFOYWNpbWllbnRvLCB0YW1hw7FvLCBlbkFkb3BjaW9uIH0gPSBtYXNjb3RhRGF0YTtcblxuICAgIGlmICghbm9tYnJlIHx8ICFlc3BlY2llIHx8ICFyYXphIHx8ICFmZWNoYU5hY2ltaWVudG8gfHwgIXRhbWHDsW8pIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnVG9kb3MgbG9zIGNhbXBvcywgaW5jbHV5ZW5kbyBlbCB0YW1hw7FvLCBzb24gb2JsaWdhdG9yaW9zLicgfTtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJlc3RvcmUgPSBhZG1pbi5maXJlc3RvcmUoKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IG1hc2NvdGFSZWYgPSBhd2FpdCBmaXJlc3RvcmUuY29sbGVjdGlvbigndXNlcnMnKS5kb2ModXNlcklkKS5jb2xsZWN0aW9uKCdtYXNjb3RhcycpLmFkZCh7XG4gICAgICAgICAgICBub21icmUsXG4gICAgICAgICAgICBlc3BlY2llLFxuICAgICAgICAgICAgcmF6YSxcbiAgICAgICAgICAgIGZlY2hhTmFjaW1pZW50byxcbiAgICAgICAgICAgIHRhbWHDsW8sXG4gICAgICAgICAgICBlbkFkb3BjaW9uOiBlbkFkb3BjaW9uIHx8IGZhbHNlLCBcbiAgICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoJy9tYXNjb3RhcycpO1xuXG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIG1hc2NvdGFJZDogbWFzY290YVJlZi5pZCB9O1xuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYWwgYWdyZWdhciBsYSBtYXNjb3RhOicsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnTm8gc2UgcHVkbyByZWdpc3RyYXIgbGEgbWFzY290YSBlbiBsYSBiYXNlIGRlIGRhdG9zLicgfTtcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjJSQTRCc0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/contexts/AuthContext.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$3a$a49213__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/data:a49213 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])();
const useAuth = ()=>{
    _s();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
};
_s(useAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
const AuthProvider = (param)=>{
    let { children } = param;
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userRole, setUserRole] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    /**
     * @function loginWithGoogle
     * @description Inicia sesión o registra a un usuario utilizando su cuenta de Google.
     * Corresponde a la "Historia de Usuario 3: Inicio de Sesión con Google".
     */ const loginWithGoogle = async ()=>{
        const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleAuthProvider"]();
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithPopup"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], provider);
            return result;
        } catch (error) {
            console.error("Error durante el inicio de sesión con Google:", error);
        }
    };
    /**
     * @function loginWithEmail
     * @description Autentica a un usuario registrado mediante su correo electrónico y contraseña.
     * Corresponde a la "Historia de Usuario 2: Inicio de Sesión de Usuario".
     */ const loginWithEmail = async (email, password)=>{
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signInWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, password);
            return result;
        } catch (error) {
            console.error("Error durante el inicio de sesión con email y contraseña:", error);
            throw error;
        }
    };
    /**
     * @function registerWithEmailAndPassword
     * @description Registra un nuevo usuario con correo y contraseña.
     * Tras el registro, invoca la función para completar el perfil inicial.
     * Corresponde a la "Historia de Usuario 1: Registro de Nuevo Usuario" y
     * a la "Historia de Usuario 6: Completar Perfil de Usuario".
     */ const registerWithEmailAndPassword = async (email, password, profileData)=>{
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createUserWithEmailAndPassword"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email, password);
            const user = result.user;
            if (user) {
                // Se llama a la server action para guardar los datos adicionales del perfil.
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$data$3a$a49213__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["completarPerfil"])(user.uid, profileData);
            }
            return result;
        } catch (error) {
            console.error("Error durante el registro:", error);
            throw error;
        }
    };
    /**
     * @function resetPassword
     * @description Envía un correo electrónico al usuario para que pueda restablecer su contraseña.
     * Corresponde a la "Historia de Usuario 4: Recuperación de Contraseña".
     */ const resetPassword = async (email)=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["sendPasswordResetEmail"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], email);
        } catch (error) {
            console.error("Error al enviar el correo de restablecimiento de contraseña:", error);
            throw error;
        }
    };
    const changePassword = async (currentPassword, newPassword)=>{
        const user = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"].currentUser;
        if (!user || !user.email) {
            throw new Error("No hay un usuario autenticado para realizar esta operación.");
        }
        // 1. Crear la credencial con el email del usuario y su contraseña actual
        const credential = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["EmailAuthProvider"].credential(user.email, currentPassword);
        try {
            // 2. Re-autenticar al usuario. Esto verifica que conoce su contraseña actual.
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["reauthenticateWithCredential"])(user, credential);
            // 3. Si la re-autenticación fue exitosa, actualizar la contraseña.
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["updatePassword"])(user, newPassword);
        } catch (error) {
            console.error("Error al cambiar la contraseña:", error);
            // Lanzar el error para poder gestionarlo en el componente (ej. contraseña incorrecta)
            throw error;
        }
    };
    const logout = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"]);
            await fetch('/api/auth/session', {
                method: 'DELETE'
            });
            router.push('/login');
        } catch (error) {
            console.error("Error durante el cierre de sesión:", error);
        }
    };
    /**
     * useEffect para observar cambios en el estado de autenticación.
     * Cuando un usuario inicia o cierra sesión, este efecto se ejecuta.
     * Obtiene el token de ID del usuario y extrae el "custom claim" del rol.
     * Si no tiene un rol asignado, se le da el rol de 'dueño' por defecto.
     * Corresponde a la "Historia de Usuario 5: Gestión de Roles de Usuario".
     */ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const unsubscribe = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["onAuthStateChanged"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], {
                "AuthProvider.useEffect.unsubscribe": async (currentUser)=>{
                    setLoading(true);
                    if (currentUser) {
                        try {
                            const idToken = await currentUser.getIdToken();
                            // Se envía el token al backend para crear una cookie de sesión.
                            await fetch('/api/auth/session', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify({
                                    idToken
                                })
                            });
                            // Se fuerza la actualización del token para obtener los claims más recientes.
                            const idTokenResult = await currentUser.getIdTokenResult(true);
                            // Se lee el rol desde los custom claims del token.
                            const roleFromClaim = idTokenResult.claims.role;
                            setUser(currentUser);
                            // Se establece el rol del usuario en el contexto. Por defecto es 'dueño'.
                            setUserRole(roleFromClaim || 'dueño');
                        } catch (error) {
                            console.error("Error al gestionar la sesión del usuario:", error);
                            // En caso de error, se mantiene al usuario pero con el rol base.
                            setUser(currentUser);
                            setUserRole('dueño');
                        }
                    } else {
                        // Si no hay usuario, se limpia el estado.
                        setUser(null);
                        setUserRole(null);
                    }
                    setLoading(false);
                }
            }["AuthProvider.useEffect.unsubscribe"]);
            return ({
                "AuthProvider.useEffect": ()=>unsubscribe()
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], []);
    const value = {
        user,
        userRole,
        loading,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmailAndPassword,
        resetPassword,
        changePassword,
        logout
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/contexts/AuthContext.js",
        lineNumber: 189,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(AuthProvider, "Mr7+Bsp7YR18uZGtp+HrIbhoSkM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/Header.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// --- Componente para los items del menú ---
// Corregido: La className y onClick se aplican directamente al Link.
const MenuItem = (param)=>{
    let { href, children, onClick, isDanger } = param;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: href || '#',
        onClick: onClick,
        className: "block w-full text-left px-4 py-2 text-sm ".concat(isDanger ? 'text-red-600' : 'text-gray-700', " hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors"),
        children: children
    }, void 0, false, {
        fileName: "[project]/src/app/components/Header.jsx",
        lineNumber: 11,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
};
_c = MenuItem;
// --- Componente Principal del Header ---
const Header = (param)=>{
    let { userData } = param;
    _s();
    const { logout } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const [isMenuOpen, setIsMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const menuRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            const handleClickOutside = {
                "Header.useEffect.handleClickOutside": (event)=>{
                    if (menuRef.current && !menuRef.current.contains(event.target)) {
                        setIsMenuOpen(false);
                    }
                }
            }["Header.useEffect.handleClickOutside"];
            document.addEventListener('mousedown', handleClickOutside);
            return ({
                "Header.useEffect": ()=>document.removeEventListener('mousedown', handleClickOutside)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    const getInitials = (name)=>{
        if (!name) return '?';
        const names = name.split(' ');
        if (names.length > 1) {
            return "".concat(names[0][0]).concat(names[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "bg-white text-gray-800 p-4 flex justify-between items-center shadow-md sticky top-0 z-50 w-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/",
                    className: "text-xl font-bold text-gray-900 hover:text-violet-700 transition-colors",
                    children: "Veterinaria Magali Martin"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/Header.jsx",
                    lineNumber: 51,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/components/Header.jsx",
                lineNumber: 50,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-shrink-0",
                children: userData.isLoggedIn ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    ref: menuRef,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setIsMenuOpen(!isMenuOpen),
                            className: "flex items-center justify-center bg-gray-200 rounded-full h-10 w-10 text-gray-600 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 overflow-hidden",
                            children: userData.picture ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: userData.picture,
                                alt: "Avatar",
                                width: 40,
                                height: 40
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Header.jsx",
                                lineNumber: 65,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: getInitials(userData.name)
                            }, void 0, false, {
                                fileName: "[project]/src/app/components/Header.jsx",
                                lineNumber: 67,
                                columnNumber: 17
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/components/Header.jsx",
                            lineNumber: 63,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        isMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none p-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "px-4 py-3 border-b mb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-semibold text-gray-900 truncate",
                                            children: userData.name
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Header.jsx",
                                            lineNumber: 74,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-gray-500 truncate",
                                            children: userData.email
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Header.jsx",
                                            lineNumber: 75,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Header.jsx",
                                    lineNumber: 73,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuItem, {
                                            href: "/mis-datos",
                                            children: "Mis Datos"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Header.jsx",
                                            lineNumber: 79,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuItem, {
                                            href: "/mascotas",
                                            children: "Mis Mascotas"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Header.jsx",
                                            lineNumber: 80,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuItem, {
                                            href: "/mis-turnos",
                                            children: "Mis Turnos"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Header.jsx",
                                            lineNumber: 81,
                                            columnNumber: 21
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/components/Header.jsx",
                                    lineNumber: 78,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)),
                                userData.role === 'admin' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "py-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-red-50 rounded-md",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuItem, {
                                            href: "/admin",
                                            isDanger: true,
                                            children: "Panel de Admin"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/components/Header.jsx",
                                            lineNumber: 87,
                                            columnNumber: 23
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Header.jsx",
                                        lineNumber: 86,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Header.jsx",
                                    lineNumber: 85,
                                    columnNumber: 19
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "border-t mt-2 pt-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MenuItem, {
                                        onClick: logout,
                                        isDanger: true,
                                        children: "Cerrar Sesión"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/components/Header.jsx",
                                        lineNumber: 93,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/components/Header.jsx",
                                    lineNumber: 92,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/components/Header.jsx",
                            lineNumber: 72,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/components/Header.jsx",
                    lineNumber: 62,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)) : /* Corregido: Se eliminó la etiqueta <a> anidada */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/login",
                    className: "bg-violet-600 hover:bg-violet-700 text-white font-semibold px-4 py-2 rounded-full transition-colors",
                    children: "Iniciar Sesión"
                }, void 0, false, {
                    fileName: "[project]/src/app/components/Header.jsx",
                    lineNumber: 100,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/app/components/Header.jsx",
                lineNumber: 60,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/Header.jsx",
        lineNumber: 46,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(Header, "dUecqgKW9ALEcRDWt2+RerD2Xt0=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"]
    ];
});
_c1 = Header;
const __TURBOPACK__default__export__ = Header;
var _c, _c1;
__turbopack_context__.k.register(_c, "MenuItem");
__turbopack_context__.k.register(_c1, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_d7e4b5c5._.js.map