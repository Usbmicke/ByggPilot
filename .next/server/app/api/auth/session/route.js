"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/auth/session/route";
exports.ids = ["app/api/auth/session/route"];
exports.modules = {

/***/ "firebase-admin":
/*!*********************************!*\
  !*** external "firebase-admin" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("firebase-admin");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=%2Fworkspaces%2FByggPilot%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2FByggPilot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=%2Fworkspaces%2FByggPilot%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2FByggPilot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _workspaces_ByggPilot_src_app_api_auth_session_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/session/route.ts */ \"(rsc)/./src/app/api/auth/session/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/session/route\",\n        pathname: \"/api/auth/session\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/session/route\"\n    },\n    resolvedPagePath: \"/workspaces/ByggPilot/src/app/api/auth/session/route.ts\",\n    nextConfigOutput,\n    userland: _workspaces_ByggPilot_src_app_api_auth_session_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/session/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGc2Vzc2lvbiUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGYXV0aCUyRnNlc3Npb24lMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZhdXRoJTJGc2Vzc2lvbiUyRnJvdXRlLnRzJmFwcERpcj0lMkZ3b3Jrc3BhY2VzJTJGQnlnZ1BpbG90JTJGc3JjJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZ3b3Jrc3BhY2VzJTJGQnlnZ1BpbG90JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PXN0YW5kYWxvbmUmcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDTztBQUNwRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL2J5Z2dwaWxvdC1uZXh0Lz9lNmM3Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi93b3Jrc3BhY2VzL0J5Z2dQaWxvdC9zcmMvYXBwL2FwaS9hdXRoL3Nlc3Npb24vcm91dGUudHNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwic3RhbmRhbG9uZVwiXG5jb25zdCByb3V0ZU1vZHVsZSA9IG5ldyBBcHBSb3V0ZVJvdXRlTW9kdWxlKHtcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICAgIGtpbmQ6IFJvdXRlS2luZC5BUFBfUk9VVEUsXG4gICAgICAgIHBhZ2U6IFwiL2FwaS9hdXRoL3Nlc3Npb24vcm91dGVcIixcbiAgICAgICAgcGF0aG5hbWU6IFwiL2FwaS9hdXRoL3Nlc3Npb25cIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvc2Vzc2lvbi9yb3V0ZVwiXG4gICAgfSxcbiAgICByZXNvbHZlZFBhZ2VQYXRoOiBcIi93b3Jrc3BhY2VzL0J5Z2dQaWxvdC9zcmMvYXBwL2FwaS9hdXRoL3Nlc3Npb24vcm91dGUudHNcIixcbiAgICBuZXh0Q29uZmlnT3V0cHV0LFxuICAgIHVzZXJsYW5kXG59KTtcbi8vIFB1bGwgb3V0IHRoZSBleHBvcnRzIHRoYXQgd2UgbmVlZCB0byBleHBvc2UgZnJvbSB0aGUgbW9kdWxlLiBUaGlzIHNob3VsZFxuLy8gYmUgZWxpbWluYXRlZCB3aGVuIHdlJ3ZlIG1vdmVkIHRoZSBvdGhlciByb3V0ZXMgdG8gdGhlIG5ldyBmb3JtYXQuIFRoZXNlXG4vLyBhcmUgdXNlZCB0byBob29rIGludG8gdGhlIHJvdXRlLlxuY29uc3QgeyByZXF1ZXN0QXN5bmNTdG9yYWdlLCBzdGF0aWNHZW5lcmF0aW9uQXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5jb25zdCBvcmlnaW5hbFBhdGhuYW1lID0gXCIvYXBpL2F1dGgvc2Vzc2lvbi9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=%2Fworkspaces%2FByggPilot%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2FByggPilot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/session/route.ts":
/*!*******************************************!*\
  !*** ./src/app/api/auth/session/route.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   POST: () => (/* binding */ POST)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n// src/app/api/auth/session/route.ts\n\n\n\n// --- Firebase Admin Init ---\ntry {\n    if (!(firebase_admin__WEBPACK_IMPORTED_MODULE_1___default().apps).length) {\n        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON);\n        firebase_admin__WEBPACK_IMPORTED_MODULE_1___default().initializeApp({\n            credential: firebase_admin__WEBPACK_IMPORTED_MODULE_1___default().credential.cert(serviceAccount)\n        });\n    }\n} catch (error) {\n    console.error(\"Firebase Admin initialization error:\", error);\n}\nasync function POST(req) {\n    try {\n        const body = await req.json();\n        const idToken = body.idToken;\n        if (!idToken) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"ID token not found.\"\n            }, {\n                status: 400\n            });\n        }\n        // Skapa session cookie\n        const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 dagar i millisekunder\n        const sessionCookie = await firebase_admin__WEBPACK_IMPORTED_MODULE_1___default().auth().createSessionCookie(idToken, {\n            expiresIn\n        });\n        // Sätt cookien i headern\n        (0,next_headers__WEBPACK_IMPORTED_MODULE_2__.cookies)().set(\"__session\", sessionCookie, {\n            httpOnly: true,\n            secure: \"development\" === \"production\",\n            maxAge: expiresIn,\n            path: \"/\"\n        });\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            status: \"success\"\n        });\n    } catch (error) {\n        console.error(\"Session login error:\", error);\n        const errorMessage = error instanceof Error ? error.message : \"An unknown error occurred\";\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Failed to create session\",\n            details: errorMessage\n        }, {\n            status: 401\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL3Nlc3Npb24vcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxvQ0FBb0M7QUFDTztBQUNSO0FBQ0k7QUFFdkMsOEJBQThCO0FBQzlCLElBQUk7SUFDRixJQUFJLENBQUNDLDREQUFVLENBQUNHLE1BQU0sRUFBRTtRQUN0QixNQUFNQyxpQkFBaUJDLEtBQUtDLEtBQUssQ0FDL0JDLFFBQVFDLEdBQUcsQ0FBQ0MsaUNBQWlDO1FBRS9DVCxtRUFBbUIsQ0FBQztZQUNsQlcsWUFBWVgsZ0VBQWdCLENBQUNZLElBQUksQ0FBQ1I7UUFDcEM7SUFDRjtBQUNGLEVBQUUsT0FBT1MsT0FBTztJQUNkQyxRQUFRRCxLQUFLLENBQUMsd0NBQXdDQTtBQUN4RDtBQUVPLGVBQWVFLEtBQUtDLEdBQVk7SUFDckMsSUFBSTtRQUNGLE1BQU1DLE9BQU8sTUFBTUQsSUFBSUUsSUFBSTtRQUMzQixNQUFNQyxVQUFVRixLQUFLRSxPQUFPO1FBRTVCLElBQUksQ0FBQ0EsU0FBUztZQUNaLE9BQU9wQixxREFBWUEsQ0FBQ21CLElBQUksQ0FBQztnQkFBRUwsT0FBTztZQUFzQixHQUFHO2dCQUFFTyxRQUFRO1lBQUk7UUFDM0U7UUFFQSx1QkFBdUI7UUFDdkIsTUFBTUMsWUFBWSxLQUFLLEtBQUssS0FBSyxJQUFJLE1BQU0sMEJBQTBCO1FBQ3JFLE1BQU1DLGdCQUFnQixNQUFNdEIsMERBQVUsR0FBR3dCLG1CQUFtQixDQUFDTCxTQUFTO1lBQUVFO1FBQVU7UUFFbEYseUJBQXlCO1FBQ3pCcEIscURBQU9BLEdBQUd3QixHQUFHLENBQUMsYUFBYUgsZUFBZTtZQUN4Q0ksVUFBVTtZQUNWQyxRQUFRcEIsa0JBQXlCO1lBQ2pDcUIsUUFBUVA7WUFDUlEsTUFBTTtRQUNSO1FBRUEsT0FBTzlCLHFEQUFZQSxDQUFDbUIsSUFBSSxDQUFDO1lBQUVFLFFBQVE7UUFBVTtJQUUvQyxFQUFFLE9BQU9QLE9BQU87UUFDZEMsUUFBUUQsS0FBSyxDQUFDLHdCQUF3QkE7UUFDdEMsTUFBTWlCLGVBQWVqQixpQkFBaUJrQixRQUFRbEIsTUFBTW1CLE9BQU8sR0FBRztRQUM5RCxPQUFPakMscURBQVlBLENBQUNtQixJQUFJLENBQUM7WUFBRUwsT0FBTztZQUE0Qm9CLFNBQVNIO1FBQWEsR0FBRztZQUFFVixRQUFRO1FBQUk7SUFDdkc7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2J5Z2dwaWxvdC1uZXh0Ly4vc3JjL2FwcC9hcGkvYXV0aC9zZXNzaW9uL3JvdXRlLnRzP2MyYjYiXSwic291cmNlc0NvbnRlbnQiOlsiLy8gc3JjL2FwcC9hcGkvYXV0aC9zZXNzaW9uL3JvdXRlLnRzXG5pbXBvcnQgeyBOZXh0UmVzcG9uc2UgfSBmcm9tICduZXh0L3NlcnZlcic7XG5pbXBvcnQgYWRtaW4gZnJvbSAnZmlyZWJhc2UtYWRtaW4nO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycyc7XG5cbi8vIC0tLSBGaXJlYmFzZSBBZG1pbiBJbml0IC0tLVxudHJ5IHtcbiAgaWYgKCFhZG1pbi5hcHBzLmxlbmd0aCkge1xuICAgIGNvbnN0IHNlcnZpY2VBY2NvdW50ID0gSlNPTi5wYXJzZShcbiAgICAgIHByb2Nlc3MuZW52LkZJUkVCQVNFX1NFUlZJQ0VfQUNDT1VOVF9LRVlfSlNPTiBhcyBzdHJpbmdcbiAgICApO1xuICAgIGFkbWluLmluaXRpYWxpemVBcHAoe1xuICAgICAgY3JlZGVudGlhbDogYWRtaW4uY3JlZGVudGlhbC5jZXJ0KHNlcnZpY2VBY2NvdW50KSxcbiAgICB9KTtcbiAgfVxufSBjYXRjaCAoZXJyb3IpIHtcbiAgY29uc29sZS5lcnJvcignRmlyZWJhc2UgQWRtaW4gaW5pdGlhbGl6YXRpb24gZXJyb3I6JywgZXJyb3IpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gUE9TVChyZXE6IFJlcXVlc3QpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBib2R5ID0gYXdhaXQgcmVxLmpzb24oKTtcbiAgICBjb25zdCBpZFRva2VuID0gYm9keS5pZFRva2VuO1xuXG4gICAgaWYgKCFpZFRva2VuKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ0lEIHRva2VuIG5vdCBmb3VuZC4nIH0sIHsgc3RhdHVzOiA0MDAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2thcGEgc2Vzc2lvbiBjb29raWVcbiAgICBjb25zdCBleHBpcmVzSW4gPSA2MCAqIDYwICogMjQgKiA1ICogMTAwMDsgLy8gNSBkYWdhciBpIG1pbGxpc2VrdW5kZXJcbiAgICBjb25zdCBzZXNzaW9uQ29va2llID0gYXdhaXQgYWRtaW4uYXV0aCgpLmNyZWF0ZVNlc3Npb25Db29raWUoaWRUb2tlbiwgeyBleHBpcmVzSW4gfSk7XG5cbiAgICAvLyBTw6R0dCBjb29raWVuIGkgaGVhZGVyblxuICAgIGNvb2tpZXMoKS5zZXQoJ19fc2Vzc2lvbicsIHNlc3Npb25Db29raWUsIHtcbiAgICAgIGh0dHBPbmx5OiB0cnVlLFxuICAgICAgc2VjdXJlOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nLFxuICAgICAgbWF4QWdlOiBleHBpcmVzSW4sXG4gICAgICBwYXRoOiAnLycsXG4gICAgfSk7XG5cbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBzdGF0dXM6ICdzdWNjZXNzJyB9KTtcblxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1Nlc3Npb24gbG9naW4gZXJyb3I6JywgZXJyb3IpO1xuICAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IGVycm9yIGluc3RhbmNlb2YgRXJyb3IgPyBlcnJvci5tZXNzYWdlIDogJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnO1xuICAgIHJldHVybiBOZXh0UmVzcG9uc2UuanNvbih7IGVycm9yOiAnRmFpbGVkIHRvIGNyZWF0ZSBzZXNzaW9uJywgZGV0YWlsczogZXJyb3JNZXNzYWdlIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJhZG1pbiIsImNvb2tpZXMiLCJhcHBzIiwibGVuZ3RoIiwic2VydmljZUFjY291bnQiLCJKU09OIiwicGFyc2UiLCJwcm9jZXNzIiwiZW52IiwiRklSRUJBU0VfU0VSVklDRV9BQ0NPVU5UX0tFWV9KU09OIiwiaW5pdGlhbGl6ZUFwcCIsImNyZWRlbnRpYWwiLCJjZXJ0IiwiZXJyb3IiLCJjb25zb2xlIiwiUE9TVCIsInJlcSIsImJvZHkiLCJqc29uIiwiaWRUb2tlbiIsInN0YXR1cyIsImV4cGlyZXNJbiIsInNlc3Npb25Db29raWUiLCJhdXRoIiwiY3JlYXRlU2Vzc2lvbkNvb2tpZSIsInNldCIsImh0dHBPbmx5Iiwic2VjdXJlIiwibWF4QWdlIiwicGF0aCIsImVycm9yTWVzc2FnZSIsIkVycm9yIiwibWVzc2FnZSIsImRldGFpbHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/session/route.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@opentelemetry"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fsession%2Froute&page=%2Fapi%2Fauth%2Fsession%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fsession%2Froute.ts&appDir=%2Fworkspaces%2FByggPilot%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2FByggPilot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();