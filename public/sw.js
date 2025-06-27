self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installed");
});

self.addEventListener('push', (event) => {
  const notificationIconPath = '/favicon-96x96.png'    
  const defaultNotificationOptions = {
    icon: notificationIconPath,
    badge: notificationIconPath,
  }

  const data = event.data.json()

  if (data.notificationType == 'queuer_assigned'){
    const { assignedQueuerId, teamNumber, previousQueuerId, matchOrder } = data
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

    event.waitUntil(self.registration.showNotification("Queuing Assignment Update", {body: `${message_part_1} ${message_part_2}`, ...defaultNotificationOptions}))
    }
})
 
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
})