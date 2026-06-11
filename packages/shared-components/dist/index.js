// ../../packages/shared-components/src/index.tsx
import React from "react";
function HomeWidget({ userName = "Usu\xE1rio" }) {
  function handleClick() {
    window.dispatchEvent(new CustomEvent("mfe:action", { detail: { from: "shared-home", time: Date.now() } }));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { padding: 16, border: "1px solid #ddd", borderRadius: 8 } }, /* @__PURE__ */ React.createElement("h2", { style: { margin: 0 } }, "Ol\xE1, ", userName, " \u2014 Shared Home Widget"), /* @__PURE__ */ React.createElement("p", { style: { marginTop: 8, marginBottom: 8 } }, "Este componente \xE9 extra\xEDdo para `packages/shared-components` e pode ser usado tanto pelo Next app quanto pelo MFE."), /* @__PURE__ */ React.createElement("button", { onClick: handleClick, style: { padding: "8px 12px", borderRadius: 6 } }, "Emitir evento"));
}
export {
  HomeWidget as default
};
//# sourceMappingURL=index.js.map
