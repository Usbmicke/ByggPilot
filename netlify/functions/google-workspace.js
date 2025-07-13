const { google } = require('googleapis');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { projectId, taskId, taskData, userId, action } = JSON.parse(event.body);

    // Basic validation
    if (!userId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'User ID is required' }),
      };
    }

    // Here you would typically:
    // 1. Verify the user's authentication token
    // 2. Get the user's Google OAuth tokens from your database
    // 3. Use those tokens to authenticate with Google APIs

    // For now, we'll return a success response
    // In a full implementation, you would:

    if (action === 'update_task') {
      // Example: Update a Google Sheets row
      // const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
      // await sheets.spreadsheets.values.update({...});
      
      console.log(`Updating task ${taskId} for project ${projectId}`);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'Task updated successfully',
          taskId,
          projectId
        }),
      };
    }

    if (action === 'upload_file') {
      // Example: Upload file to Google Drive
      // const drive = google.drive({ version: 'v3', auth: oAuth2Client });
      // await drive.files.create({...});
      
      console.log(`Uploading file for project ${projectId}`);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'File uploaded successfully',
          projectId
        }),
      };
    }

    if (action === 'create_calendar_event') {
      // Example: Create Google Calendar event
      // const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
      // await calendar.events.insert({...});
      
      console.log(`Creating calendar event for project ${projectId}`);
      
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          success: true,
          message: 'Calendar event created successfully',
          projectId
        }),
      };
    }

    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ error: 'Invalid action specified' }),
    };

  } catch (error) {
    console.error('Error in google-workspace function:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error: 'Internal server error',
        message: 'Something went wrong while processing your request'
      }),
    };
  }
};
