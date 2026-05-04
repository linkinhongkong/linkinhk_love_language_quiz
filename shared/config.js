// ============================================================
// config.js — environment detection and webhook URL builder.
// Loaded as a regular <script> before any code that calls n8n,
// so window.webhookUrl is defined before babel-transformed
// scripts (lib.js, components.js, etc.) execute.
// ============================================================
(function () {
  var host = (typeof location !== "undefined" && location.hostname) || "";

  // UAT hosts: any subdomain starting with "uat.", any *.pages.dev preview,
  // and localhost / 127.0.0.1 for local development.
  var isUat =
    host.indexOf("uat.") === 0 ||
    host.indexOf(".uat.") !== -1 ||
    host.indexOf("pages.dev") !== -1 ||
    host === "localhost" ||
    host === "127.0.0.1";

  var ENV = isUat ? "uat" : "prod";

  // Single n8n project hosts both environments; UAT workflows live alongside
  // prod and are distinguished by a "uat-" prefix on the webhook path.
  var N8N_BASE = "https://linkinhk.app.n8n.cloud/webhook";
  var PATH_PREFIX = ENV === "uat" ? "uat-" : "";

  window.LINKINHK_ENV = ENV;
  window.N8N_BASE = N8N_BASE;
  window.webhookUrl = function (name) {
    return N8N_BASE + "/" + PATH_PREFIX + name;
  };
})();
