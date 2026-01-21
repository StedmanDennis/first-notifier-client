import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogHeader } from "./dialog";
import { Button } from "./button";
import TeamFloorPlan from "./TeamFloorPlan";

export default function TeamFloorPlanUpdateDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Floor Plan</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[900px]">
                <DialogHeader>
                    <DialogTitle className="flex justify-center py-4">Team Floor Plan</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center py-4">
                    <TeamFloorPlan />
                </div>
            </DialogContent>
        </Dialog>
    )
}