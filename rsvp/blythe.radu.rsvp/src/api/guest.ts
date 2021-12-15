import { mande } from 'mande'

const api = mande('/api')

export interface Guest {
    id: string
    name: string
    partyName?: string
    party?: any
    hasPlusOne?: boolean
}

export interface GuestResponse {
    id: string
    isComing: boolean
    isBringingPlusOne?: boolean
    plusOneName?: string
    responseBy?: string
    dietaryRestrictions?: string
}


export function getGuest(guestId: string) {
    if (guestId) {
        return api.get('getGuest', { query: { guestId: guestId } })
    }
    
    return Promise.resolve()
}

export function findGuest(query: string) {
    if (query) {
        return api.get('findGuest', { query : { query } })
    }

    return Promise.resolve()
}


export function recordResponse(guestResponses: GuestResponse[]) {
    if (guestResponses) {
        return api.post('recordResponse', { body: guestResponses })
    }

    return Promise.resolve()
}
