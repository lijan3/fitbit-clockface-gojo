import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { initialize as initializeHRM } from "./hrm";

function zeroPad(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// Animate background image
const animationElement = document.getElementById("backgroundAnimation");
animationElement.animate("enable");

// Add time
const timeElement = document.getElementById("time");
clock.granularity = "minutes";
clock.ontick = (e) => {
    const today = e.date;
    const hours = today.getHours();

    const formattedHours = preferences.clockDisplay === "12h"
        ? hours % 12 || 12
        : hours = zeroPad(hours);
    const minutes = zeroPad(today.getMinutes());
    timeElement.text = `${formattedHours}:${minutes}`
}

// Heart rate monitor
const hrmElement = document.getElementById("hrm");
initializeHRM((data) => {
    hrmElement.text = `${data.bpm}`;
    // if (data.zone === "out-of-range") {
    //   imgHRM.href = "images/heart_open.png";
    // } else {
    //   imgHRM.href = "images/heart_solid.png";
    // }
    // if (data.bpm !== "--") {
    //   iconHRM.animate("highlight");
    // }
});