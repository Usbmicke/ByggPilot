"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../netlify/functions/get-firebase-config.js
var get_firebase_config_exports = {};
__export(get_firebase_config_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(get_firebase_config_exports);
var import_secret_manager = require("@google-cloud/secret-manager");
var fetchSecret = async (secretClient, projectId, secretName) => {
  const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
  try {
    const [version] = await secretClient.accessSecretVersion({ name });
    return version.payload.data.toString();
  } catch (error) {
    console.error(`\u274C Failed to fetch secret: ${secretName}`, error.message);
    return null;
  }
};
var handler = async (event, context) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    // Ändra till din domän i produktion för ökad säkerhet
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, OPTIONS"
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: ""
    };
  }
  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: "Method not allowed",
        details: "Only GET requests are supported"
      })
    };
  }
  console.log("\u{1F527} Initializing Firebase config retrieval from Secret Manager");
  let credentials;
  if (!process.env.GOOGLE_CREDENTIALS) {
    console.error("\u274C GOOGLE_CREDENTIALS environment variable not found");
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Server configuration error",
        details: "Google credentials not configured"
      })
    };
  }
  try {
    credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    console.log("\u2705 Successfully parsed Google credentials");
  } catch (e) {
    console.error("\u274C Failed to parse GOOGLE_CREDENTIALS:", e.message);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Server configuration error",
        details: "Invalid credentials format"
      })
    };
  }
  try {
    const secretClient = new import_secret_manager.SecretManagerServiceClient({
      credentials,
      projectId: credentials.project_id
    });
    const projectId = credentials.project_id;
    console.log(`\u2705 Secret Manager client initialized for project: ${projectId}`);
    const secretsToFetch = [
      "FIREBASE_API_KEY",
      "FIREBASE_AUTH_DOMAIN",
      "FIREBASE_PROJECT_ID",
      "FIREBASE_STORAGE_BUCKET",
      "FIREBASE_MESSAGING_SENDER_ID",
      "FIREBASE_APP_ID"
    ];
    console.log("\u{1F50D} Fetching Firebase secrets:", secretsToFetch);
    const secretPromises = secretsToFetch.map(
      (secretName) => fetchSecret(secretClient, projectId, secretName)
    );
    const resolvedSecrets = await Promise.all(secretPromises);
    const failedSecrets = secretsToFetch.filter((name, index) => resolvedSecrets[index] === null);
    if (failedSecrets.length > 0) {
      console.error("\u274C Failed to retrieve secrets:", failedSecrets);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Failed to retrieve all necessary Firebase secrets",
          details: `Missing secrets: ${failedSecrets.join(", ")}`,
          missingSecrets: failedSecrets
        })
      };
    }
    const firebaseConfig = {
      apiKey: resolvedSecrets[0],
      authDomain: resolvedSecrets[1],
      projectId: resolvedSecrets[2],
      storageBucket: resolvedSecrets[3],
      messagingSenderId: resolvedSecrets[4],
      appId: resolvedSecrets[5]
    };
    const missingValues = Object.entries(firebaseConfig).filter(([key, value]) => !value || value.trim() === "").map(([key]) => key);
    if (missingValues.length > 0) {
      console.error("\u274C Firebase config has empty values:", missingValues);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: "Incomplete Firebase configuration",
          details: `Empty values for: ${missingValues.join(", ")}`,
          emptyFields: missingValues
        })
      };
    }
    console.log("\u2705 Successfully retrieved complete Firebase configuration");
    console.log(`   - API Key length: ${firebaseConfig.apiKey.length}`);
    console.log(`   - Auth Domain: ${firebaseConfig.authDomain}`);
    console.log(`   - Project ID: ${firebaseConfig.projectId}`);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        ...firebaseConfig,
        // Lägg till metadata för debugging
        _metadata: {
          retrievedAt: (/* @__PURE__ */ new Date()).toISOString(),
          project: projectId,
          secretsRetrieved: secretsToFetch.length
        }
      })
    };
  } catch (error) {
    console.error("\u274C Unexpected error in get-firebase-config:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : "Failed to retrieve Firebase configuration",
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      })
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=get-firebase-config.js.map
