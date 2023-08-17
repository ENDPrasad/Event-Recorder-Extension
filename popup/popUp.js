// popup.js

// chrome.storage.sync.set({
//   recordedEvents: [],
//   isRecording: false,
// });

// {active: true, currentWindow: true}
chrome.tabs.query({ active: true }, (tabs) => {
  document.getElementById("start").addEventListener("click", function () {
    // chrome.tabs.executeScript({ file: '/content.js' });
    let title = document.getElementById("title").value;
    if (title) {
      chrome.storage.sync.set({
        recordedEvents: [{ eventType: "title", title: title }],
        isRecording: true,
        isPlayback: false,
      });
      chrome.tabs.sendMessage(tabs[0].id, { todo: "start", title: title });
    } else {
      alert("Enter title to proceed!!");
    }
  });

  document.getElementById("stop").addEventListener("click", function () {
    // Stop recording logic
    // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    //     chrome.scripting.executeScript({
    //         target: { tabId: tabs[0].id },
    //         function: stopRecording
    //     });
    // });

    chrome.tabs.sendMessage(tabs[0].id, { todo: "stop" });
    chrome.storage.sync.set({
      isRecording: false,
    });
  });

  document.getElementById("playback").addEventListener("click", function () {
    chrome.tabs.sendMessage(tabs[0].id, { todo: "playback" });
    chrome.storage.sync.set({
      isPlayback: true,
    });
  });
});

// document.getElementById("playback").addEventListener("click", function() {
//     // Playback logic
//     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//         chrome.scripting.executeScript({
//             target: { tabId: tabs[0].id },
//             function: playbackEvents
//         });
//     });
// });

// function stopRecording() {
//     console.log('Recording stopped. Recorded events:', recordedEvents);
//     recordedEvents = [];
// }

// function playbackEvents() {
//     console.log('Playback started.');
//     var events = recordedEvents;
//     for (var i = 0; i < events.length; i++) {
//         var event = events[i];
//         setTimeout(function(event) {
//             if (event.eventType === 'click') {
//                 document.querySelector(event.targetElement).click();
//             } else if (event.eventType === 'input') {
//                 document.querySelector(event.targetElement).value = event.inputValue;
//             }
//         }, event.timestamp - events[0].timestamp, event);
//     }
// }
