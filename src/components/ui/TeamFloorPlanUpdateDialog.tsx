import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "./dialog";
import { Button } from "./button";
import TeamFloorPlan from "./TeamFloorPlan";

export default function TeamFloorPlanUpdateDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Floor Plan</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex justify-center py-4">Team Floor Plan</DialogTitle>
                </DialogHeader>
                <TeamFloorPlan />
            </DialogContent>
        </Dialog>
    )
}