"use client"

import { useEffect, useState } from "react";

export default function Home() {
  const [events, setEvents] = useState<String[]>([])
  const [clientType, setClientType] = useState<String>("queuer")//queuer,team_associate,head_queuer

  useEffect(() => {
    const notificationSource = new EventSource(`${process.env.NEXT_PUBLIC_api_base}/notifications/serverSentEvents`);
    notificationSource.addEventListener("message", (event) => {
      const { assignedQueuerId, teamNumber, previousQueuerId, matchOrder } = JSON.parse(event.data)
      const clientQueuerId = 1
      const isClientEvent = assignedQueuerId == clientQueuerId || previousQueuerId == clientQueuerId
      const isUnassignment = (!isClientEvent && assignedQueuerId == null) || (isClientEvent && previousQueuerId == clientQueuerId)
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
  }, [events])

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./sw.js")
    }

    (async () => {
      if (Notification.permission !== 'granted') {
        await Notification.requestPermission()
      }
      if (Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.getRegistration()
        const pushManager = registration?.pushManager
        let subscription = await pushManager?.getSubscription()
        if (subscription === null || subscription === undefined) {
          subscription = await pushManager?.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_web_push_public_key
          })
        }
        //this will send redundant requests to the server, but will guarantee subscriptions are recorded on server
        if (subscription !== null && subscription !== undefined) {
          await fetch(`${process.env.NEXT_PUBLIC_api_base}/notifications/webPush/subscribe`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(subscription)
          })
        }
      }
    })()
  }, [])

  return (
    <div>
      {events.length == 0 ? "No events sent" : events.map((message, index) => <div key={index}>{message}</div>)}
    </div>
  );
}
