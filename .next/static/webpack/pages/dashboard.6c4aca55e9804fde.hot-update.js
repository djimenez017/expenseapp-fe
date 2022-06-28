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

/***/ "./components/container.js":
/*!*********************************!*\
  !*** ./components/container.js ***!
  \*********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ Container; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ \"./node_modules/react/jsx-runtime.js\");\n/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _apollo_client__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @apollo/client */ \"./node_modules/@apollo/client/index.js\");\n/* harmony import */ var _dashboard_userInfo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dashboard/userInfo */ \"./components/dashboard/userInfo.js\");\n/* harmony import */ var _expenses_expenseCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./expenses/expenseCard */ \"./components/expenses/expenseCard.js\");\n/* harmony import */ var _button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./button */ \"./components/button.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! next/link */ \"./node_modules/next/link.js\");\n/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(next_link__WEBPACK_IMPORTED_MODULE_4__);\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! next/router */ \"./node_modules/next/router.js\");\n/* harmony import */ var next_router__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(next_router__WEBPACK_IMPORTED_MODULE_5__);\n/* module decorator */ module = __webpack_require__.hmd(module);\n\n/* eslint-disable @next/next/link-passhref */ \n\n\n\n\n\nfunction _taggedTemplateLiteral(strings, raw) {\n    if (!raw) {\n        raw = strings.slice(0);\n    }\n    return Object.freeze(Object.defineProperties(strings, {\n        raw: {\n            value: Object.freeze(raw)\n        }\n    }));\n}\nfunction _templateObject() {\n    var data = _taggedTemplateLiteral([\n        \"\\n  query expenses {\\n    expenses {\\n      id\\n      author {\\n        fullName\\n        id\\n        username\\n        emailAddress\\n      }\\n      name\\n      amount\\n      frequency\\n      dateDue\\n      expenseAuthor\\n    }\\n  }\\n\"\n    ]);\n    _templateObject = function _templateObject() {\n        return data;\n    };\n    return data;\n}\nvar _s = $RefreshSig$();\nvar GET_USER_EXPENSES = (0,_apollo_client__WEBPACK_IMPORTED_MODULE_6__.gql)(_templateObject());\nfunction Container(props) {\n    var _this = this;\n    _s();\n    var router = (0,next_router__WEBPACK_IMPORTED_MODULE_5__.useRouter)();\n    var ref = (0,_apollo_client__WEBPACK_IMPORTED_MODULE_6__.useQuery)(GET_USER_EXPENSES), loading = ref.loading, error = ref.error, data = ref.data;\n    if (loading) return \"Getting Data...\";\n    if (!data) router.push(\"/addExpense\");\n    if (error) return \"Submission error! \".concat(error.message);\n    // const userData = data.expenses[0].author;\n    var expensesData = data.expenses.map(function(expense) {\n        return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_expenses_expenseCard__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n            name: expense.name,\n            amount: expense.amount,\n            frequency: expense.frequency,\n            dateDue: expense.dateDue,\n            id: expense.id,\n            __source: {\n                fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/container.js\",\n                lineNumber: 39,\n                columnNumber: 7\n            },\n            __self: _this\n        }, expense.id));\n    });\n    return(/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(\"main\", {\n        className: \"container box-border p-2 space-y-4\",\n        style: {\n            maxWidth: \"750px\"\n        },\n        __source: {\n            fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/container.js\",\n            lineNumber: 51,\n            columnNumber: 5\n        },\n        __self: this,\n        children: [\n            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"button\", {\n                className: \"block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800\",\n                type: \"button\",\n                \"data-modal-toggle\": \"defaultModal\",\n                __source: {\n                    fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/container.js\",\n                    lineNumber: 55,\n                    columnNumber: 7\n                },\n                __self: this\n            }),\n            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"div\", {\n                className: \"flex flex-col\",\n                __source: {\n                    fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/container.js\",\n                    lineNumber: 61,\n                    columnNumber: 7\n                },\n                __self: this,\n                children: /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(_button__WEBPACK_IMPORTED_MODULE_3__[\"default\"], {\n                    __source: {\n                        fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/container.js\",\n                        lineNumber: 62,\n                        columnNumber: 9\n                    },\n                    __self: this,\n                    children: [\n                        \" \",\n                        /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)((next_link__WEBPACK_IMPORTED_MODULE_4___default()), {\n                            href: \"/addExpense\",\n                            __source: {\n                                fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/container.js\",\n                                lineNumber: 64,\n                                columnNumber: 11\n                            },\n                            __self: this,\n                            children: \"Add Expense \"\n                        })\n                    ]\n                })\n            }),\n            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(\"div\", {\n                className: \"w-300px space-y-10\",\n                __source: {\n                    fileName: \"/Users/danieljimenez/Documents/Code/expense-app-fe/components/container.js\",\n                    lineNumber: 67,\n                    columnNumber: 7\n                },\n                __self: this,\n                children: expensesData\n            })\n        ]\n    }));\n};\n_s(Container, \"3cmGJmCPbWz07HwSwgYwWOwFKhw=\", false, function() {\n    return [\n        next_router__WEBPACK_IMPORTED_MODULE_5__.useRouter,\n        _apollo_client__WEBPACK_IMPORTED_MODULE_6__.useQuery\n    ];\n});\n_c = Container;\nvar _c;\n$RefreshReg$(_c, \"Container\");\n\n\n;\n    var _a, _b;\n    // Legacy CSS implementations will `eval` browser code in a Node.js context\n    // to extract CSS. For backwards compatibility, we need to check we're in a\n    // browser context before continuing.\n    if (typeof self !== 'undefined' &&\n        // AMP / No-JS mode does not inject these helpers:\n        '$RefreshHelpers$' in self) {\n        var currentExports = module.__proto__.exports;\n        var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n        // This cannot happen in MainTemplate because the exports mismatch between\n        // templating and execution.\n        self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n        // A module can be accepted automatically based on its exports, e.g. when\n        // it is a Refresh Boundary.\n        if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n            // Save the previous exports on update so we can compare the boundary\n            // signatures.\n            module.hot.dispose(function (data) {\n                data.prevExports = currentExports;\n            });\n            // Unconditionally accept an update to this module, we'll check if it's\n            // still a Refresh Boundary later.\n            module.hot.accept();\n            // This field is set when the previous version of this module was a\n            // Refresh Boundary, letting us know we need to check for invalidation or\n            // enqueue an update.\n            if (prevExports !== null) {\n                // A boundary can become ineligible if its exports are incompatible\n                // with the previous exports.\n                //\n                // For example, if you add/remove/change exports, we'll want to\n                // re-execute the importing modules, and force those components to\n                // re-render. Similarly, if you convert a class component to a\n                // function, we want to invalidate the boundary.\n                if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                    module.hot.invalidate();\n                }\n                else {\n                    self.$RefreshHelpers$.scheduleUpdate();\n                }\n            }\n        }\n        else {\n            // Since we just executed the code for the module, it's possible that the\n            // new exports made it ineligible for being a boundary.\n            // We only care about the case when we were _previously_ a boundary,\n            // because we already accepted this update (accidental side effect).\n            var isNoLongerABoundary = prevExports !== null;\n            if (isNoLongerABoundary) {\n                module.hot.invalidate();\n            }\n        }\n    }\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL2NvbnRhaW5lci5qcy5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsRUFBNkMsNENBQ0M7QUFDSDtBQUNLO0FBQ25CO0FBQ0Q7QUFDVzs7Ozs7Ozs7Ozs7OztRQUVULENBaUI5Qjs7Ozs7Ozs7QUFqQkEsR0FBSyxDQUFDTyxpQkFBaUIsR0FBR1AsbURBQUc7QUFtQmQsUUFBUSxDQUFDUSxTQUFTLENBQUNDLEtBQUssRUFBRSxDQUFDOzs7SUFDeEMsR0FBSyxDQUFDQyxNQUFNLEdBQUdKLHNEQUFTO0lBQ3hCLEdBQUssQ0FBNEJMLEdBQTJCLEdBQTNCQSx3REFBUSxDQUFDTSxpQkFBaUIsR0FBbkRJLE9BQU8sR0FBa0JWLEdBQTJCLENBQXBEVSxPQUFPLEVBQUVDLEtBQUssR0FBV1gsR0FBMkIsQ0FBM0NXLEtBQUssRUFBRUMsSUFBSSxHQUFLWixHQUEyQixDQUFwQ1ksSUFBSTtJQUU1QixFQUFFLEVBQUVGLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBaUI7SUFDckMsRUFBRSxHQUFHRSxJQUFJLEVBQUVILE1BQU0sQ0FBQ0ksSUFBSSxDQUFDLENBQWE7SUFDcEMsRUFBRSxFQUFFRixLQUFLLEVBQUUsTUFBTSxDQUFFLENBQWtCLG9CQUFnQixPQUFkQSxLQUFLLENBQUNHLE9BQU87SUFFcEQsRUFBNEM7SUFDNUMsR0FBSyxDQUFDQyxZQUFZLEdBQUdILElBQUksQ0FBQ0ksUUFBUSxDQUFDQyxHQUFHLENBQUMsUUFBUSxDQUFQQyxPQUFPLEVBQUssQ0FBQztRQUNuRCxNQUFNLHNFQUNIaEIsNkRBQVc7WUFFVmlCLElBQUksRUFBRUQsT0FBTyxDQUFDQyxJQUFJO1lBQ2xCQyxNQUFNLEVBQUVGLE9BQU8sQ0FBQ0UsTUFBTTtZQUN0QkMsU0FBUyxFQUFFSCxPQUFPLENBQUNHLFNBQVM7WUFDNUJDLE9BQU8sRUFBRUosT0FBTyxDQUFDSSxPQUFPO1lBQ3hCQyxFQUFFLEVBQUVMLE9BQU8sQ0FBQ0ssRUFBRTs7Ozs7OztXQUxUTCxPQUFPLENBQUNLLEVBQUU7SUFRckIsQ0FBQztJQUVELE1BQU0sdUVBQ0hDLENBQUk7UUFDSEMsU0FBUyxFQUFDLENBQW9DO1FBQzlDQyxLQUFLLEVBQUUsQ0FBQztZQUFDQyxRQUFRLEVBQUUsQ0FBTztRQUFDLENBQUM7Ozs7Ozs7O2lGQUUzQkMsQ0FBTTtnQkFDTEgsU0FBUyxFQUFDLENBQTROO2dCQUN0T0ksSUFBSSxFQUFDLENBQVE7Z0JBQ2JDLENBQWlCLG9CQUFDLENBQWM7Ozs7Ozs7O2lGQUdqQ0MsQ0FBRztnQkFBQ04sU0FBUyxFQUFDLENBQWU7Ozs7Ozs7Z0dBQzNCdEIsK0NBQU07Ozs7Ozs7O3dCQUNKLENBQUc7NkZBQ0hDLGtEQUFJOzRCQUFDNEIsSUFBSSxFQUFHLENBQVc7Ozs7Ozs7c0NBQUcsQ0FBWTs7Ozs7aUZBRzFDRCxDQUFHO2dCQUFDTixTQUFTLEVBQUMsQ0FBb0I7Ozs7Ozs7MEJBQUVWLFlBQVk7Ozs7QUFHdkQsQ0FBQztHQTFDdUJSLFNBQVM7O1FBQ2hCRixrREFBUztRQUNTTCxvREFBUTs7O0tBRm5CTyxTQUFTIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vX05fRS8uL2NvbXBvbmVudHMvY29udGFpbmVyLmpzP2MwZDIiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgQG5leHQvbmV4dC9saW5rLXBhc3NocmVmICovXG5pbXBvcnQgeyBncWwsIHVzZVF1ZXJ5IH0gZnJvbSBcIkBhcG9sbG8vY2xpZW50XCI7XG5pbXBvcnQgVXNlckluZm8gZnJvbSBcIi4vZGFzaGJvYXJkL3VzZXJJbmZvXCI7XG5pbXBvcnQgRXhwZW5zZUNhcmQgZnJvbSBcIi4vZXhwZW5zZXMvZXhwZW5zZUNhcmRcIjtcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4vYnV0dG9uXCI7XG5pbXBvcnQgTGluayBmcm9tIFwibmV4dC9saW5rXCI7XG5pbXBvcnQgeyB1c2VSb3V0ZXIgfSBmcm9tIFwibmV4dC9yb3V0ZXJcIjtcblxuY29uc3QgR0VUX1VTRVJfRVhQRU5TRVMgPSBncWxgXG4gIHF1ZXJ5IGV4cGVuc2VzIHtcbiAgICBleHBlbnNlcyB7XG4gICAgICBpZFxuICAgICAgYXV0aG9yIHtcbiAgICAgICAgZnVsbE5hbWVcbiAgICAgICAgaWRcbiAgICAgICAgdXNlcm5hbWVcbiAgICAgICAgZW1haWxBZGRyZXNzXG4gICAgICB9XG4gICAgICBuYW1lXG4gICAgICBhbW91bnRcbiAgICAgIGZyZXF1ZW5jeVxuICAgICAgZGF0ZUR1ZVxuICAgICAgZXhwZW5zZUF1dGhvclxuICAgIH1cbiAgfVxuYDtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gQ29udGFpbmVyKHByb3BzKSB7XG4gIGNvbnN0IHJvdXRlciA9IHVzZVJvdXRlcigpO1xuICBjb25zdCB7IGxvYWRpbmcsIGVycm9yLCBkYXRhIH0gPSB1c2VRdWVyeShHRVRfVVNFUl9FWFBFTlNFUyk7XG5cbiAgaWYgKGxvYWRpbmcpIHJldHVybiBcIkdldHRpbmcgRGF0YS4uLlwiO1xuICBpZiAoIWRhdGEpIHJvdXRlci5wdXNoKFwiL2FkZEV4cGVuc2VcIik7XG4gIGlmIChlcnJvcikgcmV0dXJuIGBTdWJtaXNzaW9uIGVycm9yISAke2Vycm9yLm1lc3NhZ2V9YDtcblxuICAvLyBjb25zdCB1c2VyRGF0YSA9IGRhdGEuZXhwZW5zZXNbMF0uYXV0aG9yO1xuICBjb25zdCBleHBlbnNlc0RhdGEgPSBkYXRhLmV4cGVuc2VzLm1hcCgoZXhwZW5zZSkgPT4ge1xuICAgIHJldHVybiAoXG4gICAgICA8RXhwZW5zZUNhcmRcbiAgICAgICAga2V5PXtleHBlbnNlLmlkfVxuICAgICAgICBuYW1lPXtleHBlbnNlLm5hbWV9XG4gICAgICAgIGFtb3VudD17ZXhwZW5zZS5hbW91bnR9XG4gICAgICAgIGZyZXF1ZW5jeT17ZXhwZW5zZS5mcmVxdWVuY3l9XG4gICAgICAgIGRhdGVEdWU9e2V4cGVuc2UuZGF0ZUR1ZX1cbiAgICAgICAgaWQ9e2V4cGVuc2UuaWR9XG4gICAgICA+PC9FeHBlbnNlQ2FyZD5cbiAgICApO1xuICB9KTtcblxuICByZXR1cm4gKFxuICAgIDxtYWluXG4gICAgICBjbGFzc05hbWU9XCJjb250YWluZXIgYm94LWJvcmRlciBwLTIgc3BhY2UteS00XCJcbiAgICAgIHN0eWxlPXt7IG1heFdpZHRoOiBcIjc1MHB4XCIgfX1cbiAgICA+XG4gICAgICA8YnV0dG9uXG4gICAgICAgIGNsYXNzTmFtZT1cImJsb2NrIHRleHQtd2hpdGUgYmctYmx1ZS03MDAgaG92ZXI6YmctYmx1ZS04MDAgZm9jdXM6cmluZy00IGZvY3VzOm91dGxpbmUtbm9uZSBmb2N1czpyaW5nLWJsdWUtMzAwIGZvbnQtbWVkaXVtIHJvdW5kZWQtbGcgdGV4dC1zbSBweC01IHB5LTIuNSB0ZXh0LWNlbnRlciBkYXJrOmJnLWJsdWUtNjAwIGRhcms6aG92ZXI6YmctYmx1ZS03MDAgZGFyazpmb2N1czpyaW5nLWJsdWUtODAwXCJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgIGRhdGEtbW9kYWwtdG9nZ2xlPVwiZGVmYXVsdE1vZGFsXCJcbiAgICAgID48L2J1dHRvbj5cbiAgICAgIHsvKiA8VXNlckluZm8gZGF0YT17dXNlckRhdGF9IC8+ICovfVxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGZsZXgtY29sXCI+XG4gICAgICAgIDxCdXR0b24+XG4gICAgICAgICAge1wiIFwifVxuICAgICAgICAgIDxMaW5rIGhyZWY9e2AvYWRkRXhwZW5zZWB9PkFkZCBFeHBlbnNlIDwvTGluaz5cbiAgICAgICAgPC9CdXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwidy0zMDBweCBzcGFjZS15LTEwXCI+e2V4cGVuc2VzRGF0YX08L2Rpdj5cbiAgICA8L21haW4+XG4gICk7XG59XG4iXSwibmFtZXMiOlsiZ3FsIiwidXNlUXVlcnkiLCJVc2VySW5mbyIsIkV4cGVuc2VDYXJkIiwiQnV0dG9uIiwiTGluayIsInVzZVJvdXRlciIsIkdFVF9VU0VSX0VYUEVOU0VTIiwiQ29udGFpbmVyIiwicHJvcHMiLCJyb3V0ZXIiLCJsb2FkaW5nIiwiZXJyb3IiLCJkYXRhIiwicHVzaCIsIm1lc3NhZ2UiLCJleHBlbnNlc0RhdGEiLCJleHBlbnNlcyIsIm1hcCIsImV4cGVuc2UiLCJuYW1lIiwiYW1vdW50IiwiZnJlcXVlbmN5IiwiZGF0ZUR1ZSIsImlkIiwibWFpbiIsImNsYXNzTmFtZSIsInN0eWxlIiwibWF4V2lkdGgiLCJidXR0b24iLCJ0eXBlIiwiZGF0YS1tb2RhbC10b2dnbGUiLCJkaXYiLCJocmVmIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/container.js\n");

/***/ })

});