interface Team {
    teamNumber: string
    name: string
    schoolId: number
}

interface School {
    id: number
    name: string
}

interface TeamPosition {
    teamNumber: string
    x: number
    y: number
}

interface UpdateTeamRequest {
    teamNumber: string
    name?: string
    schoolId?: number
}