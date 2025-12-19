'use client'

import TeamManagementTable from "@/components/ui/TeamManagementTable"

export default function ManageTeams() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Team Management</h2>
                <p className="text-muted-foreground">
                    Manage teams and their floor plan positions.
                </p>
            </div>

            <TeamManagementTable />
        </div>
    )
}