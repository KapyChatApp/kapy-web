import PusherClient from "pusher-js";

let pusherInstance: PusherClient | null = null;

export const getPusherClient = () => {
  if (!pusherInstance) {
    pusherInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
      cluster: process.env.PUSHER_APP_CLUSTER!,
      authEndpoint: process.env.BASE_URL + "pusher/auth"
    });

    console.log("Pusher connected");
  }
  return pusherInstance;
};
