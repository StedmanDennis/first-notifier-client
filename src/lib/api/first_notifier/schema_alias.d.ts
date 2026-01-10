import { components } from "@/lib/api/first_notifier/first_notifier.api";

export type Team = components['schemas']['GetTeamsQueryResult']
export type School = components['schemas']['GetAllSchoolsQueryResult']
export type TeamPosition = components['schemas']['GetTeamPositionsQueryResult']
