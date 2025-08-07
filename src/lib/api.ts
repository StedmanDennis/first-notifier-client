import { queryOptions } from "@tanstack/react-query"

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