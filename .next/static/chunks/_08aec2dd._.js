(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/login/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LoginPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/AuthContext.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$google$2d$recaptcha$2d$v3$2f$dist$2f$react$2d$google$2d$recaptcha$2d$v3$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-google-recaptcha-v3/dist/react-google-recaptcha-v3.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// Iconos para el toggle de la contraseña
const EyeIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        className: "w-5 h-5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
            }, void 0, false, {
                fileName: "[project]/src/app/login/page.js",
                lineNumber: 11,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                strokeLinecap: "round",
                strokeLinejoin: "round",
                d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            }, void 0, false, {
                fileName: "[project]/src/app/login/page.js",
                lineNumber: 12,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/login/page.js",
        lineNumber: 10,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c = EyeIcon;
const EyeSlashIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        fill: "none",
        viewBox: "0 0 24 24",
        strokeWidth: 1.5,
        stroke: "currentColor",
        className: "w-5 h-5",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            d: "M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228"
        }, void 0, false, {
            fileName: "[project]/src/app/login/page.js",
            lineNumber: 18,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/login/page.js",
        lineNumber: 17,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
_c1 = EyeSlashIcon;
const LoginForm = ()=>{
    _s();
    const { currentUser, loginWithGoogle, loginWithEmail, registerWithEmailAndPassword, resetPassword } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const { executeRecaptcha } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$google$2d$recaptcha$2d$v3$2f$dist$2f$react$2d$google$2d$recaptcha$2d$v3$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGoogleReCaptcha"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isRegistering, setIsRegistering] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        nombre: '',
        apellido: '',
        dni: '',
        telefonoPrincipal: '',
        telefonoSecundario: '',
        direccion: '',
        barrio: '',
        nombreContactoEmergencia: '',
        telefonoContactoEmergencia: ''
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LoginForm.useEffect": ()=>{
            if (currentUser) {
                router.push('/');
            }
        }
    }["LoginForm.useEffect"], [
        currentUser,
        router
    ]);
    const handleLoginWithGoogle = async ()=>{
        try {
            await loginWithGoogle();
        } catch (error) {
            console.error('Failed to login with Google', error);
            setError('Fallo al iniciar sesión con Google');
        }
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError(null);
        if (!executeRecaptcha) {
            setError("La verificación ReCaptcha no está lista. Inténtalo de nuevo en unos segundos.");
            return;
        }
        const recaptchaToken = await executeRecaptcha('auth_action');
        // Aquí enviarías el token al backend para su validación, pero por ahora lo dejamos como prueba de concepto.
        console.log("reCAPTCHA token:", recaptchaToken);
        if (isRegistering) {
            // Lógica de Registro
            if (password !== confirmPassword) {
                setError("Las contraseñas no coinciden.");
                return;
            }
            if (password.length < 6) {
                setError("La contraseña debe tener al menos 6 caracteres.");
                return;
            }
            try {
                await registerWithEmailAndPassword(email, password, formData);
            } catch (error) {
                console.error('Failed to register', error);
                setError('No se pudo crear la cuenta. Es posible que el email ya esté en uso.');
            }
        } else {
            // Lógica de Login
            try {
                await loginWithEmail(email, password);
            } catch (error) {
                console.error('Failed to login', error);
                setError('Email o contraseña incorrectos.');
            }
        }
    };
    const handlePasswordReset = async ()=>{
        if (!email) {
            setError("Por favor, ingresa tu email para restablecer la contraseña.");
            return;
        }
        setError(null);
        try {
            await resetPassword(email);
            alert('Se ha enviado un correo para restablecer tu contraseña. Revisa tu bandeja de entrada.');
        } catch (error) {
            console.error('Failed to send password reset email', error);
            setError('No se pudo enviar el correo de restablecimiento.');
        }
    };
    const handleChange = (e)=>{
        const { name, value } = e.target;
        if ((name === 'dni' || name.includes('telefono')) && value && !/^[0-9]+$/.test(value)) {
            return;
        }
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
    };
    const FormInput = (param)=>{
        let { id, name, type, placeholder, value, onChange, required = false, pattern, maxLength, label, children } = param;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "mb-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                    className: "block text-gray-700 text-sm font-bold mb-2",
                    htmlFor: id,
                    children: label
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.js",
                    lineNumber: 127,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "relative",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            className: "shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10",
                            id: id,
                            name: name,
                            type: type,
                            placeholder: placeholder,
                            value: value,
                            onChange: onChange,
                            required: required,
                            pattern: pattern,
                            maxLength: maxLength
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.js",
                            lineNumber: 131,
                            columnNumber: 17
                        }, ("TURBOPACK compile-time value", void 0)),
                        children
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.js",
                    lineNumber: 130,
                    columnNumber: 13
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.js",
            lineNumber: 126,
            columnNumber: 9
        }, ("TURBOPACK compile-time value", void 0));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-4xl font-bold text-center mb-6 text-gray-800",
                    children: isRegistering ? 'Crear una Cuenta' : 'Iniciar Sesión'
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.js",
                    lineNumber: 151,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "bg-red-100 text-red-700 p-3 rounded-md mb-4 text-center",
                    children: error
                }, void 0, false, {
                    fileName: "[project]/src/app/login/page.js",
                    lineNumber: 153,
                    columnNumber: 27
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white shadow-xl rounded-2xl px-8 pt-6 pb-8 mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                    id: "email",
                                    name: "email",
                                    type: "email",
                                    label: "Email",
                                    placeholder: "tu@email.com",
                                    value: email,
                                    onChange: (e)=>setEmail(e.target.value),
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.js",
                                    lineNumber: 157,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                    id: "password",
                                    name: "password",
                                    type: showPassword ? 'text' : 'password',
                                    label: "Contraseña",
                                    placeholder: "••••••••••",
                                    value: password,
                                    onChange: (e)=>setPassword(e.target.value),
                                    required: true,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setShowPassword(!showPassword),
                                        className: "absolute inset-y-0 right-0 px-3 flex items-center text-gray-500",
                                        children: showPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EyeSlashIcon, {}, void 0, false, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 169,
                                            columnNumber: 49
                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EyeIcon, {}, void 0, false, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 169,
                                            columnNumber: 68
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/login/page.js",
                                        lineNumber: 168,
                                        columnNumber: 29
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.js",
                                    lineNumber: 158,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                isRegistering && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                    id: "confirmPassword",
                                    name: "confirmPassword",
                                    type: showPassword ? 'text' : 'password',
                                    label: "Confirmar Contraseña",
                                    placeholder: "••••••••••",
                                    value: confirmPassword,
                                    onChange: (e)=>setConfirmPassword(e.target.value),
                                    required: true
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.js",
                                    lineNumber: 174,
                                    columnNumber: 30
                                }, ("TURBOPACK compile-time value", void 0)),
                                isRegistering && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                            className: "my-6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 188,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                                    id: "nombre",
                                                    name: "nombre",
                                                    type: "text",
                                                    label: "Nombre",
                                                    placeholder: "Juan",
                                                    value: formData.nombre,
                                                    onChange: handleChange,
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.js",
                                                    lineNumber: 190,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                                    id: "apellido",
                                                    name: "apellido",
                                                    type: "text",
                                                    label: "Apellido",
                                                    placeholder: "Pérez",
                                                    value: formData.apellido,
                                                    onChange: handleChange,
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.js",
                                                    lineNumber: 191,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 189,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                            id: "dni",
                                            name: "dni",
                                            type: "tel",
                                            label: "DNI",
                                            placeholder: "Sin puntos ni espacios",
                                            value: formData.dni,
                                            onChange: handleChange,
                                            required: true,
                                            maxLength: "8"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 193,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                            id: "direccion",
                                            name: "direccion",
                                            type: "text",
                                            label: "Dirección",
                                            placeholder: "Av. Siempreviva 742",
                                            value: formData.direccion,
                                            onChange: handleChange,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 194,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                            id: "barrio",
                                            name: "barrio",
                                            type: "text",
                                            label: "Barrio",
                                            placeholder: "Springfield",
                                            value: formData.barrio,
                                            onChange: handleChange,
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 195,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                                    id: "telefonoPrincipal",
                                                    name: "telefonoPrincipal",
                                                    type: "tel",
                                                    label: "Teléfono Principal",
                                                    placeholder: "1122334455",
                                                    value: formData.telefonoPrincipal,
                                                    onChange: handleChange,
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.js",
                                                    lineNumber: 197,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                                    id: "telefonoSecundario",
                                                    name: "telefonoSecundario",
                                                    type: "tel",
                                                    label: "Teléfono Secundario",
                                                    placeholder: "(Opcional)",
                                                    value: formData.telefonoSecundario,
                                                    onChange: handleChange
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.js",
                                                    lineNumber: 198,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 196,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {
                                            className: "my-6"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 201,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-semibold text-gray-700 mb-4",
                                            children: "Contacto de Emergencia"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 202,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                                    id: "nombreContactoEmergencia",
                                                    name: "nombreContactoEmergencia",
                                                    type: "text",
                                                    label: "Nombre",
                                                    placeholder: "Jane Doe",
                                                    value: formData.nombreContactoEmergencia,
                                                    onChange: handleChange,
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.js",
                                                    lineNumber: 204,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FormInput, {
                                                    id: "telefonoContactoEmergencia",
                                                    name: "telefonoContactoEmergencia",
                                                    type: "tel",
                                                    label: "Teléfono",
                                                    placeholder: "1188776655",
                                                    value: formData.telefonoContactoEmergencia,
                                                    onChange: handleChange,
                                                    required: true
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/login/page.js",
                                                    lineNumber: 205,
                                                    columnNumber: 37
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 203,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mt-6 flex items-center justify-between",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-transform transform hover:scale-105",
                                            type: "submit",
                                            children: isRegistering ? 'Registrarme' : 'Entrar'
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 211,
                                            columnNumber: 29
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        !isRegistering && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            className: "inline-block align-baseline font-bold text-sm text-blue-600 hover:text-blue-800 cursor-pointer",
                                            onClick: handlePasswordReset,
                                            children: "¿Olvidaste tu contraseña?"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/login/page.js",
                                            lineNumber: 218,
                                            columnNumber: 33
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/login/page.js",
                                    lineNumber: 210,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.js",
                            lineNumber: 156,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mt-6",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setIsRegistering(!isRegistering);
                                    setError(null);
                                },
                                className: "font-bold text-sm text-gray-600 hover:text-gray-800",
                                children: isRegistering ? '¿Ya tienes una cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'
                            }, void 0, false, {
                                fileName: "[project]/src/app/login/page.js",
                                lineNumber: 229,
                                columnNumber: 25
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.js",
                            lineNumber: 228,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.js",
                    lineNumber: 155,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-500 text-sm mb-4",
                            children: "o"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.js",
                            lineNumber: 240,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleLoginWithGoogle,
                            className: "bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-lg shadow-sm transition-all",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                    src: "https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png",
                                    alt: "Google Logo",
                                    className: "h-5 w-auto inline-block mr-2 align-middle"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/login/page.js",
                                    lineNumber: 245,
                                    columnNumber: 25
                                }, ("TURBOPACK compile-time value", void 0)),
                                "Continuar con Google"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/login/page.js",
                            lineNumber: 241,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.js",
                    lineNumber: 239,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-center text-gray-500 text-xs mt-6",
                    children: [
                        "This site is protected by reCAPTCHA and the Google",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://policies.google.com/privacy",
                            className: "text-blue-600",
                            children: " Privacy Policy"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.js",
                            lineNumber: 252,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        " and",
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                            href: "https://policies.google.com/terms",
                            className: "text-blue-600",
                            children: " Terms of Service"
                        }, void 0, false, {
                            fileName: "[project]/src/app/login/page.js",
                            lineNumber: 253,
                            columnNumber: 21
                        }, ("TURBOPACK compile-time value", void 0)),
                        " apply."
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/login/page.js",
                    lineNumber: 250,
                    columnNumber: 17
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/src/app/login/page.js",
            lineNumber: 150,
            columnNumber: 13
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/app/login/page.js",
        lineNumber: 149,
        columnNumber: 9
    }, ("TURBOPACK compile-time value", void 0));
};
_s(LoginForm, "O96bE2JGtWd0uchyjrWEi1B3Z9k=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$AuthContext$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$google$2d$recaptcha$2d$v3$2f$dist$2f$react$2d$google$2d$recaptcha$2d$v3$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useGoogleReCaptcha"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c2 = LoginForm;
function LoginPage() {
    //Debes reemplazar "YOUR_SITE_KEY" con tu clave de sitio de reCAPTCHA
    const siteKey = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "YOUR_SITE_KEY";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$google$2d$recaptcha$2d$v3$2f$dist$2f$react$2d$google$2d$recaptcha$2d$v3$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["GoogleReCaptchaProvider"], {
        reCaptchaKey: siteKey,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginForm, {}, void 0, false, {
            fileName: "[project]/src/app/login/page.js",
            lineNumber: 267,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/app/login/page.js",
        lineNumber: 266,
        columnNumber: 9
    }, this);
}
_c3 = LoginPage;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "EyeIcon");
__turbopack_context__.k.register(_c1, "EyeSlashIcon");
__turbopack_context__.k.register(_c2, "LoginForm");
__turbopack_context__.k.register(_c3, "LoginPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/react-google-recaptcha-v3/dist/react-google-recaptcha-v3.esm.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GoogleReCaptcha",
    ()=>S,
    "GoogleReCaptchaConsumer",
    ()=>b,
    "GoogleReCaptchaContext",
    ()=>v,
    "GoogleReCaptchaProvider",
    ()=>h,
    "useGoogleReCaptcha",
    ()=>g,
    "withGoogleReCaptcha",
    ()=>ne
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var s = function() {
    return s = Object.assign || function(e) {
        for(var t, r = 1, o = arguments.length; r < o; r++)for(var n in t = arguments[r])Object.prototype.hasOwnProperty.call(t, n) && (e[n] = t[n]);
        return e;
    }, s.apply(this, arguments);
};
function u(e, t, r, o) {
    return new (r || (r = Promise))(function(n, a) {
        function c(e) {
            try {
                s(o.next(e));
            } catch (e) {
                a(e);
            }
        }
        function i(e) {
            try {
                s(o.throw(e));
            } catch (e) {
                a(e);
            }
        }
        function s(e) {
            var t;
            e.done ? n(e.value) : (t = e.value, t instanceof r ? t : new r(function(e) {
                e(t);
            })).then(c, i);
        }
        s((o = o.apply(e, t || [])).next());
    });
}
function l(e, t) {
    var r, o, n, a, c = {
        label: 0,
        sent: function() {
            if (1 & n[0]) throw n[1];
            return n[1];
        },
        trys: [],
        ops: []
    };
    return a = {
        next: i(0),
        throw: i(1),
        return: i(2)
    }, "function" == typeof Symbol && (a[Symbol.iterator] = function() {
        return this;
    }), a;
    //TURBOPACK unreachable
    ;
    function i(a) {
        return function(i) {
            return function(a) {
                if (r) throw new TypeError("Generator is already executing.");
                for(; c;)try {
                    if (r = 1, o && (n = 2 & a[0] ? o.return : a[0] ? o.throw || ((n = o.return) && n.call(o), 0) : o.next) && !(n = n.call(o, a[1])).done) return n;
                    switch(o = 0, n && (a = [
                        2 & a[0],
                        n.value
                    ]), a[0]){
                        case 0:
                        case 1:
                            n = a;
                            break;
                        case 4:
                            return c.label++, {
                                value: a[1],
                                done: !1
                            };
                        case 5:
                            c.label++, o = a[1], a = [
                                0
                            ];
                            continue;
                        case 7:
                            a = c.ops.pop(), c.trys.pop();
                            continue;
                        default:
                            if (!(n = c.trys, (n = n.length > 0 && n[n.length - 1]) || 6 !== a[0] && 2 !== a[0])) {
                                c = 0;
                                continue;
                            }
                            if (3 === a[0] && (!n || a[1] > n[0] && a[1] < n[3])) {
                                c.label = a[1];
                                break;
                            }
                            if (6 === a[0] && c.label < n[1]) {
                                c.label = n[1], n = a;
                                break;
                            }
                            if (n && c.label < n[2]) {
                                c.label = n[2], c.ops.push(a);
                                break;
                            }
                            n[2] && c.ops.pop(), c.trys.pop();
                            continue;
                    }
                    a = t.call(e, c);
                } catch (e) {
                    a = [
                        6,
                        e
                    ], o = 0;
                } finally{
                    r = n = 0;
                }
                if (5 & a[0]) throw a[1];
                return {
                    value: a[0] ? a[1] : void 0,
                    done: !0
                };
            }([
                a,
                i
            ]);
        };
    }
}
var f, p = function(e) {
    var t;
    e ? function(e) {
        if (e) for(; e.lastChild;)e.lastChild.remove();
    }("string" == typeof e ? document.getElementById(e) : e) : (t = document.querySelector(".grecaptcha-badge")) && t.parentNode && document.body.removeChild(t.parentNode);
}, d = function(e, t) {
    p(t), window.___grecaptcha_cfg = void 0;
    var r = document.querySelector("#" + e);
    r && r.remove(), function() {
        var e = document.querySelector('script[src^="https://www.gstatic.com/recaptcha/releases"]');
        e && e.remove();
    }();
}, y = function(e) {
    var t = e.render, r = e.onLoadCallbackName, o = e.language, n = e.onLoad, a = e.useRecaptchaNet, c = e.useEnterprise, i = e.scriptProps, s = void 0 === i ? {} : i, u = s.nonce, l = void 0 === u ? "" : u, f = s.defer, p = void 0 !== f && f, d = s.async, y = void 0 !== d && d, m = s.id, v = void 0 === m ? "" : m, b = s.appendTo, h = v || "google-recaptcha-v3";
    if (function(e) {
        return !!document.querySelector("#" + e);
    }(h)) n();
    else {
        var g = function(e) {
            return "https://www." + (e.useRecaptchaNet ? "recaptcha.net" : "google.com") + "/recaptcha/" + (e.useEnterprise ? "enterprise.js" : "api.js");
        }({
            useEnterprise: c,
            useRecaptchaNet: a
        }), S = document.createElement("script");
        S.id = h, S.src = g + "?render=" + t + ("explicit" === t ? "&onload=" + r : "") + (o ? "&hl=" + o : ""), l && (S.nonce = l), S.defer = !!p, S.async = !!y, S.onload = n, ("body" === b ? document.body : document.getElementsByTagName("head")[0]).appendChild(S);
    }
}, m = function(e) {
    "undefined" != typeof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] && !!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env && "production" !== ("TURBOPACK compile-time value", "development") || console.warn(e);
};
!function(e) {
    e.SCRIPT_NOT_AVAILABLE = "Recaptcha script is not available";
}(f || (f = {}));
var v = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])({
    executeRecaptcha: function() {
        throw Error("GoogleReCaptcha Context has not yet been implemented, if you are using useGoogleReCaptcha hook, make sure the hook is called inside component wrapped by GoogleRecaptchaProvider");
    }
}), b = v.Consumer;
function h(t) {
    var i = t.reCaptchaKey, u = t.useEnterprise, l = void 0 !== u && u, p = t.useRecaptchaNet, b = void 0 !== p && p, h = t.scriptProps, g = t.language, S = t.container, w = t.children, $ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null), C = $[0], P = $[1], x = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(i), E = JSON.stringify(h), R = JSON.stringify(null == S ? void 0 : S.parameters);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(function() {
        if (i) {
            var e = (null == h ? void 0 : h.id) || "google-recaptcha-v3", t = (null == h ? void 0 : h.onLoadCallbackName) || "onRecaptchaLoadCallback";
            window[t] = function() {
                var e = l ? window.grecaptcha.enterprise : window.grecaptcha, t = s({
                    badge: "inline",
                    size: "invisible",
                    sitekey: i
                }, (null == S ? void 0 : S.parameters) || {});
                x.current = e.render(null == S ? void 0 : S.element, t);
            };
            return y({
                render: (null == S ? void 0 : S.element) ? "explicit" : i,
                onLoadCallbackName: t,
                useEnterprise: l,
                useRecaptchaNet: b,
                scriptProps: h,
                language: g,
                onLoad: function() {
                    if (window && window.grecaptcha) {
                        var e = l ? window.grecaptcha.enterprise : window.grecaptcha;
                        e.ready(function() {
                            P(e);
                        });
                    } else m("<GoogleRecaptchaProvider /> " + f.SCRIPT_NOT_AVAILABLE);
                },
                onError: function() {
                    m("Error loading google recaptcha script");
                }
            }), function() {
                d(e, null == S ? void 0 : S.element);
            };
        }
        m("<GoogleReCaptchaProvider /> recaptcha key not provided");
    }, [
        l,
        b,
        E,
        R,
        g,
        i,
        null == S ? void 0 : S.element
    ]);
    var M = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])(function(e) {
        if (!C || !C.execute) throw new Error("<GoogleReCaptchaProvider /> Google Recaptcha has not been loaded");
        return C.execute(x.current, {
            action: e
        });
    }, [
        C,
        x
    ]), N = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])(function() {
        return {
            executeRecaptcha: C ? M : void 0,
            container: null == S ? void 0 : S.element
        };
    }, [
        M,
        C,
        null == S ? void 0 : S.element
    ]);
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(v.Provider, {
        value: N
    }, w);
}
var g = function() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(v);
};
function S(t) {
    var r = this, o = t.action, a = t.onVerify, c = t.refreshReCaptcha, i = g();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])(function() {
        var e = i.executeRecaptcha;
        if (e) {
            u(r, void 0, void 0, function() {
                var t;
                return l(this, function(r) {
                    switch(r.label){
                        case 0:
                            return [
                                4,
                                e(o)
                            ];
                        case 1:
                            return t = r.sent(), a ? (a(t), [
                                2
                            ]) : (m("Please define an onVerify function"), [
                                2
                            ]);
                    }
                });
            });
        }
    }, [
        o,
        a,
        c,
        i
    ]);
    var s = i.container;
    return "string" == typeof s ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement("div", {
        id: s
    }) : null;
}
function w(e, t) {
    return e(t = {
        exports: {}
    }, t.exports), t.exports;
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ }
var $ = "function" == typeof Symbol && Symbol.for, C = $ ? Symbol.for("react.element") : 60103, P = $ ? Symbol.for("react.portal") : 60106, x = $ ? Symbol.for("react.fragment") : 60107, E = $ ? Symbol.for("react.strict_mode") : 60108, R = $ ? Symbol.for("react.profiler") : 60114, M = $ ? Symbol.for("react.provider") : 60109, N = $ ? Symbol.for("react.context") : 60110, O = $ ? Symbol.for("react.async_mode") : 60111, _ = $ ? Symbol.for("react.concurrent_mode") : 60111, T = $ ? Symbol.for("react.forward_ref") : 60112, j = $ ? Symbol.for("react.suspense") : 60113, L = $ ? Symbol.for("react.suspense_list") : 60120, k = $ ? Symbol.for("react.memo") : 60115, F = $ ? Symbol.for("react.lazy") : 60116, A = $ ? Symbol.for("react.block") : 60121, V = $ ? Symbol.for("react.fundamental") : 60117, z = $ ? Symbol.for("react.responder") : 60118, G = $ ? Symbol.for("react.scope") : 60119;
function I(e) {
    if ("object" == typeof e && null !== e) {
        var t = e.$$typeof;
        switch(t){
            case C:
                switch(e = e.type){
                    case O:
                    case _:
                    case x:
                    case R:
                    case E:
                    case j:
                        return e;
                    default:
                        switch(e = e && e.$$typeof){
                            case N:
                            case T:
                            case F:
                            case k:
                            case M:
                                return e;
                            default:
                                return t;
                        }
                }
            case P:
                return t;
        }
    }
}
function D(e) {
    return I(e) === _;
}
var q = {
    AsyncMode: O,
    ConcurrentMode: _,
    ContextConsumer: N,
    ContextProvider: M,
    Element: C,
    ForwardRef: T,
    Fragment: x,
    Lazy: F,
    Memo: k,
    Portal: P,
    Profiler: R,
    StrictMode: E,
    Suspense: j,
    isAsyncMode: function(e) {
        return D(e) || I(e) === O;
    },
    isConcurrentMode: D,
    isContextConsumer: function(e) {
        return I(e) === N;
    },
    isContextProvider: function(e) {
        return I(e) === M;
    },
    isElement: function(e) {
        return "object" == typeof e && null !== e && e.$$typeof === C;
    },
    isForwardRef: function(e) {
        return I(e) === T;
    },
    isFragment: function(e) {
        return I(e) === x;
    },
    isLazy: function(e) {
        return I(e) === F;
    },
    isMemo: function(e) {
        return I(e) === k;
    },
    isPortal: function(e) {
        return I(e) === P;
    },
    isProfiler: function(e) {
        return I(e) === R;
    },
    isStrictMode: function(e) {
        return I(e) === E;
    },
    isSuspense: function(e) {
        return I(e) === j;
    },
    isValidElementType: function(e) {
        return "string" == typeof e || "function" == typeof e || e === x || e === _ || e === R || e === E || e === j || e === L || "object" == typeof e && null !== e && (e.$$typeof === F || e.$$typeof === k || e.$$typeof === M || e.$$typeof === N || e.$$typeof === T || e.$$typeof === V || e.$$typeof === z || e.$$typeof === G || e.$$typeof === A);
    },
    typeOf: I
}, B = w(function(e, t) {
    "production" !== ("TURBOPACK compile-time value", "development") && function() {
        var e = "function" == typeof Symbol && Symbol.for, r = e ? Symbol.for("react.element") : 60103, o = e ? Symbol.for("react.portal") : 60106, n = e ? Symbol.for("react.fragment") : 60107, a = e ? Symbol.for("react.strict_mode") : 60108, c = e ? Symbol.for("react.profiler") : 60114, i = e ? Symbol.for("react.provider") : 60109, s = e ? Symbol.for("react.context") : 60110, u = e ? Symbol.for("react.async_mode") : 60111, l = e ? Symbol.for("react.concurrent_mode") : 60111, f = e ? Symbol.for("react.forward_ref") : 60112, p = e ? Symbol.for("react.suspense") : 60113, d = e ? Symbol.for("react.suspense_list") : 60120, y = e ? Symbol.for("react.memo") : 60115, m = e ? Symbol.for("react.lazy") : 60116, v = e ? Symbol.for("react.block") : 60121, b = e ? Symbol.for("react.fundamental") : 60117, h = e ? Symbol.for("react.responder") : 60118, g = e ? Symbol.for("react.scope") : 60119;
        function S(e) {
            if ("object" == typeof e && null !== e) {
                var t = e.$$typeof;
                switch(t){
                    case r:
                        var d = e.type;
                        switch(d){
                            case u:
                            case l:
                            case n:
                            case c:
                            case a:
                            case p:
                                return d;
                            default:
                                var v = d && d.$$typeof;
                                switch(v){
                                    case s:
                                    case f:
                                    case m:
                                    case y:
                                    case i:
                                        return v;
                                    default:
                                        return t;
                                }
                        }
                    case o:
                        return t;
                }
            }
        }
        var w = u, $ = l, C = s, P = i, x = r, E = f, R = n, M = m, N = y, O = o, _ = c, T = a, j = p, L = !1;
        function k(e) {
            return S(e) === l;
        }
        t.AsyncMode = w, t.ConcurrentMode = $, t.ContextConsumer = C, t.ContextProvider = P, t.Element = x, t.ForwardRef = E, t.Fragment = R, t.Lazy = M, t.Memo = N, t.Portal = O, t.Profiler = _, t.StrictMode = T, t.Suspense = j, t.isAsyncMode = function(e) {
            return L || (L = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), k(e) || S(e) === u;
        }, t.isConcurrentMode = k, t.isContextConsumer = function(e) {
            return S(e) === s;
        }, t.isContextProvider = function(e) {
            return S(e) === i;
        }, t.isElement = function(e) {
            return "object" == typeof e && null !== e && e.$$typeof === r;
        }, t.isForwardRef = function(e) {
            return S(e) === f;
        }, t.isFragment = function(e) {
            return S(e) === n;
        }, t.isLazy = function(e) {
            return S(e) === m;
        }, t.isMemo = function(e) {
            return S(e) === y;
        }, t.isPortal = function(e) {
            return S(e) === o;
        }, t.isProfiler = function(e) {
            return S(e) === c;
        }, t.isStrictMode = function(e) {
            return S(e) === a;
        }, t.isSuspense = function(e) {
            return S(e) === p;
        }, t.isValidElementType = function(e) {
            return "string" == typeof e || "function" == typeof e || e === n || e === l || e === c || e === a || e === p || e === d || "object" == typeof e && null !== e && (e.$$typeof === m || e.$$typeof === y || e.$$typeof === i || e.$$typeof === s || e.$$typeof === f || e.$$typeof === b || e.$$typeof === h || e.$$typeof === g || e.$$typeof === v);
        }, t.typeOf = S;
    }();
}), J = (B.AsyncMode, B.ConcurrentMode, B.ContextConsumer, B.ContextProvider, B.Element, B.ForwardRef, B.Fragment, B.Lazy, B.Memo, B.Portal, B.Profiler, B.StrictMode, B.Suspense, B.isAsyncMode, B.isConcurrentMode, B.isContextConsumer, B.isContextProvider, B.isElement, B.isForwardRef, B.isFragment, B.isLazy, B.isMemo, B.isPortal, B.isProfiler, B.isStrictMode, B.isSuspense, B.isValidElementType, B.typeOf, w(function(e) {
    ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : e.exports = B;
})), K = {
    childContextTypes: !0,
    contextType: !0,
    contextTypes: !0,
    defaultProps: !0,
    displayName: !0,
    getDefaultProps: !0,
    getDerivedStateFromError: !0,
    getDerivedStateFromProps: !0,
    mixins: !0,
    propTypes: !0,
    type: !0
}, U = {
    name: !0,
    length: !0,
    prototype: !0,
    caller: !0,
    callee: !0,
    arguments: !0,
    arity: !0
}, H = {
    $$typeof: !0,
    compare: !0,
    defaultProps: !0,
    displayName: !0,
    propTypes: !0,
    type: !0
}, Q = {};
function W(e) {
    return J.isMemo(e) ? H : Q[e.$$typeof] || K;
}
Q[J.ForwardRef] = {
    $$typeof: !0,
    render: !0,
    defaultProps: !0,
    displayName: !0,
    propTypes: !0
}, Q[J.Memo] = H;
var X = Object.defineProperty, Y = Object.getOwnPropertyNames, Z = Object.getOwnPropertySymbols, ee = Object.getOwnPropertyDescriptor, te = Object.getPrototypeOf, re = Object.prototype;
var oe = function e(t, r, o) {
    if ("string" != typeof r) {
        if (re) {
            var n = te(r);
            n && n !== re && e(t, n, o);
        }
        var a = Y(r);
        Z && (a = a.concat(Z(r)));
        for(var c = W(t), i = W(r), s = 0; s < a.length; ++s){
            var u = a[s];
            if (!(U[u] || o && o[u] || i && i[u] || c && c[u])) {
                var l = ee(r, u);
                try {
                    X(t, u, l);
                } catch (e) {}
            }
        }
    }
    return t;
}, ne = function(t) {
    var r = function(r) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(b, null, function(o) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].createElement(t, s({}, r, {
                googleReCaptchaProps: o
            }));
        });
    };
    return r.displayName = "withGoogleReCaptcha(" + (t.displayName || t.name || "Component") + ")", oe(r, t), r;
};
;
 //# sourceMappingURL=react-google-recaptcha-v3.esm.js.map
}),
]);

//# sourceMappingURL=_08aec2dd._.js.map