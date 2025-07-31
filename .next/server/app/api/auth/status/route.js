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
exports.id = "app/api/auth/status/route";
exports.ids = ["app/api/auth/status/route"];
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

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fstatus%2Froute&page=%2Fapi%2Fauth%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fstatus%2Froute.ts&appDir=%2Fworkspaces%2FByggPilot%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2FByggPilot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fstatus%2Froute&page=%2Fapi%2Fauth%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fstatus%2Froute.ts&appDir=%2Fworkspaces%2FByggPilot%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2FByggPilot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _workspaces_ByggPilot_src_app_api_auth_status_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./src/app/api/auth/status/route.ts */ \"(rsc)/./src/app/api/auth/status/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/auth/status/route\",\n        pathname: \"/api/auth/status\",\n        filename: \"route\",\n        bundlePath: \"app/api/auth/status/route\"\n    },\n    resolvedPagePath: \"/workspaces/ByggPilot/src/app/api/auth/status/route.ts\",\n    nextConfigOutput,\n    userland: _workspaces_ByggPilot_src_app_api_auth_status_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/auth/status/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhdXRoJTJGc3RhdHVzJTJGcm91dGUmcGFnZT0lMkZhcGklMkZhdXRoJTJGc3RhdHVzJTJGcm91dGUmYXBwUGF0aHM9JnBhZ2VQYXRoPXByaXZhdGUtbmV4dC1hcHAtZGlyJTJGYXBpJTJGYXV0aCUyRnN0YXR1cyUyRnJvdXRlLnRzJmFwcERpcj0lMkZ3b3Jrc3BhY2VzJTJGQnlnZ1BpbG90JTJGc3JjJTJGYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj0lMkZ3b3Jrc3BhY2VzJTJGQnlnZ1BpbG90JmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PXN0YW5kYWxvbmUmcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDTTtBQUNuRjtBQUNBO0FBQ0E7QUFDQSx3QkFBd0IsZ0hBQW1CO0FBQzNDO0FBQ0EsY0FBYyx5RUFBUztBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsWUFBWTtBQUNaLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQSxRQUFRLGlFQUFpRTtBQUN6RTtBQUNBO0FBQ0EsV0FBVyw0RUFBVztBQUN0QjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ3VIOztBQUV2SCIsInNvdXJjZXMiOlsid2VicGFjazovL2J5Z2dwaWxvdC1uZXh0Lz80MDE4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi93b3Jrc3BhY2VzL0J5Z2dQaWxvdC9zcmMvYXBwL2FwaS9hdXRoL3N0YXR1cy9yb3V0ZS50c1wiO1xuLy8gV2UgaW5qZWN0IHRoZSBuZXh0Q29uZmlnT3V0cHV0IGhlcmUgc28gdGhhdCB3ZSBjYW4gdXNlIHRoZW0gaW4gdGhlIHJvdXRlXG4vLyBtb2R1bGUuXG5jb25zdCBuZXh0Q29uZmlnT3V0cHV0ID0gXCJzdGFuZGFsb25lXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL2F1dGgvc3RhdHVzL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvYXV0aC9zdGF0dXNcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2F1dGgvc3RhdHVzL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL3dvcmtzcGFjZXMvQnlnZ1BpbG90L3NyYy9hcHAvYXBpL2F1dGgvc3RhdHVzL3JvdXRlLnRzXCIsXG4gICAgbmV4dENvbmZpZ091dHB1dCxcbiAgICB1c2VybGFuZFxufSk7XG4vLyBQdWxsIG91dCB0aGUgZXhwb3J0cyB0aGF0IHdlIG5lZWQgdG8gZXhwb3NlIGZyb20gdGhlIG1vZHVsZS4gVGhpcyBzaG91bGRcbi8vIGJlIGVsaW1pbmF0ZWQgd2hlbiB3ZSd2ZSBtb3ZlZCB0aGUgb3RoZXIgcm91dGVzIHRvIHRoZSBuZXcgZm9ybWF0LiBUaGVzZVxuLy8gYXJlIHVzZWQgdG8gaG9vayBpbnRvIHRoZSByb3V0ZS5cbmNvbnN0IHsgcmVxdWVzdEFzeW5jU3RvcmFnZSwgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZSwgc2VydmVySG9va3MgfSA9IHJvdXRlTW9kdWxlO1xuY29uc3Qgb3JpZ2luYWxQYXRobmFtZSA9IFwiL2FwaS9hdXRoL3N0YXR1cy9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fstatus%2Froute&page=%2Fapi%2Fauth%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fstatus%2Froute.ts&appDir=%2Fworkspaces%2FByggPilot%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2FByggPilot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./src/app/api/auth/status/route.ts":
/*!******************************************!*\
  !*** ./src/app/api/auth/status/route.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var next_headers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/headers */ \"(rsc)/./node_modules/next/dist/api/headers.js\");\n/* harmony import */ var _lib_firebaseAdmin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @/lib/firebaseAdmin */ \"(rsc)/./src/lib/firebaseAdmin.ts\");\n// src/app/api/auth/status/route.ts\n\n\n\nasync function GET() {\n    try {\n        const sessionCookie = (0,next_headers__WEBPACK_IMPORTED_MODULE_1__.cookies)().get(\"session\")?.value || \"\";\n        if (!sessionCookie) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Not authenticated\"\n            }, {\n                status: 401\n            });\n        }\n        const decodedToken = await _lib_firebaseAdmin__WEBPACK_IMPORTED_MODULE_2__[\"default\"].auth().verifySessionCookie(sessionCookie, true);\n        const userId = decodedToken.uid;\n        const userDoc = await _lib_firebaseAdmin__WEBPACK_IMPORTED_MODULE_2__[\"default\"].firestore().collection(\"users\").doc(userId).get();\n        if (userDoc.exists && userDoc.data()?.refreshToken) {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                isGoogleConnected: true\n            });\n        } else {\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                isGoogleConnected: false\n            });\n        }\n    } catch (error) {\n        console.error(\"Auth status check error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            isGoogleConnected: false\n        }, {\n            status: 401\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvYXBwL2FwaS9hdXRoL3N0YXR1cy9yb3V0ZS50cyIsIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsbUNBQW1DO0FBQ1E7QUFDSjtBQUNDO0FBRWpDLGVBQWVHO0lBQ3BCLElBQUk7UUFDRixNQUFNQyxnQkFBZ0JILHFEQUFPQSxHQUFHSSxHQUFHLENBQUMsWUFBWUMsU0FBUztRQUN6RCxJQUFJLENBQUNGLGVBQWU7WUFDbEIsT0FBT0oscURBQVlBLENBQUNPLElBQUksQ0FBQztnQkFBRUMsT0FBTztZQUFvQixHQUFHO2dCQUFFQyxRQUFRO1lBQUk7UUFDekU7UUFFQSxNQUFNQyxlQUFlLE1BQU1SLDBEQUFLQSxDQUFDUyxJQUFJLEdBQUdDLG1CQUFtQixDQUFDUixlQUFlO1FBQzNFLE1BQU1TLFNBQVNILGFBQWFJLEdBQUc7UUFFL0IsTUFBTUMsVUFBVSxNQUFNYiwwREFBS0EsQ0FBQ2MsU0FBUyxHQUFHQyxVQUFVLENBQUMsU0FBU0MsR0FBRyxDQUFDTCxRQUFRUixHQUFHO1FBRTNFLElBQUlVLFFBQVFJLE1BQU0sSUFBSUosUUFBUUssSUFBSSxJQUFJQyxjQUFjO1lBQ2xELE9BQU9yQixxREFBWUEsQ0FBQ08sSUFBSSxDQUFDO2dCQUFFZSxtQkFBbUI7WUFBSztRQUNyRCxPQUFPO1lBQ0wsT0FBT3RCLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7Z0JBQUVlLG1CQUFtQjtZQUFNO1FBQ3REO0lBQ0YsRUFBRSxPQUFPZCxPQUFPO1FBQ2RlLFFBQVFmLEtBQUssQ0FBQyw0QkFBNEJBO1FBQzFDLE9BQU9SLHFEQUFZQSxDQUFDTyxJQUFJLENBQUM7WUFBRWUsbUJBQW1CO1FBQU0sR0FBRztZQUFFYixRQUFRO1FBQUk7SUFDdkU7QUFDRiIsInNvdXJjZXMiOlsid2VicGFjazovL2J5Z2dwaWxvdC1uZXh0Ly4vc3JjL2FwcC9hcGkvYXV0aC9zdGF0dXMvcm91dGUudHM/OWViYSJdLCJzb3VyY2VzQ29udGVudCI6WyIvLyBzcmMvYXBwL2FwaS9hdXRoL3N0YXR1cy9yb3V0ZS50c1xuaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xuaW1wb3J0IHsgY29va2llcyB9IGZyb20gJ25leHQvaGVhZGVycyc7XG5pbXBvcnQgYWRtaW4gZnJvbSAnQC9saWIvZmlyZWJhc2VBZG1pbic7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc2Vzc2lvbkNvb2tpZSA9IGNvb2tpZXMoKS5nZXQoJ3Nlc3Npb24nKT8udmFsdWUgfHwgJyc7XG4gICAgaWYgKCFzZXNzaW9uQ29va2llKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBlcnJvcjogJ05vdCBhdXRoZW50aWNhdGVkJyB9LCB7IHN0YXR1czogNDAxIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGRlY29kZWRUb2tlbiA9IGF3YWl0IGFkbWluLmF1dGgoKS52ZXJpZnlTZXNzaW9uQ29va2llKHNlc3Npb25Db29raWUsIHRydWUpO1xuICAgIGNvbnN0IHVzZXJJZCA9IGRlY29kZWRUb2tlbi51aWQ7XG5cbiAgICBjb25zdCB1c2VyRG9jID0gYXdhaXQgYWRtaW4uZmlyZXN0b3JlKCkuY29sbGVjdGlvbigndXNlcnMnKS5kb2ModXNlcklkKS5nZXQoKTtcblxuICAgIGlmICh1c2VyRG9jLmV4aXN0cyAmJiB1c2VyRG9jLmRhdGEoKT8ucmVmcmVzaFRva2VuKSB7XG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oeyBpc0dvb2dsZUNvbm5lY3RlZDogdHJ1ZSB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgaXNHb29nbGVDb25uZWN0ZWQ6IGZhbHNlIH0pO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBjb25zb2xlLmVycm9yKCdBdXRoIHN0YXR1cyBjaGVjayBlcnJvcjonLCBlcnJvcik7XG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKHsgaXNHb29nbGVDb25uZWN0ZWQ6IGZhbHNlIH0sIHsgc3RhdHVzOiA0MDEgfSk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJOZXh0UmVzcG9uc2UiLCJjb29raWVzIiwiYWRtaW4iLCJHRVQiLCJzZXNzaW9uQ29va2llIiwiZ2V0IiwidmFsdWUiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJkZWNvZGVkVG9rZW4iLCJhdXRoIiwidmVyaWZ5U2Vzc2lvbkNvb2tpZSIsInVzZXJJZCIsInVpZCIsInVzZXJEb2MiLCJmaXJlc3RvcmUiLCJjb2xsZWN0aW9uIiwiZG9jIiwiZXhpc3RzIiwiZGF0YSIsInJlZnJlc2hUb2tlbiIsImlzR29vZ2xlQ29ubmVjdGVkIiwiY29uc29sZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./src/app/api/auth/status/route.ts\n");

