(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/components/PrivateRoute.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PrivateRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.esm.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
function PrivateRoute(param) {
    let { children } = param;
    _s();
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isProfileComplete, setIsProfileComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [checkingProfile, setCheckingProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PrivateRoute.useEffect": ()=>{
            if (loading) return;
            // If no user, redirect to login, but avoid loop if already there
            if (!user) {
                if (pathname !== '/login') {
                    router.push('/login');
                }
                // Set checking to false since we've made our decision
                setCheckingProfile(false);
                return;
            }
            const checkUserProfile = {
                "PrivateRoute.useEffect.checkUserProfile": async ()=>{
                    try {
                        // Corrected collection from 'clientes' to 'users'
                        const userDocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["db"], 'users', user.uid);
                        const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getDoc"])(userDocRef);
                        // Use the 'profileCompleted' flag for a more robust check
                        if (userDoc.exists() && userDoc.data().profileCompleted) {
                            setIsProfileComplete(true);
                        } else {
                            setIsProfileComplete(false);
                            if (pathname !== '/completar-perfil') {
                                router.push('/completar-perfil');
                            }
                        }
                    } catch (error) {
                        console.error("Error al verificar el perfil:", error);
                        // On error, we'll assume profile is incomplete to be safe
                        setIsProfileComplete(false);
                        if (pathname !== '/completar-perfil') {
                            router.push('/completar-perfil');
                        }
                    } finally{
                        setCheckingProfile(false);
                    }
                }
            }["PrivateRoute.useEffect.checkUserProfile"];
            checkUserProfile();
        }
    }["PrivateRoute.useEffect"], [
        user,
        loading,
        router,
        pathname
    ]);
    // Show a loading indicator while we verify auth and profile status
    if (loading || checkingProfile) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Cargando..."
        }, void 0, false, {
            fileName: "[project]/src/app/components/PrivateRoute.js",
            lineNumber: 62,
            columnNumber: 12
        }, this); // Or a more sophisticated spinner/skeleton component
    }
    // If user is not logged in, and we are on a public route like /login, show the page
    if (!user && pathname === '/login') {
        return children;
    }
    // If the profile is complete, show the requested page
    if (isProfileComplete) {
        return children;
    }
    // If the profile is not complete, but we are on the page to complete it, show the page
    if (!isProfileComplete && pathname === '/completar-perfil') {
        return children;
    }
    // In other cases (like waiting for redirect), return null to prevent content flash
    return null;
}
_s(PrivateRoute, "x4Hczaizp5z09gCa/GS6FLjamL8=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["usePathname"]
    ];
});
_c = PrivateRoute;
var _c;
__turbopack_context__.k.register(_c, "PrivateRoute");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/actions/data:1f924f [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4093a4aa03c2c59627713abff7895576bb00a12544":"cancelarTurnoUsuario"},"src/app/actions/turnosActions.js",""] */ __turbopack_context__.s([
    "cancelarTurnoUsuario",
    ()=>cancelarTurnoUsuario
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var cancelarTurnoUsuario = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4093a4aa03c2c59627713abff7895576bb00a12544", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "cancelarTurnoUsuario"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHVybm9zQWN0aW9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcbmltcG9ydCBhZG1pbiBmcm9tICdAL2xpYi9maXJlYmFzZUFkbWluJztcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xuaW1wb3J0IHsgZ2V0VXNlcklkRnJvbVNlc3Npb24gfSBmcm9tICdAL2xpYi9maXJlYmFzZUFkbWluJztcblxuLy8gLS0tIEzDs2dpY2EgcGFyYSBUdXJub3MgZGUgUGVsdXF1ZXLDrWEgLS0tXG5cbmNvbnN0IE1BWF9QRVJST1NfR1JBTkRFU19QT1JfRElBID0gMjtcbmNvbnN0IE1BWF9UVVJOT1NfUE9SX1RVUk5PX1BFTFVRVUVSSUEgPSA4O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc29saWNpdGFyVHVybm9QZWx1cXVlcmlhKHR1cm5vRGF0YSkge1xuICAgIGNvbnN0IHsgY2xpZW50ZUlkLCBtYXNjb3RhSWQsIGZlY2hhLCB0dXJubywgc2VydmljaW9zLCB0cmFuc3BvcnRlIH0gPSB0dXJub0RhdGE7XG5cbiAgICBpZiAoIWNsaWVudGVJZCB8fCAhbWFzY290YUlkIHx8ICFmZWNoYSB8fCAhdHVybm8pIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnRmFsdGFuIGRhdG9zIGVzZW5jaWFsZXMgcGFyYSBzb2xpY2l0YXIgZWwgdHVybm8uJyB9O1xuICAgIH1cblxuICAgIGNvbnN0IGZpcmVzdG9yZSA9IGFkbWluLmZpcmVzdG9yZSgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbWFzY290YVJlZiA9IGZpcmVzdG9yZS5jb2xsZWN0aW9uKCd1c2VycycpLmRvYyhjbGllbnRlSWQpLmNvbGxlY3Rpb24oJ21hc2NvdGFzJykuZG9jKG1hc2NvdGFJZCk7XG4gICAgICAgIGNvbnN0IG1hc2NvdGFTbmFwID0gYXdhaXQgbWFzY290YVJlZi5nZXQoKTtcblxuICAgICAgICBpZiAoIW1hc2NvdGFTbmFwLmV4aXN0cykge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnTGEgbWFzY290YSBzZWxlY2Npb25hZGEgbm8gZXhpc3RlLicgfTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB0YW1hw7FvTWFzY290YSA9IG1hc2NvdGFTbmFwLmRhdGEoKS50YW1hw7FvO1xuXG4gICAgICAgIGNvbnN0IHJlc3VsdGFkbyA9IGF3YWl0IGZpcmVzdG9yZS5ydW5UcmFuc2FjdGlvbihhc3luYyAodHJhbnNhY3Rpb24pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHR1cm5vc1JlZiA9IGZpcmVzdG9yZS5jb2xsZWN0aW9uKCd0dXJub3MnKTtcblxuICAgICAgICAgICAgaWYgKHRhbWHDsW9NYXNjb3RhID09PSAnZ3JhbmRlJykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHFHcmFuZGVzID0gdHVybm9zUmVmXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSgnZmVjaGEnLCAnPT0nLCBmZWNoYSlcbiAgICAgICAgICAgICAgICAgICAgLndoZXJlKCd0aXBvJywgJz09JywgJ3BlbHVxdWVyaWEnKVxuICAgICAgICAgICAgICAgICAgICAud2hlcmUoJ3RhbWHDsW9NYXNjb3RhJywgJz09JywgJ2dyYW5kZScpXG4gICAgICAgICAgICAgICAgICAgIC53aGVyZSgnZXN0YWRvJywgJ2luJywgWydwZW5kaWVudGUnLCAnY29uZmlybWFkbyddKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBjb25zdCBzbmFwR3JhbmRlcyA9IGF3YWl0IHRyYW5zYWN0aW9uLmdldChxR3JhbmRlcyk7XG4gICAgICAgICAgICAgICAgaWYgKHNuYXBHcmFuZGVzLmRvY3MubGVuZ3RoID49IE1BWF9QRVJST1NfR1JBTkRFU19QT1JfRElBKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignRWwgY3VwbyBwYXJhIHBlcnJvcyBncmFuZGVzIGVuIGVzdGEgZmVjaGEgeWEgZXN0w6EgY29tcGxldG8uJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBxVHVybm8gPSB0dXJub3NSZWZcbiAgICAgICAgICAgICAgICAud2hlcmUoJ2ZlY2hhJywgJz09JywgZmVjaGEpXG4gICAgICAgICAgICAgICAgLndoZXJlKCd0dXJubycsICc9PScsIHR1cm5vKVxuICAgICAgICAgICAgICAgIC53aGVyZSgndGlwbycsICc9PScsICdwZWx1cXVlcmlhJylcbiAgICAgICAgICAgICAgICAud2hlcmUoJ2VzdGFkbycsICdpbicsIFsncGVuZGllbnRlJywgJ2NvbmZpcm1hZG8nXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IHNuYXBUdXJubyA9IGF3YWl0IHRyYW5zYWN0aW9uLmdldChxVHVybm8pO1xuICAgICAgICAgICAgaWYgKHNuYXBUdXJuby5kb2NzLmxlbmd0aCA+PSBNQVhfVFVSTk9TX1BPUl9UVVJOT19QRUxVUVVFUklBKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbCB0dXJubyBkZSBsYSAke3R1cm5vfSBwYXJhIGVzdGEgZmVjaGEgeWEgZXN0w6EgY29tcGxldG8uYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG51ZXZvVHVybm9SZWYgPSBmaXJlc3RvcmUuY29sbGVjdGlvbigndHVybm9zJykuZG9jKCk7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5zZXQobnVldm9UdXJub1JlZiwge1xuICAgICAgICAgICAgICAgIC4uLnR1cm5vRGF0YSxcbiAgICAgICAgICAgICAgICB0YW1hw7FvTWFzY290YSxcbiAgICAgICAgICAgICAgICBlc3RhZG86ICdwZW5kaWVudGUnLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHR1cm5vSWQ6IG51ZXZvVHVybm9SZWYuaWQgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoJy9hZG1pbi90dXJub3MnKTtcbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoJy9taXMtdHVybm9zJyk7XG4gICAgICAgIHJldHVybiByZXN1bHRhZG87XG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBlbiBsYSB0cmFuc2FjY2nDs24gZGUgc29saWNpdHVkIGRlIHR1cm5vIGRlIHBlbHVxdWVyw61hOicsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgfVxufVxuXG5cbi8vIC0tLSBMw7NnaWNhIHBhcmEgVHVybm9zIGRlIENvbnN1bHRhIC0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc29saWNpdGFyVHVybm9Db25zdWx0YSh0dXJub0RhdGEpIHtcbiAgICBjb25zdCB7IGNsaWVudGVJZCwgbWFzY290YUlkLCBmZWNoYSwgdHVybm8sIG1vdGl2byB9ID0gdHVybm9EYXRhO1xuXG4gICAgaWYgKCFjbGllbnRlSWQgfHwgIW1hc2NvdGFJZCB8fCAhZmVjaGEgfHwgIXR1cm5vIHx8ICFtb3Rpdm8pIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnRmFsdGFuIGRhdG9zIGVzZW5jaWFsZXMgcGFyYSBzb2xpY2l0YXIgZWwgdHVybm8uJyB9O1xuICAgIH1cblxuICAgIGNvbnN0IGZpcmVzdG9yZSA9IGFkbWluLmZpcmVzdG9yZSgpO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc3QgbnVldm9UdXJub1JlZiA9IGZpcmVzdG9yZS5jb2xsZWN0aW9uKCd0dXJub3MnKS5kb2MoKTtcbiAgICAgICAgXG4gICAgICAgIGF3YWl0IG51ZXZvVHVybm9SZWYuc2V0KHtcbiAgICAgICAgICAgIC4uLnR1cm5vRGF0YSxcbiAgICAgICAgICAgIHRpcG86ICdjb25zdWx0YScsXG4gICAgICAgICAgICBlc3RhZG86ICdwZW5kaWVudGUnLFxuICAgICAgICAgICAgY3JlYXRlZEF0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvYWRtaW4vdHVybm9zJyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvbWlzLXR1cm5vcycpO1xuXG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHR1cm5vSWQ6IG51ZXZvVHVybm9SZWYuaWQgfTtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFsIHNvbGljaXRhciBlbCB0dXJubyBkZSBjb25zdWx0YTonLCBlcnJvcik7XG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ09jdXJyacOzIHVuIGVycm9yIGluZXNwZXJhZG8gYWwgZ3VhcmRhciBsYSBzb2xpY2l0dWQuJyB9O1xuICAgIH1cbn1cblxuXG4vLyAtLS0gTMOTR0lDQSBERSBDQU5DRUxBQ0nDk04gREUgVFVSTk8gKFBBUkEgVVNVQVJJT1MpIC0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2FuY2VsYXJUdXJub1VzdWFyaW8odHVybm9JZCkge1xuICAgIGNvbnN0IHNlc3Npb25Db29raWUgPSBjb29raWVzKCkuZ2V0KCdfX3Nlc3Npb24nKT8udmFsdWUgfHwgJyc7XG4gICAgY29uc3QgdXNlcklkID0gYXdhaXQgZ2V0VXNlcklkRnJvbVNlc3Npb24oc2Vzc2lvbkNvb2tpZSk7XG5cbiAgICBpZiAoIXVzZXJJZCkge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdObyBlc3TDoXMgYXV0ZW50aWNhZG8uJyB9O1xuICAgIH1cblxuICAgIGlmICghdHVybm9JZCkge1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdObyBzZSBwcm9wb3JjaW9uw7MgdW4gSUQgZGUgdHVybm8uJyB9O1xuICAgIH1cblxuICAgIGNvbnN0IGZpcmVzdG9yZSA9IGFkbWluLmZpcmVzdG9yZSgpO1xuICAgIGNvbnN0IHR1cm5vUmVmID0gZmlyZXN0b3JlLmNvbGxlY3Rpb24oJ3R1cm5vcycpLmRvYyh0dXJub0lkKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHR1cm5vU25hcCA9IGF3YWl0IHR1cm5vUmVmLmdldCgpO1xuXG4gICAgICAgIGlmICghdHVybm9TbmFwLmV4aXN0cykge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnRWwgdHVybm8gbm8gZXhpc3RlLicgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHR1cm5vRGF0YSA9IHR1cm5vU25hcC5kYXRhKCk7XG5cbiAgICAgICAgLy8gVmVyaWZpY2FjacOzbiBkZSBwcm9waWVkYWRcbiAgICAgICAgaWYgKHR1cm5vRGF0YS51c2VySWQgIT09IHVzZXJJZCkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnTm8gdGllbmVzIHBlcm1pc28gcGFyYSBjYW5jZWxhciBlc3RlIHR1cm5vLicgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFZlcmlmaWNhciBxdWUgZWwgdHVybm8gbm8gZXN0w6kgeWEgY2FuY2VsYWRvIG8gY29tcGxldGFkb1xuICAgICAgICBpZiAoWyAnY2FuY2VsYWRvJywgJ2NvbXBsZXRhZG8nXS5pbmNsdWRlcyh0dXJub0RhdGEuZXN0YWRvKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnRXN0ZSB0dXJubyB5YSBubyBzZSBwdWVkZSBjYW5jZWxhci4nIH07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBWZXJpZmljYXIgcXVlIGxhIGZlY2hhIGRlbCB0dXJubyBubyBoYXlhIHBhc2Fkb1xuICAgICAgICBjb25zdCBob3kgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBob3kuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICAgIGNvbnN0IGZlY2hhVHVybm8gPSBuZXcgRGF0ZSh0dXJub0RhdGEuZmVjaGEgKyAnVDEyOjAwOjAwJyk7IC8vIEFzZWd1cmFyIHF1ZSBsYSBjb21wYXJhY2nDs24gZGUgZmVjaGFzIHNlYSBjb3JyZWN0YVxuXG4gICAgICAgIGlmIChmZWNoYVR1cm5vIDwgaG95KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdObyBzZSBwdWVkZSBjYW5jZWxhciB1biB0dXJubyBxdWUgeWEgaGEgcGFzYWRvLicgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFjdHVhbGl6YXIgZWwgZXN0YWRvIGRlbCB0dXJub1xuICAgICAgICBhd2FpdCB0dXJub1JlZi51cGRhdGUoe1xuICAgICAgICAgICAgZXN0YWRvOiAnY2FuY2VsYWRvJyxcbiAgICAgICAgICAgIGNhbmNlbGFkb0F0OiBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCksXG4gICAgICAgICAgICBjYW5jZWxhZG9Qb3I6ICd1c3VhcmlvJ1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBSZXZhbGlkYXIgY2FjaMOpcyBwYXJhIHF1ZSBsYXMgdmlzdGFzIHNlIGFjdHVhbGljZW5cbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoJy9taXMtdHVybm9zJyk7XG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvYWRtaW4vdHVybm9zJyk7XG5cbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xuXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRXJyb3IgYWwgY2FuY2VsYXIgZWwgdHVybm86JywgZXJyb3IpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdPY3VycmnDsyB1biBlcnJvciBpbmVzcGVyYWRvIGFsIGludGVudGFyIGNhbmNlbGFyIGVsIHR1cm5vLicgfTtcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjhTQW1Ic0IifQ==
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/app/components/AccionesTurnoUsuario.jsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AccionesTurnoUsuario
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fi/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$data$3a$1f924f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/actions/data:1f924f [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AccionesTurnoUsuario(param) {
    let { turno } = param;
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    // No mostramos ninguna acción si el turno ya está cancelado, completado o si ya pasó la fecha.
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaTurno = new Date(turno.fecha + 'T12:00:00');
    const puedeCancelar = (turno.estado === 'pendiente' || turno.estado === 'confirmado') && fechaTurno >= hoy;
    if (!puedeCancelar) {
        return null; // No renderizar nada si no se puede cancelar
    }
    const handleCancel = async ()=>{
        if (!window.confirm('¿Estás seguro de que quieres cancelar este turno? Esta acción no se puede deshacer.')) {
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$data$3a$1f924f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["cancelarTurnoUsuario"])(turno.id);
            if (result.success) {
                setSuccess('Turno cancelado con éxito.');
            // El componente se ocultará automáticamente en la siguiente renderización gracias a revalidatePath
            } else {
                setError(result.error || 'No se pudo cancelar el turno.');
            }
        } catch (err) {
            setError('Error de conexión al intentar cancelar.');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-shrink-0 self-center mt-4 sm:mt-0",
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-red-600 mb-2 text-center",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/components/AccionesTurnoUsuario.jsx",
                lineNumber: 53,
                columnNumber: 23
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-green-600 mb-2 text-center",
                children: success
            }, void 0, false, {
                fileName: "[project]/src/app/components/AccionesTurnoUsuario.jsx",
                lineNumber: 54,
                columnNumber: 25
            }, this),
            !success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleCancel,
                disabled: loading,
                className: "flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-full text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["FiTrash2"], {
                        className: "mr-2 h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/src/app/components/AccionesTurnoUsuario.jsx",
                        lineNumber: 62,
                        columnNumber: 21
                    }, this),
                    loading ? 'Cancelando...' : 'Cancelar Turno'
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/components/AccionesTurnoUsuario.jsx",
                lineNumber: 57,
                columnNumber: 18
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/components/AccionesTurnoUsuario.jsx",
        lineNumber: 52,
        columnNumber: 9
    }, this);
}
_s(AccionesTurnoUsuario, "E47IYu+wSQ7BjstcfUehFW58aNU=");
_c = AccionesTurnoUsuario;
var _c;
__turbopack_context__.k.register(_c, "AccionesTurnoUsuario");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_28c5292c._.js.map