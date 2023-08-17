chrome.storage.onChanged.addListener((changes, namespace) => {
  // set a badge
  updateBadge();
  // set badge color
  chrome.action.setBadgeBackgroundColor({
    color: "#96B6C5",
  });
});

// For Badge
const updateBadge = () => {
  chrome.storage.sync.get("isRecording", (events) => {
    let txt = "";
    if (events.isRecording) {
      txt = "ON";
    } else {
      txt = "OFF";
    }
    chrome.action.setBadgeText({
      text: txt,
    });
  });
};

updateBadge();
