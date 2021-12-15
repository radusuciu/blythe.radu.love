import { Handler } from '@netlify/functions'
import { Guest } from '../../src/api/guest'
import { response, errorResponse } from '../utils/response'
import { getInvitees } from '../utils/inviteList'


function findGuest(name: string): Guest[] {
    const invitees = getInvitees()
    const matches = invitees.filter(i => i.name.toLowerCase().includes(name.toLowerCase()))

    // TODO: check if all of the matches have identical names
    // and if they do, we should handle that.. we need a disambiguation
    // field in the data to support this
    return matches
}


const handler: Handler = async (event, context) => {
    const query: string = event.queryStringParameters?.query

    if (!query) {
        return errorResponse('Query must be provided')
    }

    const matches = findGuest(query)

    if (matches.length === 1) {
        return response({
            guest: matches[0],
            uniqueMatch: true,
        })
    } else if (matches.length === 0) {
        return errorResponse('Guest not found', 404)
    }

    return response({
        uniqueMatch: false,
    })

}

export { handler };