import { mutationOptions, queryOptions } from "@tanstack/react-query"

const baseURL = process.env.NEXT_PUBLIC_api_base

export function getAllTeamsOptions() {
    return queryOptions({
        queryKey: ['getAllTeams'],
        queryFn: async () => {
            const response = await fetch(`${baseURL}/event/teams`)
            return response.json() as Promise<Team[]>
        }
    })
}

export function updateTeamOptions() {
    return mutationOptions({
        mutationKey: ['updateTeam'],
        mutationFn: async (body: UpdateTeamRequest) => {
            const response = await fetch(`${baseURL}/event/team`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })
            return response
        }
    })
}

export function removeTeamOptions() {
    return mutationOptions({
        mutationKey: ['removeTeam'],
        mutationFn: async (teamNumber: string) => {
            const response = await fetch(`${baseURL}/event/team/${teamNumber}`, {
                method: 'DELETE'
            })
            return response
        }
    })
}

export function getAllSchoolsOptions() {
    return queryOptions({
        queryKey: ['getAllSchools'],
        queryFn: async () => {
            const response = await fetch(`${baseURL}/event/schools`)
            return response.json() as Promise<School[]>
        }
    })
}