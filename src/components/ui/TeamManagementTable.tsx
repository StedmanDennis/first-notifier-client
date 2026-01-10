import { getAllTeamPositionsOptions, getAllTeamsOptions, removeTeamOptions, updateTeamOptions } from "@/lib/api/first_notifier/react_query_options";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import ResourceTableActionColumn from "./ResourceTableActionColumn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import UpdateTeamDialog from "./UpdateTeamDialog";
import { Button } from "./button";
import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "./dialog";
import TeamFloorPlan from "./TeamFloorPlan";
import { Team } from "@/lib/api/first_notifier/schema_alias";

export default function TeamManagementTable() {
    const { data: teams } = useQuery(getAllTeamsOptions())
    const { data: positions } = useQuery(getAllTeamPositionsOptions())
    const removeTeamMutation = useMutation(removeTeamOptions())

    // Position state management (moved from page.tsx)
    const [clientPositions, setClientPositions] = useState(positions ?? [])

    // useEffect(() => {
    //     if (teams && positions.length === 0) {
    //         const initialPositions = teams.map((team, index) => ({
    //             teamNumber: team.teamNumber,
    //             x: 20 + (index % 7) * 60,
    //             y: 20 + Math.floor(index / 7) * 60
    //         }))
    //         setClientPositions(initialPositions)
    //     }
    // }, [teams, positions.length])

    const handlePositionChange = (teamNumber: string, x: number, y: number) => {
        setClientPositions(prev => {
            const existing = prev.find(p => p.teamNumber === teamNumber)
            if (existing) {
                return prev.map(p => p.teamNumber === teamNumber ? { ...p, x, y } : p)
            }
            return [...prev, { teamNumber, x, y }]
        })
    }

    const columnHelper = createColumnHelper<Team>()

    const table = useReactTable({
        data: teams ?? [],
        getCoreRowModel: getCoreRowModel(),
        columns: [
            columnHelper.accessor('teamNumber', {
                header: 'Team number'
            }),
            columnHelper.accessor('name', {
                header: 'Team name'
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: (props) => {
                    const team = props.row.original
                    return (
                        <ResourceTableActionColumn>
                            <UpdateTeamDialog
                                triggerElement={
                                    <Button className="bg-blue-600">Edit</Button>
                                }
                                team={props.row.original} />

                            <Button className="bg-red-600" onClick={() => removeTeamMutation.mutate(team.teamNumber)}>Delete</Button>
                        </ResourceTableActionColumn>)
                }
            })
        ]
    })

    const headers = table.getLeafHeaders().map((header) => (
        <TableHead key={header.id}>{flexRender(header.column.columnDef.header, header.getContext())}</TableHead>
    ))
    const rows = table.getRowModel().rows
    const isEmpty = !rows.length
    const body = isEmpty ?
        <TableRow>
            <TableCell colSpan={table.getVisibleLeafColumns().length} className='h-24 text-center'>No data</TableCell>
        </TableRow> :
        rows.map((row) => <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
            ))}
        </TableRow>)

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button>Floor Plan</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[900px]">
                        <DialogHeader>
                            <DialogTitle>Team Floor Plan</DialogTitle>
                        </DialogHeader>
                        <div className="flex justify-center py-4">
                            {teams ? (
                                <TeamFloorPlan
                                    teams={teams}
                                    positions={clientPositions}
                                    onPositionChange={handlePositionChange}
                                    width={400}
                                    height={400}
                                    gridSize={20}
                                />
                            ) : (
                                <div>Loading...</div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        {headers}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {body}
                </TableBody>
            </Table>
        </div>
    )
}