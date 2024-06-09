import clock from "clock";
import document from "document";
import { preferences } from "user-settings";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import { me as appbit } from "appbit";
import { today as UserActivity } from "user-activity";

const zeroPad = (i) => {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

// Animate background image
const animationElement = document.getElementById("backgroundAnimation");
animationElement.animate("enable");

// Date, time and steps
const dateElement = document.getElementById("date");
const timeElement = document.getElementById("time");
const stepsElement = document.getElementById("steps");

const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
clock.granularity = "minutes";
clock.ontick = (e) => {
    const today = e.date;
    dateElement.text = `${today.getDate()} ${months[today.getMonth()]}`;

    const hours = today.getHours();
    const formattedHours = preferences.clockDisplay === "12h"
        ? hours % 12 || 12
        : hours = zeroPad(hours);
    const minutes = zeroPad(today.getMinutes());
    timeElement.text = `${formattedHours}:${minutes}`

    if (appbit.permissions.granted("access_activity")) {
        stepsElement.text = UserActivity.adjusted.steps;
    }
}

// Heart rate monitor
const hrmElement = document.getElementById("hrm");

let hrm;
if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
    hrm = new HeartRateSensor({ frequency: 1 });
    hrm.addEventListener("reading", () => {
        if (hrm.heartRate) {
            hrmElement.text = hrm.heartRate;
        } else {
            hrmElement.text = "--";
        }
    });

    display.addEventListener("change", () => {
        if (display.on) {
            hrm.start();
        } else {
            hrm.stop();
        }
    });
    hrm.start();
}

let body;
if (BodyPresenceSensor && appbit.permissions.granted("access_activity")) {
    body = new BodyPresenceSensor();
    body.addEventListener("reading", () => {
        if (body.present) {
            hrm.start();
        } else {
            hrm.stop();
        }
    });
    body.start();
}