/***/ }),

/***/ "(rsc)/./src/lib/firebaseAdmin.ts":
/*!**********************************!*\
  !*** ./src/lib/firebaseAdmin.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! firebase-admin */ \"firebase-admin\");\n/* harmony import */ var firebase_admin__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(firebase_admin__WEBPACK_IMPORTED_MODULE_0__);\n\n// Denna kod körs bara en gång när modulen först importeras av servern.\nif (!(firebase_admin__WEBPACK_IMPORTED_MODULE_0___default().apps).length) {\n    try {\n        // Vi förlitar oss nu på GOOGLE_APPLICATION_CREDENTIALS som pekar på serviceAccountKey.json\n        // Detta är den rekommenderade metoden för server-miljöer.\n        firebase_admin__WEBPACK_IMPORTED_MODULE_0___default().initializeApp({\n            credential: firebase_admin__WEBPACK_IMPORTED_MODULE_0___default().credential.applicationDefault()\n        });\n        console.log(\"Firebase Admin SDK initialized successfully using Application Default Credentials.\");\n    } catch (error) {\n        console.error(\"CRITICAL: Firebase Admin SDK initialization failed.\", error.stack);\n        // Kasta felet vidare för att förhindra att appen körs med en trasig konfiguration.\n        throw new Error(\"Could not initialize Firebase Admin SDK. Check server logs.\");\n    }\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((firebase_admin__WEBPACK_IMPORTED_MODULE_0___default()));\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9zcmMvbGliL2ZpcmViYXNlQWRtaW4udHMiLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQW1DO0FBRW5DLHVFQUF1RTtBQUN2RSxJQUFJLENBQUNBLDREQUFVLENBQUNFLE1BQU0sRUFBRTtJQUN0QixJQUFJO1FBQ0YsMkZBQTJGO1FBQzNGLDBEQUEwRDtRQUMxREYsbUVBQW1CLENBQUM7WUFDbEJJLFlBQVlKLGdFQUFnQixDQUFDSyxrQkFBa0I7UUFDakQ7UUFDQUMsUUFBUUMsR0FBRyxDQUFDO0lBQ2QsRUFBRSxPQUFPQyxPQUFZO1FBQ25CRixRQUFRRSxLQUFLLENBQUMsdURBQXVEQSxNQUFNQyxLQUFLO1FBQ2hGLG1GQUFtRjtRQUNuRixNQUFNLElBQUlDLE1BQU07SUFDbEI7QUFDRjtBQUVBLGlFQUFlVix1REFBS0EsRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2J5Z2dwaWxvdC1uZXh0Ly4vc3JjL2xpYi9maXJlYmFzZUFkbWluLnRzPzU5ZmYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGFkbWluIGZyb20gJ2ZpcmViYXNlLWFkbWluJztcblxuLy8gRGVubmEga29kIGvDtnJzIGJhcmEgZW4gZ8OlbmcgbsOkciBtb2R1bGVuIGbDtnJzdCBpbXBvcnRlcmFzIGF2IHNlcnZlcm4uXG5pZiAoIWFkbWluLmFwcHMubGVuZ3RoKSB7XG4gIHRyeSB7XG4gICAgLy8gVmkgZsO2cmxpdGFyIG9zcyBudSBww6UgR09PR0xFX0FQUExJQ0FUSU9OX0NSRURFTlRJQUxTIHNvbSBwZWthciBww6Ugc2VydmljZUFjY291bnRLZXkuanNvblxuICAgIC8vIERldHRhIMOkciBkZW4gcmVrb21tZW5kZXJhZGUgbWV0b2RlbiBmw7ZyIHNlcnZlci1taWxqw7Zlci5cbiAgICBhZG1pbi5pbml0aWFsaXplQXBwKHtcbiAgICAgIGNyZWRlbnRpYWw6IGFkbWluLmNyZWRlbnRpYWwuYXBwbGljYXRpb25EZWZhdWx0KCksXG4gICAgfSk7XG4gICAgY29uc29sZS5sb2coJ0ZpcmViYXNlIEFkbWluIFNESyBpbml0aWFsaXplZCBzdWNjZXNzZnVsbHkgdXNpbmcgQXBwbGljYXRpb24gRGVmYXVsdCBDcmVkZW50aWFscy4nKTtcbiAgfSBjYXRjaCAoZXJyb3I6IGFueSkge1xuICAgIGNvbnNvbGUuZXJyb3IoJ0NSSVRJQ0FMOiBGaXJlYmFzZSBBZG1pbiBTREsgaW5pdGlhbGl6YXRpb24gZmFpbGVkLicsIGVycm9yLnN0YWNrKTtcbiAgICAvLyBLYXN0YSBmZWxldCB2aWRhcmUgZsO2ciBhdHQgZsO2cmhpbmRyYSBhdHQgYXBwZW4ga8O2cnMgbWVkIGVuIHRyYXNpZyBrb25maWd1cmF0aW9uLlxuICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGluaXRpYWxpemUgRmlyZWJhc2UgQWRtaW4gU0RLLiBDaGVjayBzZXJ2ZXIgbG9ncy4nKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBhZG1pbjtcbiJdLCJuYW1lcyI6WyJhZG1pbiIsImFwcHMiLCJsZW5ndGgiLCJpbml0aWFsaXplQXBwIiwiY3JlZGVudGlhbCIsImFwcGxpY2F0aW9uRGVmYXVsdCIsImNvbnNvbGUiLCJsb2ciLCJlcnJvciIsInN0YWNrIiwiRXJyb3IiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./src/lib/firebaseAdmin.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@opentelemetry"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fauth%2Fstatus%2Froute&page=%2Fapi%2Fauth%2Fstatus%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fauth%2Fstatus%2Froute.ts&appDir=%2Fworkspaces%2FByggPilot%2Fsrc%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fworkspaces%2FByggPilot&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();