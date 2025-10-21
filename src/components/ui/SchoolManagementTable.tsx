import { getAllSchoolsOptions, getAllTeamsOptions, removeTeamOptions, updateTeamOptions } from "@/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import ResourceTableActionColumn from "./ResourceTableActionColumn";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export default function SchoolManagementTable() {
    const { data: schools } = useQuery(getAllSchoolsOptions())

    const columnHelper = createColumnHelper<School>()

    const table = useReactTable({
        data: schools ?? [],
        getCoreRowModel: getCoreRowModel(),
        columns: [
            columnHelper.accessor('name', {
                header: 'Name'
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: (props) => {
                    const team = props.row.original
                    return (
                        <ResourceTableActionColumn>

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