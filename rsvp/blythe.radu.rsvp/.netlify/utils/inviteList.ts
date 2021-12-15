import fs from 'fs'
import { GoogleSpreadsheet } from 'google-spreadsheet'

const path = '../data/invitees.json'
const INVITE_LIST_SHEET_TITLE = 'Invite List'


async function generateInvitees() {
    const doc = new GoogleSpreadsheet(process.env.INVITE_SHEET_ID);

    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByTitle[INVITE_LIST_SHEET_TITLE]
    const rows = await sheet.getRows()

    const invitees = rows.map((row) => {
        return {
            id: row.id,
            name: `${row.firstName} ${row.lastName}`,
            partyName: row.partyName, 
        }
    })

    console.log(sheet.title);
    console.log(sheet.rowCount);
}


export function getInvitees() {
    if (!fs.existsSync(path)) {
        generateInvitees()
    }

    return require(path)
}
