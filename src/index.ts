import "reflect-metadata";
import { initStorage, modStorage, syncStorage } from "modules/storage";
import { loadRemoteControl } from "modules/remoteControl";
import { loadSettingsMenu } from "modules/settingsMenu";
import { loadDeviousPadlock } from "modules/deviousPadlock";
import { isVersionNewer, bootstrap, ModData, waitFor, MOD_DATA } from "zois-core";
import { toastsManager } from "zois-core/toasts";
import { messagesManager } from "zois-core/messaging";
import { version } from "../package.json";
import { DeviousPadlockSubscreen } from "./subscreens/deviousPadlockSubscreen";
import { MainSubscreen } from "subscreens/mainSubscreen";
import { RemoteControlSubscreen } from "subscreens/remoteControlSubscreen";
import { ProfilesSubscreen } from "subscreens/profilesSubscreen";
import { GITHUB_REPO_URL } from "./constants";
import { loadDialogs } from "modules/dialogs";
import { logger } from "zois-core/logging";
import { getText } from "zois-core/localization";
import changelog from "../changelog.json";

let hasInitialized = false;

bootstrap({
    name: "DOGS修復版",
    fullName: "DOGS修復版（Devious Obligate Great Stuff）",
    key: "DOGS",
    version,
    repository: GITHUB_REPO_URL,
    fontFamily: CommonGetFontName(),
    subscreens: {
        DeviousPadlockSubscreen,
        ProfilesSubscreen,
        MainSubscreen,
        RemoteControlSubscreen
    },
    localization: {
        locales: {
            default: "en",
            supported: ["en", "ru"]
        },
        translationsFolderPath: IS_DEV ? `http://localhost:8000/localization` : "https://furryzoi.github.io/Devious-Obligate-Great-Stuff/localization"
    },
    changelog: {
        data: changelog as NonNullable<ModData["changelog"]>["data"]
    },
    onReady: initializeDOGS
});

function initializeDOGS(): void {
    if (hasInitialized) return;
    hasInitialized = true;

    initStorage();
    loadSettingsMenu();
    loadDialogs();
    loadRemoteControl();
    void loadDeviousPadlock().catch((error) => {
        logger.error("Failed to initialize DOGS padlock:", error);
    });
    logger.log(`Ready! v${version}`);
    toastsManager.success({
        title: getText(`toasts.mod_loaded`, { name: "DOGS修復版" }),
        message: `v${version}`,
        duration: 4000
    });

    if (isVersionNewer(MOD_DATA.version, modStorage.version)) {
        waitFor(() => !!document.getElementById("InputChat")).then(() => {
            modStorage.version = version;
            syncStorage();
            const text = document.createElement("p");
            text.style.margin = "0";
            text.append("DOGS was updated ");
            const updateLink = document.createElement("a");
            updateLink.href = "https://github.com/Latte-maker/Devious-Obligate-Great-Stuff/raw/refs/heads/main/dogs-2.3.26.user.js";
            updateLink.target = "_blank";
            updateLink.rel = "noopener";
            updateLink.textContent = "click here to update";
            text.append(updateLink);
            messagesManager.sendLocal(text);
        });
    }
}




