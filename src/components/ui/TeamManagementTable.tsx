import { getAllTeamsOptions, removeTeamOptions, updateTeamOptions } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import ResourceTableActionColumn from "./ResourceTableActionColumn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import UpdateTeamDialog from "./UpdateTeamDialog";
import { Button } from "./button";

export default function TeamManagementTable() {
    const { data: teams } = useQuery(getAllTeamsOptions())
    const updateTeamMutation = useMutation(updateTeamOptions())
    const removeTeamMutation = useMutation(removeTeamOptions())

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

    const openEdit = () => {

    }

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
    )
}