"use strict";

// ../../netlify/functions/google-workspace.js
var { google } = require("googleapis");
exports.handler = async (event, context) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }
  try {
    const { projectId, taskId, taskData, userId, action } = JSON.parse(event.body);
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*"
        },
        body: JSON.stringify({ error: "User ID is required" })
      };
    }
    if (action === "update_task") {
      console.log(`Updating task ${taskId} for project ${projectId}`);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          success: true,
          message: "Task updated successfully",
          taskId,
          projectId
        })
      };
    }
    if (action === "upload_file") {
      console.log(`Uploading file for project ${projectId}`);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          success: true,
          message: "File uploaded successfully",
          projectId
        })
      };
    }
    if (action === "create_calendar_event") {
      console.log(`Creating calendar event for project ${projectId}`);
      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          success: true,
          message: "Calendar event created successfully",
          projectId
        })
      };
    }
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ error: "Invalid action specified" })
    };
  } catch (error) {
    console.error("Error in google-workspace function:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({
        error: "Internal server error",
        message: "Something went wrong while processing your request"
      })
    };
  }
};
//# sourceMappingURL=google-workspace.js.map
