import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

type EchoInstance = Echo<'pusher'>

declare global {
  interface Window {
    Pusher: typeof Pusher
    Echo: EchoInstance | null
  }
}

window.Pusher = Pusher

let echoInstance: EchoInstance | null = null

export const initializeEcho = (token: string): EchoInstance => {
  if (echoInstance) {
    echoInstance.disconnect()
  }

  echoInstance = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    },
  })

  window.Echo = echoInstance
  return echoInstance
}

export const disconnectEcho = (): void => {
  if (echoInstance) {
    echoInstance.disconnect()
    echoInstance = null
    window.Echo = null
  }
}

export const getEcho = (): EchoInstance | null => echoInstance
