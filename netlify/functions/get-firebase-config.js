// netlify/functions/get-firebase-config.js
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

// En hjälpfunktion för att hämta EN hemlighet
const fetchSecret = async (secretClient, projectId, secretName) => {
  }
};

exports.handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*', // Ändra till din domän i produktion för ökad säkerhet

