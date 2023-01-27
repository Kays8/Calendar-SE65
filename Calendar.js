const LINENOTIFY_TOKEN = "xxxx";
//const WEEKDAY = ["อาทิตย์.", "จันทร์", "อังคาร", "พุธ", "พฤหัสบดี", "ศุกร์", "เสาร์"];

function LineNotify(message) {
  let url = "https://notify-api.line.me/api/notify";
  let options = {
    method: "post",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Authorization: `Bearer ${LINENOTIFY_TOKEN}`,
    },
    payload: `message=${message}`,
  };
  let response = UrlFetchApp.fetch(url, options);
  return JSON.parse(response.getContentText("UTF-8"));
}
function main_forNotify() {
  try {
    let nowDtime = new Date();
    let dtime =
      LanguageApp.translate(
        Utilities.formatDate(new Date(), "GMT+7", "dd MMM yyyy"),
        "en",
        "th"
      ) + "\n";
    let message = `วันนี้ ${dtime}`;

    let userMessage = "";
    let calendarList = CalendarApp.getAllCalendars();
    for (let i in calendarList) {
      let calendar = calendarList[i];
      let eventMessage = "";
      let eventList = calendar.getEventsForDay(nowDtime);
      for (let j in eventList) {
        let event = eventList[j];
        eventMessage += `" เวลา ${getEventTime(
          event.getStartTime()
        )}-${getEventTime(
          event.getEndTime()
        )}น. "\n${event.getTitle()}\n\t📟: ${event.getDescription()}\n`;
      }
      if (0 < eventMessage.length) {
        userMessage += eventMessage;
      }
    }
    if (0 < userMessage.length) {
      message += userMessage;
    } else {
      message += "วันหยุดแล้วนอนต่อดีกว่า ! ! !";
    }
    LineNotify(message);
  } catch (e) {
    console.error(e.stack);
  }
}

function getEventTime(str) {
  return Utilities.formatDate(str, "Asia/Bangkok", "HH:mm");
}
