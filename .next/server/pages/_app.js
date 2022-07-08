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
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./components/lib/apollo-client.js":
/*!*****************************************!*\
  !*** ./components/lib/apollo-client.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @apollo/client */ \"@apollo/client\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_apollo_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @apollo/client/link/context */ \"@apollo/client/link/context\");\n/* harmony import */ var _apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst httpLink = (0,_apollo_client__WEBPACK_IMPORTED_MODULE_0__.createHttpLink)({\n    //uri: \"http://localhost:4000\",\n    uri: process.env.PPROD_BE\n});\nconst authLink = (0,_apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1__.setContext)((_, { headers  })=>{\n    // get the authentication token from local storage if it exists\n    const token = localStorage.getItem(\"token\");\n    // return the headers to the context so httpLink can read them\n    return {\n        headers: {\n            ...headers,\n            Authorization: token ? `Bearer ${token}` : \"\"\n        }\n    };\n});\nconst client = new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.ApolloClient({\n    link: authLink.concat(httpLink),\n    cache: new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.InMemoryCache()\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (client);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL2xpYi9hcG9sbG8tY2xpZW50LmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQTRFO0FBQ3BCO0FBRXhELEtBQUssQ0FBQ0ksUUFBUSxHQUFHRiw4REFBYyxDQUFDLENBQUM7SUFDL0IsRUFBK0I7SUFDL0JHLEdBQUcsRUFBRUMsT0FBTyxDQUFDQyxHQUFHLENBQUNDLFFBQVE7QUFDM0IsQ0FBQztBQUVELEtBQUssQ0FBQ0MsUUFBUSxHQUFHTix1RUFBVSxFQUFFTyxDQUFDLEVBQUUsQ0FBQyxDQUFDQyxPQUFPLEVBQUMsQ0FBQyxHQUFLLENBQUM7SUFDL0MsRUFBK0Q7SUFDL0QsS0FBSyxDQUFDQyxLQUFLLEdBQUdDLFlBQVksQ0FBQ0MsT0FBTyxDQUFDLENBQU87SUFDMUMsRUFBOEQ7SUFDOUQsTUFBTSxDQUFDLENBQUM7UUFDTkgsT0FBTyxFQUFFLENBQUM7ZUFDTEEsT0FBTztZQUNWSSxhQUFhLEVBQUVILEtBQUssSUFBSSxPQUFPLEVBQUVBLEtBQUssS0FBSyxDQUFFO1FBSS9DLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVELEtBQUssQ0FBQ0ksTUFBTSxHQUFHLEdBQUcsQ0FBQ2hCLHdEQUFZLENBQUMsQ0FBQztJQUMvQmlCLElBQUksRUFBRVIsUUFBUSxDQUFDUyxNQUFNLENBQUNkLFFBQVE7SUFDOUJlLEtBQUssRUFBRSxHQUFHLENBQUNsQix5REFBYTtBQUMxQixDQUFDO0FBRUQsaUVBQWVlLE1BQU0sRUFBQyIsInNvdXJjZXMiOlsid2VicGFjazovL2V4cGVuc2UtYXBwLWZlLy4vY29tcG9uZW50cy9saWIvYXBvbGxvLWNsaWVudC5qcz8zNDQwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwb2xsb0NsaWVudCwgSW5NZW1vcnlDYWNoZSwgY3JlYXRlSHR0cExpbmsgfSBmcm9tIFwiQGFwb2xsby9jbGllbnRcIjtcbmltcG9ydCB7IHNldENvbnRleHQgfSBmcm9tIFwiQGFwb2xsby9jbGllbnQvbGluay9jb250ZXh0XCI7XG5cbmNvbnN0IGh0dHBMaW5rID0gY3JlYXRlSHR0cExpbmsoe1xuICAvL3VyaTogXCJodHRwOi8vbG9jYWxob3N0OjQwMDBcIixcbiAgdXJpOiBwcm9jZXNzLmVudi5QUFJPRF9CRSxcbn0pO1xuXG5jb25zdCBhdXRoTGluayA9IHNldENvbnRleHQoKF8sIHsgaGVhZGVycyB9KSA9PiB7XG4gIC8vIGdldCB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4gZnJvbSBsb2NhbCBzdG9yYWdlIGlmIGl0IGV4aXN0c1xuICBjb25zdCB0b2tlbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidG9rZW5cIik7XG4gIC8vIHJldHVybiB0aGUgaGVhZGVycyB0byB0aGUgY29udGV4dCBzbyBodHRwTGluayBjYW4gcmVhZCB0aGVtXG4gIHJldHVybiB7XG4gICAgaGVhZGVyczoge1xuICAgICAgLi4uaGVhZGVycyxcbiAgICAgIEF1dGhvcml6YXRpb246IHRva2VuID8gYEJlYXJlciAke3Rva2VufWAgOiBcIlwiLFxuICAgICAgLy8gXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAvLyBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiOiBcIipcIixcbiAgICAgIC8vIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctQ3JlZGVudGlhbHNcIjogdHJ1ZSxcbiAgICB9LFxuICB9O1xufSk7XG5cbmNvbnN0IGNsaWVudCA9IG5ldyBBcG9sbG9DbGllbnQoe1xuICBsaW5rOiBhdXRoTGluay5jb25jYXQoaHR0cExpbmspLFxuICBjYWNoZTogbmV3IEluTWVtb3J5Q2FjaGUoKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXSwibmFtZXMiOlsiQXBvbGxvQ2xpZW50IiwiSW5NZW1vcnlDYWNoZSIsImNyZWF0ZUh0dHBMaW5rIiwic2V0Q29udGV4dCIsImh0dHBMaW5rIiwidXJpIiwicHJvY2VzcyIsImVudiIsIlBQUk9EX0JFIiwiYXV0aExpbmsiLCJfIiwiaGVhZGVycyIsInRva2VuIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkF1dGhvcml6YXRpb24iLCJjbGllbnQiLCJsaW5rIiwiY29uY2F0IiwiY2FjaGUiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/lib/apollo-client.js\n");

