import { Handler } from '@netlify/functions'
import { Guest } from '../../src/api/guest'
import { response, errorResponse } from '../utils/response'
import invitees from '../data/invitees.json'
import * as fuzzball from 'fuzzball'


// TODO: check if all of the matches have identical names
// and if they do, we should handle that.. we need a disambiguation
// field in the data to support this

function normalize(text: string) {
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

function findGuest(name: string) {
    const firstNames = invitees.map(i => normalize(i.firstName))
    const lastNames = invitees.map(i => normalize(i.lastName))
    const names = invitees.map(i => normalize(i.name))

    const normalized = normalize(name)

    const scores = invitees.map(i => {
        return {
            guest: i,
            score: 100 - fuzzball.partial_token_sort_ratio(name, i.fullName),
        }
    })

    const matches = scores.filter(s => s.score <= 15)
    // console.log(matches)
    // const matches = invitees.filter(i => i.name.toLowerCase().includes(name.toLowerCase()))

    // return matches.map(m => m.guest)

    return fuzzball.extract(name, invitees, {
        // scorer: (query, choice, options) => {
        //     return (
        //         fuzzball.partial_token_set_ratio(query, choice, options) +
        //         fuzzball.partial_token_sort_ratio(query, choice, options)
        //     ) / 2
        // },
        scorer: fuzzball.partial_token_similarity_sort_ratio,
        processor: choice => choice.fullName,
        cutoff: 80,
        returnObjects: true
    })
}


const handler: Handler = (event, context) => {
    const query: string = event.queryStringParameters?.query

    if (!query) {
        return errorResponse('Query must be provided')
    }

    const matches = findGuest(query)
    console.log(matches)

    if (matches.length === 1) {
        return response({
            guest: matches[0].choice,
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