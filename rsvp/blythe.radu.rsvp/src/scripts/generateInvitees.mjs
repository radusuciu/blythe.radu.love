import { getSheet } from '../../.netlify/utils/getSheet.mjs'
import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

const INVITEES_JSON_PATH = '.netlify/data/invitees.json'
const INVITE_LIST_SHEET_TITLE = 'Invite List'


async function generateInvitees() {
    const sheet = await getSheet(INVITE_LIST_SHEET_TITLE)
    const rows = await sheet.getRows()

    const invitees = rows.map((row) => {
        return {
            id: row.id,
            name: [row.firstName, row.middleName, row.lastName].filter(n => n).join(' '),
            fullName: [row.firstName, row.fullFirstName, row.middleName, row.lastName].filter(n => n).join(' '),
            firstName: row.firstName,
            fullFirstName: row.fullFirstName,
            middleName: row.middleName,
            lastName: row.lastName,
            partyName: row.partyName,
            hasPlusOne: row.hasPlusOne?.trim().toLowerCase() === 'yes',
        }
    })

    fs.writeFileSync(INVITEES_JSON_PATH, JSON.stringify(invitees))
}

generateInvitees()
