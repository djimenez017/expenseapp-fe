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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @apollo/client */ \"@apollo/client\");\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_apollo_client__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @apollo/client/link/context */ \"@apollo/client/link/context\");\n/* harmony import */ var _apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1__);\n\n\nconst httpLink = (0,_apollo_client__WEBPACK_IMPORTED_MODULE_0__.createHttpLink)({\n    uri: \"http://localhost:4000\"\n});\nconst authLink = (0,_apollo_client_link_context__WEBPACK_IMPORTED_MODULE_1__.setContext)((_, { headers , ...context })=>{\n    // get the authentication token from local storage if it exists\n    console.log(context);\n    const token = localStorage.getItem(\"token\");\n    // return the headers to the context so httpLink can read them\n    return {\n        headers: {\n            ...headers,\n            Authorization: token ? `Bearer ${token}` : \"\"\n        },\n        ...context\n    };\n});\nconst client = new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.ApolloClient({\n    link: authLink.concat(httpLink),\n    cache: new _apollo_client__WEBPACK_IMPORTED_MODULE_0__.InMemoryCache()\n});\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (client);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL2xpYi9hcG9sbG8tY2xpZW50LmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQTRFO0FBQ3BCO0FBRXhELEtBQUssQ0FBQ0ksUUFBUSxHQUFHRiw4REFBYyxDQUFDLENBQUM7SUFDL0JHLEdBQUcsRUFBRSxDQUF1QjtBQUU5QixDQUFDO0FBRUQsS0FBSyxDQUFDQyxRQUFRLEdBQUdILHVFQUFVLEVBQUVJLENBQUMsRUFBRSxDQUFDLENBQUNDLE9BQU8sTUFBS0MsT0FBTyxDQUFDLENBQUMsR0FBSyxDQUFDO0lBQzNELEVBQStEO0lBQy9EQyxPQUFPLENBQUNDLEdBQUcsQ0FBQ0YsT0FBTztJQUNuQixLQUFLLENBQUNHLEtBQUssR0FBR0MsWUFBWSxDQUFDQyxPQUFPLENBQUMsQ0FBTztJQUMxQyxFQUE4RDtJQUM5RCxNQUFNLENBQUMsQ0FBQztRQUNOTixPQUFPLEVBQUUsQ0FBQztlQUNMQSxPQUFPO1lBQ1ZPLGFBQWEsRUFBRUgsS0FBSyxJQUFJLE9BQU8sRUFBRUEsS0FBSyxLQUFLLENBQUU7UUFJL0MsQ0FBQztXQUNFSCxPQUFPO0lBQ1osQ0FBQztBQUNILENBQUM7QUFFRCxLQUFLLENBQUNPLE1BQU0sR0FBRyxHQUFHLENBQUNoQix3REFBWSxDQUFDLENBQUM7SUFDL0JpQixJQUFJLEVBQUVYLFFBQVEsQ0FBQ1ksTUFBTSxDQUFDZCxRQUFRO0lBQzlCZSxLQUFLLEVBQUUsR0FBRyxDQUFDbEIseURBQWE7QUFDMUIsQ0FBQztBQUVELGlFQUFlZSxNQUFNLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9leHBlbnNlLWFwcC1mZS8uL2NvbXBvbmVudHMvbGliL2Fwb2xsby1jbGllbnQuanM/MzQ0MCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBcG9sbG9DbGllbnQsIEluTWVtb3J5Q2FjaGUsIGNyZWF0ZUh0dHBMaW5rIH0gZnJvbSBcIkBhcG9sbG8vY2xpZW50XCI7XG5pbXBvcnQgeyBzZXRDb250ZXh0IH0gZnJvbSBcIkBhcG9sbG8vY2xpZW50L2xpbmsvY29udGV4dFwiO1xuXG5jb25zdCBodHRwTGluayA9IGNyZWF0ZUh0dHBMaW5rKHtcbiAgdXJpOiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMFwiLFxuICAvL3VyaTogcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfUFJPRF9CRSxcbn0pO1xuXG5jb25zdCBhdXRoTGluayA9IHNldENvbnRleHQoKF8sIHsgaGVhZGVycywgLi4uY29udGV4dCB9KSA9PiB7XG4gIC8vIGdldCB0aGUgYXV0aGVudGljYXRpb24gdG9rZW4gZnJvbSBsb2NhbCBzdG9yYWdlIGlmIGl0IGV4aXN0c1xuICBjb25zb2xlLmxvZyhjb250ZXh0KTtcbiAgY29uc3QgdG9rZW4gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInRva2VuXCIpO1xuICAvLyByZXR1cm4gdGhlIGhlYWRlcnMgdG8gdGhlIGNvbnRleHQgc28gaHR0cExpbmsgY2FuIHJlYWQgdGhlbVxuICByZXR1cm4ge1xuICAgIGhlYWRlcnM6IHtcbiAgICAgIC4uLmhlYWRlcnMsXG4gICAgICBBdXRob3JpemF0aW9uOiB0b2tlbiA/IGBCZWFyZXIgJHt0b2tlbn1gIDogXCJcIixcbiAgICAgIC8vIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgLy8gXCJBY2Nlc3MtQ29udHJvbC1BbGxvdy1PcmlnaW5cIjogXCIqXCIsXG4gICAgICAvLyBcIkFjY2Vzcy1Db250cm9sLUFsbG93LUNyZWRlbnRpYWxzXCI6IHRydWUsXG4gICAgfSxcbiAgICAuLi5jb250ZXh0LFxuICB9O1xufSk7XG5cbmNvbnN0IGNsaWVudCA9IG5ldyBBcG9sbG9DbGllbnQoe1xuICBsaW5rOiBhdXRoTGluay5jb25jYXQoaHR0cExpbmspLFxuICBjYWNoZTogbmV3IEluTWVtb3J5Q2FjaGUoKSxcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjbGllbnQ7XG4iXSwibmFtZXMiOlsiQXBvbGxvQ2xpZW50IiwiSW5NZW1vcnlDYWNoZSIsImNyZWF0ZUh0dHBMaW5rIiwic2V0Q29udGV4dCIsImh0dHBMaW5rIiwidXJpIiwiYXV0aExpbmsiLCJfIiwiaGVhZGVycyIsImNvbnRleHQiLCJjb25zb2xlIiwibG9nIiwidG9rZW4iLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiQXV0aG9yaXphdGlvbiIsImNsaWVudCIsImxpbmsiLCJjb25jYXQiLCJjYWNoZSJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./components/lib/apollo-client.js\n");

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