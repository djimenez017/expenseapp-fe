"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/dashboard",{

/***/ "./components/expenses/expenseCard.js":
/*!********************************************!*\
  !*** ./components/expenses/expenseCard.js ***!
  \********************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ ExpenseCard; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ \"./node_modules/react/jsx-runtime.js\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _lib_formatMoney__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../lib/formatMoney */ \"./components/lib/formatMoney.js\");\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n\n\n// import Modal from \"../dashboard/modal\";\n// import ExpenseForm from \"../forms/addExpense\";\nfunction ExpenseCard(props) {\n    var initials = props.name.split(\" \").map(function(word) {\n        return word[0];\n    }).join(\"\");\n    var newDueDateHandler = function() {\n        var date = new Date();\n        var thisYear = date.getFullYear();\n        var thisMonth = date.getMonth();\n        console.log(todaysDate);\n        return date;\n    };\n    console.log(newDueDateHandler());\n    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(\"div\", {\n        className: \"flex bg-white shadow-lg md:flex-row flex-col\",\n        style: {\n            maxWidth: \"750px\"\n        },\n        __source: {\n            fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n            lineNumber: 24,\n            columnNumber: 5\n        },\n        __self: this,\n        children: [\n            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"div\", {\n                className: \" md:w-2/12 md:text-center md:flex items-center content-center justify-items-center bg-green1 rounded-l-lg hidden\",\n                __source: {\n                    fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                    lineNumber: 28,\n                    columnNumber: 7\n                },\n                __self: this,\n                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"div\", {\n                    className: \"w-full h-max \",\n                    __source: {\n                        fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                        lineNumber: 29,\n                        columnNumber: 9\n                    },\n                    __self: this,\n                    children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"h3\", {\n                        className: \"text-3xl font-bold \",\n                        __source: {\n                            fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                            lineNumber: 30,\n                            columnNumber: 11\n                        },\n                        __self: this,\n                        children: initials\n                    })\n                })\n            }),\n            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(\"div\", {\n                className: \"p-6 md:w-9/12 \",\n                __source: {\n                    fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                    lineNumber: 34,\n                    columnNumber: 7\n                },\n                __self: this,\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(\"div\", {\n                        className: \"flex justify-between md:flex-row flex-col text-left \",\n                        __source: {\n                            fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                            lineNumber: 35,\n                            columnNumber: 9\n                        },\n                        __self: this,\n                        children: [\n                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"h3\", {\n                                className: \"text-3xl font-bold\",\n                                __source: {\n                                    fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                                    lineNumber: 36,\n                                    columnNumber: 11\n                                },\n                                __self: this,\n                                children: props.name\n                            }),\n                            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(\"p\", {\n                                className: \"text-l font-bold\",\n                                __source: {\n                                    fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                                    lineNumber: 37,\n                                    columnNumber: 11\n                                },\n                                __self: this,\n                                children: [\n                                    (0,_lib_formatMoney__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(props.amount),\n                                    \"/\",\n                                    props.frequency\n                                ]\n                            })\n                        ]\n                    }),\n                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"p\", {\n                        __source: {\n                            fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                            lineNumber: 41,\n                            columnNumber: 9\n                        },\n                        __self: this,\n                        children: \"Due Date:\"\n                    })\n                ]\n            }),\n            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(\"div\", {\n                className: \"md:w-1/12 w-full md:flex-row self-center flex-row h-full\",\n                __source: {\n                    fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                    lineNumber: 44,\n                    columnNumber: 7\n                },\n                __self: this,\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"button\", {\n                        className: \" bg-yellow md:w-full h-full py-2 md:py-4 w-1/2 md:rounded-tr-lg\",\n                        __source: {\n                            fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                            lineNumber: 45,\n                            columnNumber: 9\n                        },\n                        __self: this,\n                        children: \"Edit\"\n                    }),\n                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"button\", {\n                        className: \" bg-red md:w-full h-full py-2 md:py-4 text-white w-1/2 rounded-br-lg md:rounded-br-lg\",\n                        __source: {\n                            fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/expenses/expenseCard.js\",\n                            lineNumber: 48,\n                            columnNumber: 9\n                        },\n                        __self: this,\n                        children: \"Delete\"\n                    })\n                ]\n            })\n        ]\n    }));\n}; //{new Date(date).toDateString()}\n_c = ExpenseCard;\nvar _c;\n$RefreshReg$(_c, \"ExpenseCard\");\n\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL2V4cGVuc2VzL2V4cGVuc2VDYXJkLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQXVDO0FBQ0s7QUFDNUMsRUFBMEM7QUFDMUMsRUFBaUQ7QUFFbEMsUUFBUSxDQUFDRyxXQUFXLENBQUNDLEtBQUssRUFBRSxDQUFDO0lBQzFDLEdBQUssQ0FBQ0MsUUFBUSxHQUFHRCxLQUFLLENBQUNFLElBQUksQ0FDeEJDLEtBQUssQ0FBQyxDQUFHLElBQ1RDLEdBQUcsQ0FBQyxRQUFRLENBQVBDLElBQUk7UUFBS0EsTUFBTSxDQUFOQSxJQUFJLENBQUMsQ0FBQztPQUNwQkMsSUFBSSxDQUFDLENBQUU7SUFFVixHQUFLLENBQUNDLGlCQUFpQixHQUFHLFFBQzVCLEdBRGtDLENBQUM7UUFDL0IsR0FBSyxDQUFDQyxJQUFJLEdBQUcsR0FBRyxDQUFDQyxJQUFJO1FBRXJCLEdBQUssQ0FBQ0MsUUFBUSxHQUFHRixJQUFJLENBQUNHLFdBQVc7UUFDakMsR0FBSyxDQUFDQyxTQUFTLEdBQUdKLElBQUksQ0FBQ0ssUUFBUTtRQUMvQkMsT0FBTyxDQUFDQyxHQUFHLENBQUNDLFVBQVU7UUFDdEIsTUFBTSxDQUFDUixJQUFJO0lBQ2IsQ0FBQztJQUVETSxPQUFPLENBQUNDLEdBQUcsQ0FBQ1IsaUJBQWlCO0lBRTdCLE1BQU0sdUVBQ0hVLENBQUc7UUFDRkMsU0FBUyxFQUFDLENBQStDO1FBQ3pEQyxLQUFLLEVBQUUsQ0FBQztZQUFDQyxRQUFRLEVBQUUsQ0FBTztRQUFDLENBQUM7Ozs7Ozs7O2lGQUUzQkgsQ0FBRztnQkFBQ0MsU0FBUyxFQUFDLENBQWtIOzs7Ozs7OytGQUM5SEQsQ0FBRztvQkFBQ0MsU0FBUyxFQUFDLENBQWU7Ozs7Ozs7bUdBQzNCRyxDQUFFO3dCQUFDSCxTQUFTLEVBQUMsQ0FBcUI7Ozs7Ozs7a0NBQUVqQixRQUFROzs7O2tGQUloRGdCLENBQUc7Z0JBQUNDLFNBQVMsRUFBQyxDQUFnQjs7Ozs7Ozs7MEZBQzVCRCxDQUFHO3dCQUFDQyxTQUFTLEVBQUMsQ0FBc0Q7Ozs7Ozs7O2lHQUNsRUcsQ0FBRTtnQ0FBQ0gsU0FBUyxFQUFDLENBQW9COzs7Ozs7OzBDQUFFbEIsS0FBSyxDQUFDRSxJQUFJOztrR0FDN0NvQixDQUFDO2dDQUFDSixTQUFTLEVBQUMsQ0FBa0I7Ozs7Ozs7O29DQUM1QnBCLDREQUFXLENBQUNFLEtBQUssQ0FBQ3VCLE1BQU07b0NBQUUsQ0FBQztvQ0FBQ3ZCLEtBQUssQ0FBQ3dCLFNBQVM7Ozs7O3lGQUcvQ0YsQ0FBQzs7Ozs7OztrQ0FBQyxDQUFTOzs7O2tGQUdiTCxDQUFHO2dCQUFDQyxTQUFTLEVBQUMsQ0FBMEQ7Ozs7Ozs7O3lGQUN0RU8sQ0FBTTt3QkFBQ1AsU0FBUyxFQUFDLENBQWtFOzs7Ozs7O2tDQUFDLENBRXJGOzt5RkFDQ08sQ0FBTTt3QkFBQ1AsU0FBUyxFQUFDLENBQXVGOzs7Ozs7O2tDQUFDLENBRTFHOzs7Ozs7QUFJUixDQUFDLENBRUQsQ0FBaUM7S0FsRFRuQixXQUFXIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2NvbXBvbmVudHMvZXhwZW5zZXMvZXhwZW5zZUNhcmQuanM/NmI0MCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUgfSBmcm9tIFwicmVhY3RcIjtcbmltcG9ydCBmb3JtYXRNb25leSBmcm9tIFwiLi4vbGliL2Zvcm1hdE1vbmV5XCI7XG4vLyBpbXBvcnQgTW9kYWwgZnJvbSBcIi4uL2Rhc2hib2FyZC9tb2RhbFwiO1xuLy8gaW1wb3J0IEV4cGVuc2VGb3JtIGZyb20gXCIuLi9mb3Jtcy9hZGRFeHBlbnNlXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEV4cGVuc2VDYXJkKHByb3BzKSB7XG4gIGNvbnN0IGluaXRpYWxzID0gcHJvcHMubmFtZVxuICAgIC5zcGxpdChcIiBcIilcbiAgICAubWFwKCh3b3JkKSA9PiB3b3JkWzBdKVxuICAgIC5qb2luKFwiXCIpO1xuXG4gIGNvbnN0IG5ld0R1ZURhdGVIYW5kbGVyID0gKCkgPT4ge1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgRGF0ZSgpO1xuXG4gICAgY29uc3QgdGhpc1llYXIgPSBkYXRlLmdldEZ1bGxZZWFyKCk7XG4gICAgY29uc3QgdGhpc01vbnRoID0gZGF0ZS5nZXRNb250aCgpO1xuICAgIGNvbnNvbGUubG9nKHRvZGF5c0RhdGUpO1xuICAgIHJldHVybiBkYXRlO1xuICB9O1xuXG4gIGNvbnNvbGUubG9nKG5ld0R1ZURhdGVIYW5kbGVyKCkpO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdlxuICAgICAgY2xhc3NOYW1lPVwiZmxleCAgYmctd2hpdGUgc2hhZG93LWxnIG1kOmZsZXgtcm93IGZsZXgtY29sXCJcbiAgICAgIHN0eWxlPXt7IG1heFdpZHRoOiBcIjc1MHB4XCIgfX1cbiAgICA+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIiBtZDp3LTIvMTIgbWQ6dGV4dC1jZW50ZXIgbWQ6ZmxleCBpdGVtcy1jZW50ZXIgY29udGVudC1jZW50ZXIganVzdGlmeS1pdGVtcy1jZW50ZXIgYmctZ3JlZW4xIHJvdW5kZWQtbC1sZyBoaWRkZW5cIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LWZ1bGwgaC1tYXggXCI+XG4gICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtM3hsIGZvbnQtYm9sZCBcIj57aW5pdGlhbHN9PC9oMz5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJwLTYgbWQ6dy05LzEyIFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImZsZXgganVzdGlmeS1iZXR3ZWVuIG1kOmZsZXgtcm93IGZsZXgtY29sIHRleHQtbGVmdCBcIj5cbiAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwidGV4dC0zeGwgZm9udC1ib2xkXCI+e3Byb3BzLm5hbWV9PC9oMz5cbiAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWwgZm9udC1ib2xkXCI+XG4gICAgICAgICAgICB7Zm9ybWF0TW9uZXkocHJvcHMuYW1vdW50KX0ve3Byb3BzLmZyZXF1ZW5jeX1cbiAgICAgICAgICA8L3A+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8cD5EdWUgRGF0ZTo8L3A+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJtZDp3LTEvMTIgdy1mdWxsIG1kOmZsZXgtcm93IHNlbGYtY2VudGVyIGZsZXgtcm93IGgtZnVsbFwiPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIiBiZy15ZWxsb3cgbWQ6dy1mdWxsIGgtZnVsbCBweS0yIG1kOnB5LTQgdy0xLzIgIG1kOnJvdW5kZWQtdHItbGdcIj5cbiAgICAgICAgICBFZGl0XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cIiBiZy1yZWQgbWQ6dy1mdWxsIGgtZnVsbCBweS0yIG1kOnB5LTQgdGV4dC13aGl0ZSB3LTEvMiByb3VuZGVkLWJyLWxnIG1kOnJvdW5kZWQtYnItbGdcIj5cbiAgICAgICAgICBEZWxldGVcbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuLy97bmV3IERhdGUoZGF0ZSkudG9EYXRlU3RyaW5nKCl9XG4iXSwibmFtZXMiOlsiUmVhY3QiLCJ1c2VTdGF0ZSIsImZvcm1hdE1vbmV5IiwiRXhwZW5zZUNhcmQiLCJwcm9wcyIsImluaXRpYWxzIiwibmFtZSIsInNwbGl0IiwibWFwIiwid29yZCIsImpvaW4iLCJuZXdEdWVEYXRlSGFuZGxlciIsImRhdGUiLCJEYXRlIiwidGhpc1llYXIiLCJnZXRGdWxsWWVhciIsInRoaXNNb250aCIsImdldE1vbnRoIiwiY29uc29sZSIsImxvZyIsInRvZGF5c0RhdGUiLCJkaXYiLCJjbGFzc05hbWUiLCJzdHlsZSIsIm1heFdpZHRoIiwiaDMiLCJwIiwiYW1vdW50IiwiZnJlcXVlbmN5IiwiYnV0dG9uIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/expenses/expenseCard.js\n");

/***/ })

});