
import { ReactElement, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "./dialog";
import UpdateTeamForm from "./UpdateTeamForm";


export default function UpdateTeamDialog({ triggerElement, team }: { triggerElement: ReactElement, team: Team }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {triggerElement}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Team</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Update details of team {team.teamNumber}
                </DialogDescription>
                <UpdateTeamForm team={team} submitSuccessAction={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}