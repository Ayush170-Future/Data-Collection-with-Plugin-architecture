const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('../../credentials.json');
const Sheet = require("./models/sheetModel");
const logger = require('../../logger/index.js');

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
        const sheetDB = await Sheet.findOne({ formId: formId });
        logger.info(`Sheet ID for Form ID ${formId}: ${sheetDB.sheetId}`);
        return await doc.sheetsById[parseInt(sheetDB.sheetId)];
    }

    app.on("FormCreated", async (details) => {
        try {
            const { questions } = details;
            const headers = questions.map((question) => question.questionText);
            const sheet = await doc.addSheet({ headerValues: headers });
            const sheetId = sheet._rawProperties.sheetId;
            const sheetDB = new Sheet({ formId: details._id, sheetId: sheetId });

            const result = await sheetDB.save();
            if (!result) {
                logger.error(`Failed to save Sheet model for Form ID ${details._id} to the database`);
            } else {
                logger.info(`Sheet Created for Form ID ${details._id}. Sheet ID: ${sheetId}`);
            }
        } catch (err) {
            logger.error(err);
        }
    })

    app.on("ResponseGenerated", async (responseJSON, formId) => {
        try {
            await doc.loadInfo();
            const sheet = await getSheetByFromId(formId);
            await sheet.addRow(responseJSON);
            logger.info(`Row Added to Sheet ID ${sheet.sheetId} for Form ID ${formId}`);
        } catch (err) {
            logger.error(err);
            // In case of failure, re-initialize the 'doc' object
            // This is done to address potential issues related to an inconsistent 'doc' object with the Cloud Sheet.
            start();
        }
    })

    app.on("QuestionsAdded", async (questionsArray, formId) => {
        try {
            const sheet = await getSheetByFromId(formId);
            const headerRow = await sheet.getRows();
            // Getting the previous Headers for this Sheet and appending in the new Columns
            headerRow[0]._worksheet._headerValues.push(...questionsArray);
            console.log(headerRow[0]._worksheet._headerValues)
            await sheet.setHeaderRow(headerRow[0]._worksheet._headerValues);
            logger.info(`Headers updated with the Added questions in Sheet ID ${sheet.sheetId} for Form ID ${formId}`);
        } catch (err) {
            logger.error(err);
            // In case of failure, re-initialize the 'doc' object
            // This is done to address potential issues related to an inconsistent 'doc' object with the Cloud Sheet.
            start();
        }
    })
}

function unload() {
    logger.info("Google Sheet plugin unloaded");
}

module.exports = { load, unload };