"use client"

import { useEffect, useState } from "react";

export default function Home() {
  const [events, setEvents] = useState<String[]>([])
  const [clientType, setClientType] = useState<String>("queuer")//queuer,team_associate,head_queuer

  useEffect(() => {
    const notificationSource = new EventSource(`${process.env.NEXT_PUBLIC_api_base}/notifications`);
    notificationSource.addEventListener("queuer_assigned", (event) => {
      const { assignedQueuerId, teamNumber, previousQueuerId, matchOrder } = JSON.parse(event.data) as { matchOrder: number, teamNumber: string, assignedQueuerId?: number, previousQueuerId?: number }
      const clientQueuerId = 1
      const isClientEvent = assignedQueuerId == clientQueuerId || previousQueuerId == clientQueuerId
      const isUnassignment = assignedQueuerId == null || assignedQueuerId == null
      let message_part_1 = ''
      let message_part_2 = ''
      if (isClientEvent) {
        message_part_1 = "You have been"
      } else {
        message_part_1 = `Queuer ${isUnassignment ? previousQueuerId : assignedQueuerId} has been`
      }
      if (isUnassignment) {
        message_part_2 = `unassigned from team ${teamNumber} for match ${matchOrder}`
      } else {
        message_part_2 = `assigned to team ${teamNumber} for match ${matchOrder}`
      }
      setEvents([...events, `${message_part_1} ${message_part_2}`])
    })
    return () => notificationSource.close()
  })

  return (
    <div>
      {events.length == 0 ? "No events sent" : events.map((message, index) => <div key={index}>{message}</div>)}
    </div>
  );
}
