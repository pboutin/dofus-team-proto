import { app, BrowserWindow } from "electron";
import settings from "electron-settings";
import path from "path";

type PositionSetting = { x: number; y: number } | undefined;

interface Context {
  debug: boolean;
  onOpenedCallbacks: Array<(browserWindow: BrowserWindow) => void>;
}

const WEB_PREFERENCES: Electron.WebPreferences = {
  nodeIntegration: true,
  contextIsolation: false,
};

let settingsBrowserWindow: BrowserWindow | null = null;
let dashboardBrowserWindow: BrowserWindow | null = null;

export const initializeWindows = ({ debug, onOpenedCallbacks }: Context) => {
  const openSettings = async () => {
    if (settingsBrowserWindow) {
      settingsBrowserWindow.show();
      return settingsBrowserWindow;
    }

    const position = (await settings.get(
      "settings:position"
    )) as PositionSetting;

    const browserWindow = new BrowserWindow({
      ...(position ?? {}),
      height: 600,
      width: 800,
      resizable: false,
      webPreferences: WEB_PREFERENCES,
      icon: path.join(__dirname, "../../build/icon.ico"),
    });

    browserWindow.loadFile("./settings.html");
    browserWindow.setMenu(null);
    browserWindow.on("closed", () => (settingsBrowserWindow = null));

    browserWindow.on("move", async () => {
      const { x, y } = browserWindow.getBounds();
      await settings.set("settings:position", { x, y });
    });

    if (debug) {
      browserWindow.on("ready-to-show", () => {
        browserWindow.webContents.openDevTools({ mode: "detach" });
      });
    }

    onOpenedCallbacks.forEach((callback) => callback(browserWindow));

    settingsBrowserWindow = browserWindow;
    return browserWindow;
  };

  const openDashboard = async () => {
    if (dashboardBrowserWindow) {
      dashboardBrowserWindow.show();
      return dashboardBrowserWindow;
    }

    const position = (await settings.get(
      "dashboard:position"
    )) as PositionSetting;

    const browserWindow = new BrowserWindow({
      ...(position ?? {}),
      height: 580,
      width: 600,
      resizable: false,
      webPreferences: WEB_PREFERENCES,
      icon: path.join(__dirname, "../../build/icon.ico"),
    });

    browserWindow.loadFile("./dashboard.html");
    browserWindow.setMenu(null);
    browserWindow.on("closed", () => app.quit());

    browserWindow.on("move", async () => {
      const { x, y } = browserWindow.getBounds();
      await settings.set("dashboard:position", { x, y });
    });

    if (debug) {
      browserWindow.on("ready-to-show", () => {
        browserWindow.webContents.openDevTools({ mode: "detach" });
      });
    }

    onOpenedCallbacks.forEach((callback) => callback(browserWindow));

    dashboardBrowserWindow = browserWindow;
    return browserWindow;
  };

  return {
    openSettings,
    openDashboard,
  };
};
