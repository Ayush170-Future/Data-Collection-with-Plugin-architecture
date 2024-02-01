const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('../../credentials.json');

async function load(app) {
    
    let doc;
    async function start() {
        const SCOPES = [
            'https://www.googleapis.com/auth/spreadsheets', 
            'https://www.googleapis.com/auth/drive.file',
        ];

        const jwt = new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: SCOPES,
        });

        doc = new GoogleSpreadsheet('1sCgk5Fe6WaU99HRBhSKaN-NP0_2cp15j0LH3q-ooti0', jwt);
        await doc.loadInfo();

        // let sheet = await getSheetById(744028591);
        // console.log(sheet);
    }
    start();

    async function getSheetById(id) {
        return await doc._rawSheets[id];
    }

    app.on("FormCreated", async (details) => {
        const { questions } = details;
        const headers = questions.map((question) => question.questionText);
        sheet = await doc.addSheet({ headerValues: headers });
        console.log(sheet._rawProperties);
    })
}

function unload() {

}

module.exports = {load, unload};