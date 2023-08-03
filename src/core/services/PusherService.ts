import Pusher from "pusher-js";

const PusherService = new Pusher("92c600a43daf945fe9f2", {
  cluster: "eu",
});

export default PusherService;
