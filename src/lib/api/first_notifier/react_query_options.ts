import { mutationOptions, queryOptions } from "@tanstack/react-query"
import first_notifier_client from "./api_client"
import { components } from "./first_notifier.api"

export function getAllTeamsOptions() {
    return queryOptions({
        queryKey: ['getAllTeams'],
        queryFn: async () => (await first_notifier_client.GET('/api/event/teams')).data
    })
}

export function updateTeamOptions() {
    return mutationOptions({
        mutationKey: ['updateTeam'],
        mutationFn: async (body: components['schemas']['UpdateTeamRequest']) => (await first_notifier_client.PATCH('/api/event/team', { body })).data
    })
}

export function removeTeamOptions() {
    return mutationOptions({
        mutationKey: ['removeTeam'],
        mutationFn: async (teamNumber: string) => await first_notifier_client.DELETE('/api/event/team/{teamNumber}', { params: { path: { teamNumber } } })
    })
}

export function getAllSchoolsOptions() {
    return queryOptions({
        queryKey: ['getAllSchools'],
        queryFn: async () => (await first_notifier_client.GET('/api/event/schools')).data
    })
}

export function getAllTeamPositionsOptions() {
    return queryOptions({
        queryKey: ['getAllTeamPositions'],
        queryFn: async () => (await first_notifier_client.GET('/api/event/team/positions')).data
    })
}

export function updateTeamPositionsOptions() {
    return mutationOptions({
        mutationKey: ['updateTeamPositions'],
        mutationFn: async (body: components['schemas']['BatchUpdateTeamPositionsRequest']) => (await first_notifier_client.PATCH('/api/event/team/positions/update', { body })).data
    })
}