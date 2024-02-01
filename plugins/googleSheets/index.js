const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('../../credentials.json');
const Sheet = require("./models/sheetModel");

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

        doc = new GoogleSpreadsheet(creds.sheet_id, jwt);
        await doc.loadInfo();
    }
    start();

    async function getSheetByFromId(formId) {
        const sheetDB = await Sheet.findOne({formId:formId});
        console.log(sheetDB.sheetId);
        return await doc.sheetsById[parseInt(sheetDB.sheetId)];
    }

    app.on("FormCreated", async (details) => {
        try {
            const { questions } = details;
            const headers = questions.map((question) => question.questionText);
            const sheet = await doc.addSheet({ headerValues: headers });
            const sheetId = sheet._rawProperties.sheetId;
            const sheetDB = new Sheet({formId: details._id, sheetId: sheetId});
            const result = sheetDB.save();
            console.log("Sheet Created")
        }
        catch (err) {
            console.log(err);
        }
    })

    app.on("ResponseGenerated", async (responseJSON, formId) => {
        try {
            console.log(responseJSON);
            await doc.loadInfo();
            const sheet = await getSheetByFromId(formId);
            await sheet.addRow(responseJSON);
            console.log("Row Added!")
        }
        catch (err) {
            console.log(err);
        }
    })
}

function unload() {

}

module.exports = {load, unload};