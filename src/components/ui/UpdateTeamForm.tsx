'use client'

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "./form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAllSchoolsOptions, updateTeamOptions } from "@/lib/api/first_notifier/react_query_options";
import { Input } from "./input";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "./select";
import { Button } from "./button";
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Team } from "@/lib/api/first_notifier/schema_alias";

const updateFormSchema = z.object({
    name: z.string(),
    schoolId: z.coerce.number<number>().positive()
})

type UpdateTeamForm = z.infer<typeof updateFormSchema>

type Props = {
    team: Team
    submitSuccessAction?: () => void
}

export default function UpdateTeamForm({ team, submitSuccessAction }: Props) {

    const updateTeamForm = useForm<UpdateTeamForm>({
        resolver: zodResolver(updateFormSchema),
        defaultValues: {
            name: team.name,
            schoolId: team.schoolId
        }
    })

    const { data: schools } = useQuery(getAllSchoolsOptions())
    const updateTeamMutation = useMutation({
        ...updateTeamOptions(),
        onSuccess: () => {
            submitSuccessAction?.()
        }
    })

    //use parse so coersion of schema applies
    const currentValues = updateFormSchema.parse(updateTeamForm.watch())

    //TODO: this only works because the keys are the same between UpdateTeamForm and Team
    //change logic to by more type safe
    let shouldUpdate = Object.entries(currentValues).some(([key, value]) => team[key as keyof UpdateTeamForm] !== value)

    return (
        <Form {...updateTeamForm}>
            <form onSubmit={updateTeamForm.handleSubmit((values) => {
                if (shouldUpdate) {
                    updateTeamMutation.mutate({
                        teamNumber: team.teamNumber,
                        name: values.name === team.name ? undefined : values.name,
                        schoolId: values.schoolId === team.schoolId ? undefined : values.schoolId
                    })
                }
            })}>
                <FormField name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input type="text" {...field} />
                        </FormControl>
                    </FormItem>
                )}></FormField>
                <FormField name="schoolId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>School</FormLabel>
                        <Select defaultValue={team.schoolId.toString()} onValueChange={field.onChange}>
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a school"></SelectValue>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {schools?.map(s => <SelectItem key={s.id} value={s.id.toString()}>
                                    {s.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </FormItem>
                )}></FormField>
                <Button disabled={!shouldUpdate} type="submit">Submit</Button>
            </form>
        </Form>
    )
}