/*
  Returns the Heart Rate BPM, with off-wrist detection.
  Callback raised to update your UI.
*/
import { me } from "appbit";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { BodyPresenceSensor } from "body-presence";
import { user } from "user-profile";

let hrm, body, watchID, hrmCallback;
let heartRate;

export function initialize(callback) {
  if (me.permissions.granted("access_heart_rate") && me.permissions.granted("access_user_profile")) {
    hrmCallback = callback;
    hrm = new HeartRateSensor();

    if (BodyPresenceSensor) {
      body = new BodyPresenceSensor();
      body.addEventListener("reading", heartRateChangeEvent);
      body.start();
    }

    display.addEventListener("change", heartRateChangeEvent);
    start();
  } else {
    console.log("Denied Heart Rate or User Profile permissions");
    callback({
      bpm: "",
      zone: "denied",
      restingHeartRate: ""
    });
  }
}

const getReading = () => {
  console.log("getReading");
  console.log(`body present: ${body.present ? "yes" : "no"}`);
  console.log(`display on: ${display.on ? "yes" : "no"}`);
  console.log(`heartRate: ${hrm.heartRate}`);
  heartRate = hrm.heartRate || "--";
  hrmCallback({
    bpm: heartRate,
    zone: user.heartRateZone(hrm.heartRate || 0),
    restingHeartRate: user.restingHeartRate
  });
}

const heartRateChangeEvent = () => {
  const changeEvent = body.present && display.on ? start : stop;
  changeEvent();
}

const start = () => {
  console.log("----- START -----");
  if (!watchID) {
    hrm.start();
    getReading();
    watchID = setInterval(getReading, 1000);
  }
}

const stop = () => {
  console.log("----- STOP -----");
  hrm.stop();
  clearInterval(watchID);
  watchID = null;
}