/***/ }),

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ \"react/jsx-runtime\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _apollo_react_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @apollo/react-hooks */ \"@apollo/react-hooks\");\n/* harmony import */ var _apollo_react_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _components_lib_apollo_client__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../components/lib/apollo-client */ \"./components/lib/apollo-client.js\");\n\n\n\n\nfunction MyApp({ Component , pageProps  }) {\n    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_apollo_react_hooks__WEBPACK_IMPORTED_MODULE_2__.ApolloProvider, {\n        client: _components_lib_apollo_client__WEBPACK_IMPORTED_MODULE_3__[\"default\"],\n        __source: {\n            fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/pages/_app.js\",\n            lineNumber: 7,\n            columnNumber: 5\n        },\n        __self: this,\n        children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Component, {\n            ...pageProps,\n            __source: {\n                fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/pages/_app.js\",\n                lineNumber: 8,\n                columnNumber: 7\n            },\n            __self: this\n        })\n    }));\n}\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUE4QjtBQUNzQjtBQUNBO1NBRTNDRSxLQUFLLENBQUMsQ0FBQyxDQUFDQyxTQUFTLEdBQUVDLFNBQVMsRUFBQyxDQUFDLEVBQUUsQ0FBQztJQUN4QyxNQUFNLHNFQUNISiwrREFBYztRQUFDQyxNQUFNLEVBQUVBLHFFQUFNOzs7Ozs7O3VGQUMzQkUsU0FBUztlQUFLQyxTQUFTOzs7Ozs7Ozs7QUFHOUIsQ0FBQztBQUVELGlFQUFlRixLQUFLLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leHBlbnNlLWFwcC1mZS8uL3BhZ2VzL19hcHAuanM/ZTBhZCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgXCIuLi9zdHlsZXMvZ2xvYmFscy5jc3NcIjtcbmltcG9ydCB7IEFwb2xsb1Byb3ZpZGVyIH0gZnJvbSBcIkBhcG9sbG8vcmVhY3QtaG9va3NcIjtcbmltcG9ydCBjbGllbnQgZnJvbSBcIi4uL2NvbXBvbmVudHMvbGliL2Fwb2xsby1jbGllbnRcIjtcblxuZnVuY3Rpb24gTXlBcHAoeyBDb21wb25lbnQsIHBhZ2VQcm9wcyB9KSB7XG4gIHJldHVybiAoXG4gICAgPEFwb2xsb1Byb3ZpZGVyIGNsaWVudD17Y2xpZW50fT5cbiAgICAgIDxDb21wb25lbnQgey4uLnBhZ2VQcm9wc30gLz5cbiAgICA8L0Fwb2xsb1Byb3ZpZGVyPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBNeUFwcDtcbiJdLCJuYW1lcyI6WyJBcG9sbG9Qcm92aWRlciIsImNsaWVudCIsIk15QXBwIiwiQ29tcG9uZW50IiwicGFnZVByb3BzIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@apollo/client":
/*!*********************************!*\
  !*** external "@apollo/client" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client");

/***/ }),

/***/ "@apollo/client/link/context":
/*!**********************************************!*\
  !*** external "@apollo/client/link/context" ***!
  \**********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/client/link/context");

/***/ }),

/***/ "@apollo/react-hooks":
/*!**************************************!*\
  !*** external "@apollo/react-hooks" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@apollo/react-hooks");

/***/ }),

/***/ "react/jsx-runtime":
/*!************************************!*\
  !*** external "react/jsx-runtime" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();