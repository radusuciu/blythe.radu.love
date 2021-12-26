import { Handler } from '@netlify/functions'
import { Guest } from '../../src/api/guest'
import { response, errorResponse } from '../utils/response'
import invitees from '../data/invitees.json'
import * as fuzzball from 'fuzzball'
import { match } from 'assert'


// TODO: check if all of the matches have identical names
// and if they do, we should handle that.. we need a disambiguation
// field in the data to support this

// TODO: do something when user says they are not the person

const GOOD_SCORE_THRESHOLD = 80
const PERFECT_SCORE = 100
const NAME_MATCH_SCORE_THRESHOLD = 70
const FUZZY_SCORER = fuzzball.partial_token_similarity_sort_ratio


function normalize(text: string) {
    // TODO: try and use findGuest.find_process for this?
    // TODO: maybe keep unicode characters in there
    return text.toLowerCase().split(' ').join(' ').replace(/[^\w ]+/, '')
}

function distanceSetRatio(s1: string, s2: string): number  {
    return 100 - fuzzball.token_set_ratio(s1, s2)
}

function distanceJoinRatio(s1: string, s2: string): number {
    return 100 - fuzzball.ratio(s1.replace(' ', ''), s2.replace(' ', ''))
}

function distance(s1: string, s2: string): number {
    return Math.min(
        distanceSetRatio(s1, s2),
        distanceJoinRatio(s1, s2),
    )
}

function countNamesWithPrefix(normalizedName: string, normalizedNameList: string[]): number {
    return normalizedNameList.find(n => n.startsWith(normalizedName)).length
}



function matchGuestsByNameStartingWith(name: string): { firstName: boolean, lastName: boolean, matches: Guest[] } {
    const normalized = normalize(name)

    const firstNameMatches = invitees.filter(i => {
        return (
            normalize(i.firstName).startsWith(normalized) ||
            normalize(i.fullFirstName).startsWith(normalized)
        )
    })

    const lastNameMatches = invitees
        .filter(i => normalize(i.lastName).split(' ').some(
            n => n.startsWith(normalized)
        ))

    return {
        firstName: firstNameMatches.length === 1,
        lastName: lastNameMatches.length === 1,
        matches: [ ...firstNameMatches, ...lastNameMatches ],
    }
}

function getUniqueMatch(name: string): Guest | undefined {
    const matches = matchGuestsByNameStartingWith(name)
 
    // if it's a unique first or last name
    if (matches.matches.length === 1 && (
            (matches.firstName && !matches.lastName) ||
            (!matches.firstName && matches.lastName)
        )
    ) {
        return matches.matches[0]
    }
}

function getFuzzyMach(name: string): Guest[] {
    const fuzzyMatches = fuzzball.extract(name, invitees, {
        scorer: FUZZY_SCORER,
        processor: choice => choice.fullName,
        cutoff: 50,
        returnObjects: true,
        useCollator: true,
    })

    let goodMatches = fuzzyMatches.filter(m => m.score >= GOOD_SCORE_THRESHOLD)

    if (goodMatches.length > 1) {
        const perfectMatches = goodMatches.filter(m => m.score === PERFECT_SCORE)
        if (perfectMatches.length === 1) {
            goodMatches = [perfectMatches[0]]
        }
    }

    console.log(goodMatches)

    return goodMatches.map(m => m.choice)
}

function findGuest(name: string) {
    // TODO normalize name right away
    const normalizedish = name.trim().replace(/\s+/, ' ')
    const words = normalizedish.split(' ')

    if (words.length === 1) {
        const guestByName = getUniqueMatch(words[0])
        const scoreByName = FUZZY_SCORER(name, words[0])

        if (guestByName && scoreByName >= NAME_MATCH_SCORE_THRESHOLD) {
            console.log('guest by name')
            return [guestByName]
        }
    }

    return getFuzzyMach(name)
}


const handler: Handler = (event, context) => {
    const query: string = event.queryStringParameters?.query.trim()

    if (!query) {
        return errorResponse('Query must be provided')
    }

    let matches = findGuest(query)

    // TODO handle cases where all matches are equal?
    // this may be better to do on the client-side?
    if (matches.length === 1) {
        return response({
            guest: matches[0],
            uniqueMatch: true,
        })
    } else if (matches.length === 0) {
        // TODO: revisit this.. maybe we can do a second search 
        // with a looser requirement
        return errorResponse('Guest not found', 404)
    }

    return response({
        uniqueMatch: false,
        matches: matches,
    })
}

export { handler };
