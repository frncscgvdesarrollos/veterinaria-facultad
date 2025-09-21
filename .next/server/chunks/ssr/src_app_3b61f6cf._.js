module.exports = [
"[project]/src/app/components/PrivateRoute.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PrivateRoute
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$firestore$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/firestore/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/firestore/dist/index.node.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.js [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
function PrivateRoute({ children }) {
    const { user, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuth"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    const [isProfileComplete, setIsProfileComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [checkingProfile, setCheckingProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (loading) return;
        if (!user) {
            if (pathname !== '/login') {
                router.push('/login');
            }
            setCheckingProfile(false);
            return;
        }
        const checkUserProfile = async ()=>{
            try {
                const userDocRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["doc"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["db"], 'users', user.uid);
                const userDoc = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$firestore$2f$dist$2f$index$2e$node$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getDoc"])(userDocRef);
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
                setIsProfileComplete(false);
                if (pathname !== '/completar-perfil') {
                    router.push('/completar-perfil');
                }
            } finally{
                setCheckingProfile(false);
            }
        };
        checkUserProfile();
    }, [
        user,
        loading,
        router,
        pathname
    ]);
    if (loading || checkingProfile) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: "Cargando..."
        }, void 0, false, {
            fileName: "[project]/src/app/components/PrivateRoute.js",
            lineNumber: 62,
            columnNumber: 12
        }, this);
    }
    if (!user && pathname === '/login') {
        return children;
    }
    if (isProfileComplete) {
        return children;
    }
    if (!isProfileComplete && pathname === '/completar-perfil') {
        return children;
    }
    return null;
}
}),
"[project]/src/app/actions/data:026b1e [app-ssr] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4093a4aa03c2c59627713abff7895576bb00a12544":"cancelarTurnoUsuario"},"src/app/actions/turnosActions.js",""] */ __turbopack_context__.s([
    "cancelarTurnoUsuario",
    ()=>cancelarTurnoUsuario
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-ssr] (ecmascript)");
"use turbopack no side effects";
;
var cancelarTurnoUsuario = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createServerReference"])("4093a4aa03c2c59627713abff7895576bb00a12544", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["findSourceMapURL"], "cancelarTurnoUsuario"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdHVybm9zQWN0aW9ucy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJcbid1c2Ugc2VydmVyJztcblxuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tICduZXh0L2NhY2hlJztcbmltcG9ydCBhZG1pbiBmcm9tICdAL2xpYi9maXJlYmFzZUFkbWluJztcbmltcG9ydCB7IGNvb2tpZXMgfSBmcm9tICduZXh0L2hlYWRlcnMnO1xuaW1wb3J0IHsgZ2V0VXNlcklkRnJvbVNlc3Npb24gfSBmcm9tICdAL2xpYi9maXJlYmFzZUFkbWluJztcblxuLy8gLS0tIEzDs2dpY2EgcGFyYSBUdXJub3MgZGUgUGVsdXF1ZXLDrWEgLS0tXG5cbmNvbnN0IE1BWF9QRVJST1NfR1JBTkRFU19QT1JfRElBID0gMjtcbmNvbnN0IE1BWF9UVVJOT1NfUE9SX1RVUk5PX1BFTFVRVUVSSUEgPSA4O1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc29saWNpdGFyVHVybm9QZWx1cXVlcmlhKHR1cm5vRGF0YSkge1xuICAgIGNvbnN0IHsgY2xpZW50ZUlkLCBtYXNjb3RhSWQsIGZlY2hhLCB0dXJubywgc2VydmljaW9zLCB0cmFuc3BvcnRlLCBtZXRvZG9QYWdvIH0gPSB0dXJub0RhdGE7XG5cbiAgICBpZiAoIWNsaWVudGVJZCB8fCAhbWFzY290YUlkIHx8ICFmZWNoYSB8fCAhdHVybm8gfHwgIW1ldG9kb1BhZ28pIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnRmFsdGFuIGRhdG9zIGVzZW5jaWFsZXMsIGluY2x1aWRvIGVsIG3DqXRvZG8gZGUgcGFnby4nIH07XG4gICAgfVxuXG4gICAgY29uc3QgZmlyZXN0b3JlID0gYWRtaW4uZmlyZXN0b3JlKCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBtYXNjb3RhUmVmID0gZmlyZXN0b3JlLmNvbGxlY3Rpb24oJ3VzZXJzJykuZG9jKGNsaWVudGVJZCkuY29sbGVjdGlvbignbWFzY290YXMnKS5kb2MobWFzY290YUlkKTtcbiAgICAgICAgY29uc3QgbWFzY290YVNuYXAgPSBhd2FpdCBtYXNjb3RhUmVmLmdldCgpO1xuXG4gICAgICAgIGlmICghbWFzY290YVNuYXAuZXhpc3RzKSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdMYSBtYXNjb3RhIHNlbGVjY2lvbmFkYSBubyBleGlzdGUuJyB9O1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHRhbWHDsW9NYXNjb3RhID0gbWFzY290YVNuYXAuZGF0YSgpLnRhbWHDsW87XG5cbiAgICAgICAgY29uc3QgcmVzdWx0YWRvID0gYXdhaXQgZmlyZXN0b3JlLnJ1blRyYW5zYWN0aW9uKGFzeW5jICh0cmFuc2FjdGlvbikgPT4ge1xuICAgICAgICAgICAgY29uc3QgdHVybm9zUmVmID0gZmlyZXN0b3JlLmNvbGxlY3Rpb24oJ3R1cm5vcycpO1xuXG4gICAgICAgICAgICBpZiAodGFtYcOxb01hc2NvdGEgPT09ICdncmFuZGUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcUdyYW5kZXMgPSB0dXJub3NSZWYud2hlcmUoJ2ZlY2hhJywgJz09JywgZmVjaGEpLndoZXJlKCd0aXBvJywgJz09JywgJ3BlbHVxdWVyaWEnKS53aGVyZSgndGFtYcOxb01hc2NvdGEnLCAnPT0nLCAnZ3JhbmRlJykud2hlcmUoJ2VzdGFkbycsICdpbicsIFsncGVuZGllbnRlJywgJ2NvbmZpcm1hZG8nXSk7XG4gICAgICAgICAgICAgICAgY29uc3Qgc25hcEdyYW5kZXMgPSBhd2FpdCB0cmFuc2FjdGlvbi5nZXQocUdyYW5kZXMpO1xuICAgICAgICAgICAgICAgIGlmIChzbmFwR3JhbmRlcy5kb2NzLmxlbmd0aCA+PSBNQVhfUEVSUk9TX0dSQU5ERVNfUE9SX0RJQSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0VsIGN1cG8gcGFyYSBwZXJyb3MgZ3JhbmRlcyBlbiBlc3RhIGZlY2hhIHlhIGVzdMOhIGNvbXBsZXRvLicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IHFUdXJubyA9IHR1cm5vc1JlZi53aGVyZSgnZmVjaGEnLCAnPT0nLCBmZWNoYSkud2hlcmUoJ3R1cm5vJywgJz09JywgdHVybm8pLndoZXJlKCd0aXBvJywgJz09JywgJ3BlbHVxdWVyaWEnKS53aGVyZSgnZXN0YWRvJywgJ2luJywgWydwZW5kaWVudGUnLCAnY29uZmlybWFkbyddKTtcbiAgICAgICAgICAgIGNvbnN0IHNuYXBUdXJubyA9IGF3YWl0IHRyYW5zYWN0aW9uLmdldChxVHVybm8pO1xuICAgICAgICAgICAgaWYgKHNuYXBUdXJuby5kb2NzLmxlbmd0aCA+PSBNQVhfVFVSTk9TX1BPUl9UVVJOT19QRUxVUVVFUklBKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBFbCB0dXJubyBkZSBsYSAke3R1cm5vfSBwYXJhIGVzdGEgZmVjaGEgeWEgZXN0w6EgY29tcGxldG8uYCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IG51ZXZvVHVybm9SZWYgPSBmaXJlc3RvcmUuY29sbGVjdGlvbigndHVybm9zJykuZG9jKCk7XG4gICAgICAgICAgICB0cmFuc2FjdGlvbi5zZXQobnVldm9UdXJub1JlZiwge1xuICAgICAgICAgICAgICAgIC4uLnR1cm5vRGF0YSxcbiAgICAgICAgICAgICAgICB0YW1hw7FvTWFzY290YSxcbiAgICAgICAgICAgICAgICBlc3RhZG86ICdwZW5kaWVudGUnLFxuICAgICAgICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUsIHR1cm5vSWQ6IG51ZXZvVHVybm9SZWYuaWQgfTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoJy9hZG1pbi90dXJub3MnKTtcbiAgICAgICAgcmV2YWxpZGF0ZVBhdGgoJy9taXMtdHVybm9zJyk7XG4gICAgICAgIHJldHVybiByZXN1bHRhZG87XG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBlbiBsYSB0cmFuc2FjY2nDs24gZGUgc29saWNpdHVkIGRlIHR1cm5vIGRlIHBlbHVxdWVyw61hOicsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiBlcnJvci5tZXNzYWdlIH07XG4gICAgfVxufVxuXG5cbi8vIC0tLSBMw7NnaWNhIHBhcmEgVHVybm9zIGRlIENvbnN1bHRhIC0tLVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc29saWNpdGFyVHVybm9Db25zdWx0YSh0dXJub0RhdGEpIHtcbiAgICAvLyBBw7FhZGltb3MgJ21ldG9kb1BhZ28nIGEgbGEgZGVzZXN0cnVjdHVyYWNpw7NuXG4gICAgY29uc3QgeyBjbGllbnRlSWQsIG1hc2NvdGFJZCwgZmVjaGEsIHR1cm5vLCBtb3Rpdm8sIG1ldG9kb1BhZ28gfSA9IHR1cm5vRGF0YTtcblxuICAgIC8vIEHDsWFkaW1vcyB2YWxpZGFjacOzbiBwYXJhIGVsIG51ZXZvIGNhbXBvXG4gICAgaWYgKCFjbGllbnRlSWQgfHwgIW1hc2NvdGFJZCB8fCAhZmVjaGEgfHwgIXR1cm5vIHx8ICFtb3Rpdm8gfHwgIW1ldG9kb1BhZ28pIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnRmFsdGFuIGRhdG9zIGVzZW5jaWFsZXMsIGluY2x1aWRvIGVsIG3DqXRvZG8gZGUgcGFnby4nIH07XG4gICAgfVxuXG4gICAgY29uc3QgZmlyZXN0b3JlID0gYWRtaW4uZmlyZXN0b3JlKCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCBudWV2b1R1cm5vUmVmID0gZmlyZXN0b3JlLmNvbGxlY3Rpb24oJ3R1cm5vcycpLmRvYygpO1xuICAgICAgICBcbiAgICAgICAgLy8gRWwgb3BlcmFkb3IgJy4uLicgc2UgYXNlZ3VyYSBkZSBxdWUgJ21ldG9kb1BhZ28nIHNlIGd1YXJkZSBlbiBsYSBCRFxuICAgICAgICBhd2FpdCBudWV2b1R1cm5vUmVmLnNldCh7XG4gICAgICAgICAgICAuLi50dXJub0RhdGEsXG4gICAgICAgICAgICB0aXBvOiAnY29uc3VsdGEnLFxuICAgICAgICAgICAgZXN0YWRvOiAncGVuZGllbnRlJyxcbiAgICAgICAgICAgIGNyZWF0ZWRBdDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxuICAgICAgICB9KTtcblxuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL2FkbWluL3R1cm5vcycpO1xuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL21pcy10dXJub3MnKTtcblxuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlLCB0dXJub0lkOiBudWV2b1R1cm5vUmVmLmlkIH07XG5cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdFcnJvciBhbCBzb2xpY2l0YXIgZWwgdHVybm8gZGUgY29uc3VsdGE6JywgZXJyb3IpO1xuICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdPY3VycmnDsyB1biBlcnJvciBpbmVzcGVyYWRvIGFsIGd1YXJkYXIgbGEgc29saWNpdHVkLicgfTtcbiAgICB9XG59XG5cblxuLy8gLS0tIEzDk0dJQ0EgREUgQ0FOQ0VMQUNJw5NOIERFIFRVUk5PIChQQVJBIFVTVUFSSU9TKSAtLS1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNhbmNlbGFyVHVybm9Vc3VhcmlvKHR1cm5vSWQpIHtcbiAgICBjb25zdCBzZXNzaW9uQ29va2llID0gY29va2llcygpLmdldCgnX19zZXNzaW9uJyk/LnZhbHVlIHx8ICcnO1xuICAgIGNvbnN0IHVzZXJJZCA9IGF3YWl0IGdldFVzZXJJZEZyb21TZXNzaW9uKHNlc3Npb25Db29raWUpO1xuXG4gICAgaWYgKCF1c2VySWQpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnTm8gZXN0w6FzIGF1dGVudGljYWRvLicgfTtcbiAgICB9XG5cbiAgICBpZiAoIXR1cm5vSWQpIHtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnTm8gc2UgcHJvcG9yY2lvbsOzIHVuIElEIGRlIHR1cm5vLicgfTtcbiAgICB9XG5cbiAgICBjb25zdCBmaXJlc3RvcmUgPSBhZG1pbi5maXJlc3RvcmUoKTtcbiAgICBjb25zdCB0dXJub1JlZiA9IGZpcmVzdG9yZS5jb2xsZWN0aW9uKCd0dXJub3MnKS5kb2ModHVybm9JZCk7XG5cbiAgICB0cnkge1xuICAgICAgICBjb25zdCB0dXJub1NuYXAgPSBhd2FpdCB0dXJub1JlZi5nZXQoKTtcblxuICAgICAgICBpZiAoIXR1cm5vU25hcC5leGlzdHMpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ0VsIHR1cm5vIG5vIGV4aXN0ZS4nIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0dXJub0RhdGEgPSB0dXJub1NuYXAuZGF0YSgpO1xuXG4gICAgICAgIGlmICh0dXJub0RhdGEuY2xpZW50ZUlkICE9PSB1c2VySWQpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IGZhbHNlLCBlcnJvcjogJ05vIHRpZW5lcyBwZXJtaXNvIHBhcmEgY2FuY2VsYXIgZXN0ZSB0dXJuby4nIH07XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoWyAnY2FuY2VsYWRvJywgJ2NvbXBsZXRhZG8nXS5pbmNsdWRlcyh0dXJub0RhdGEuZXN0YWRvKSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnRXN0ZSB0dXJubyB5YSBubyBzZSBwdWVkZSBjYW5jZWxhci4nIH07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBob3kgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBob3kuc2V0SG91cnMoMCwgMCwgMCwgMCk7XG4gICAgICAgIGNvbnN0IGZlY2hhVHVybm8gPSBuZXcgRGF0ZSh0dXJub0RhdGEuZmVjaGEgKyAnVDEyOjAwOjAwJyk7IFxuXG4gICAgICAgIGlmIChmZWNoYVR1cm5vIDwgaG95KSB7XG4gICAgICAgICAgICByZXR1cm4geyBzdWNjZXNzOiBmYWxzZSwgZXJyb3I6ICdObyBzZSBwdWVkZSBjYW5jZWxhciB1biB0dXJubyBxdWUgeWEgaGEgcGFzYWRvLicgfTtcbiAgICAgICAgfVxuXG4gICAgICAgIGF3YWl0IHR1cm5vUmVmLnVwZGF0ZSh7XG4gICAgICAgICAgICBlc3RhZG86ICdjYW5jZWxhZG8nLFxuICAgICAgICAgICAgY2FuY2VsYWRvQXQ6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgICAgICAgIGNhbmNlbGFkb1BvcjogJ3VzdWFyaW8nXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldmFsaWRhdGVQYXRoKCcvbWlzLXR1cm5vcycpO1xuICAgICAgICByZXZhbGlkYXRlUGF0aCgnL2FkbWluL3R1cm5vcycpO1xuXG4gICAgICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcblxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0Vycm9yIGFsIGNhbmNlbGFyIGVsIHR1cm5vOicsIGVycm9yKTtcbiAgICAgICAgcmV0dXJuIHsgc3VjY2VzczogZmFsc2UsIGVycm9yOiAnT2N1cnJpw7MgdW4gZXJyb3IgaW5lc3BlcmFkbyBhbCBpbnRlbnRhciBjYW5jZWxhciBlbCB0dXJuby4nIH07XG4gICAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI4U0EyR3NCIn0=
}),
"[project]/src/app/components/AccionesTurnoUsuario.jsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AccionesTurnoUsuario
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fi/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$data$3a$026b1e__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/src/app/actions/data:026b1e [app-ssr] (ecmascript) <text/javascript>");
'use client';
;
;
;
;
function AccionesTurnoUsuario({ turno }) {
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [success, setSuccess] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
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
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$app$2f$actions$2f$data$3a$026b1e__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["cancelarTurnoUsuario"])(turno.id);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-shrink-0 self-center mt-4 sm:mt-0",
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-red-600 mb-2 text-center",
                children: error
            }, void 0, false, {
                fileName: "[project]/src/app/components/AccionesTurnoUsuario.jsx",
                lineNumber: 53,
                columnNumber: 23
            }, this),
            success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-green-600 mb-2 text-center",
                children: success
            }, void 0, false, {
                fileName: "[project]/src/app/components/AccionesTurnoUsuario.jsx",
                lineNumber: 54,
                columnNumber: 25
            }, this),
            !success && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: handleCancel,
                disabled: loading,
                className: "flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-full text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fi$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["FiTrash2"], {
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
}),
];

//# sourceMappingURL=src_app_3b61f6cf._.js.map