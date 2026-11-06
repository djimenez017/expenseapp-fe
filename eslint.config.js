const nextCoreWebVitals = require("eslint-config-next/core-web-vitals");

module.exports = [
  {
    ignores: [".next/**", "node_modules/**", ".cursor/**", ".agents/**", ".opencode/**", ".codex/**"],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
];
