const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('./creds');

async function google() {
    const SCOPES = [
        'https://www.googleapis.com/auth/spreadsheets', 
        'https://www.googleapis.com/auth/drive.file',
    ];

    const jwt = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: SCOPES,
    });
    const doc = new GoogleSpreadsheet('1sCgk5Fe6WaU99HRBhSKaN-NP0_2cp15j0LH3q-ooti0', jwt);
    await doc.loadInfo();
    // await doc.updateProperties({ title: 'My Doc' });
    const sheet = await doc.addSheet({ headerValues: ['name', 'email'] });

    const larryRow = await sheet.addRow({ name: 'Larry Page', email: 'larry@google.com' });
    const moreRows = await sheet.addRows([
    { name: 'Sergey Brin', email: 'sergey@google.com' },
    { name: 'Eric Schmidt', email: 'eric@google.com' },
    ]);
}

google();
