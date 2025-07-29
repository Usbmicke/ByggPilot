// src/app/api/create-drive-structure/route.ts
import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import admin from '../../../lib/firebaseAdmin';

async function createFolder(drive: any, name: string, parentId?: string) {
    const fileMetadata = {
        name,
        mimeType: 'application/vnd.google-apps.folder',
        ...(parentId && { parents: [parentId] }),
    };
    try {
        const file = await drive.files.create({
            requestBody: fileMetadata,
            fields: 'id',
        });
        console.log(`Folder created with ID: ${file.data.id}`);
        return file.data.id;
    } catch (err) {
        console.error(`Error creating folder "${name}":`, err);
        throw err;
    }
}


export async function POST(req: Request) {
  try {
    // 1. Verifiera användarens token
    const authToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedToken = await admin.auth().verifyIdToken(authToken);
    const user = await admin.auth().getUser(decodedToken.uid);
    const companyName = user.displayName || 'Okänt Företag';

    // 2. Skapa en autentiserad Google Drive-klient
    // Denna logik fungerar nu både lokalt och i produktion.
    const auth = new google.auth.GoogleAuth({
        // Använd servicekontot från .env.local för att explicit ange projektet
        credentials: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON as string),
        scopes: ['https://www.googleapis.com/auth/drive'],
    });
    const drive = google.drive({ version: 'v3', auth });

    // 3. Skapa mappstrukturen
    console.log("Starting to create folder structure...");
    const rootFolderName = `ByggPilot - ${companyName}`;
    const rootFolderId = await createFolder(drive, rootFolderName);

    if (!rootFolderId) {
        throw new Error("Could not create root folder.");
    }

    // Skapa huvudmappar
    await createFolder(drive, '01_Kunder & Anbud', rootFolderId);
    await createFolder(drive, '02_Pågående Projekt', rootFolderId);
    await createFolder(drive, '03_Avslutade Projekt', rootFolderId);
    const templatesFolderId = await createFolder(drive, '04_Företagsmallar', rootFolderId);
    const accountingFolderId = await createFolder(drive, '05_Bokföringsunderlag', rootFolderId);

    // Skapa mallfiler (tomma filer som exempel)
    if (templatesFolderId) {
        await drive.files.create({ requestBody: { name: 'Mall - Offert', parents: [templatesFolderId] } });
        await drive.files.create({ requestBody: { name: 'Mall - Faktura', parents: [templatesFolderId] } });
    }
    
    // Skapa bokföringsstruktur
    if (accountingFolderId) {
        const yearFolderId = await createFolder(drive, '2025', accountingFolderId);
        if (yearFolderId) {
            await createFolder(drive, 'Q1_Kvitton', yearFolderId);
            await createFolder(drive, 'Q2_Kvitton', yearFolderId);
            await createFolder(drive, 'Q3_Kvitton', yearFolderId);
            await createFolder(drive, 'Q4_Kvitton', yearFolderId);
        }
    }

    console.log("Folder structure created successfully!");
    return NextResponse.json({ success: true, message: 'Mappstruktur skapad!', rootFolderId });

  } catch (error: any) {
    console.error('Error creating folder structure:', error);
    return NextResponse.json({ error: 'Failed to create folder structure', details: error.message }, { status: 500 });
  }
}
