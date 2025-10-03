export async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    alert("Push notifications are not supported in this browser.");
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    alert("Please enable notifications to get reminders.");
    return null;
  }

  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      "<YOUR_PUBLIC_VAPID_KEY>"
    )
  });

  // TODO: Send subscription to your backend to store
  await fetch("/api/save-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subscription)
  });

  console.log("Push subscription:", subscription);
  return subscription;
}

// Helper to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  return new Uint8Array([...rawData].map(char => char.charCodeAt(0)));
}

export function scheduleNotification(todo: { id: number; title: string; dueDate?: string }) {
  if (!todo.dueDate) return;

  const dueTime = new Date(todo.dueDate).getTime();
  const delay = dueTime - Date.now();

  if (delay > 0) {
    setTimeout(() => {
      new Notification("Todo Reminder", {
        body: todo.title,
        icon: "/icon-192.png"
      });
    }, delay);
  }
}