import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("localQuizDesktop", {
  platform: process.platform,
});
