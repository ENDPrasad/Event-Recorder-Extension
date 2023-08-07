// popup.js

chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
    document.getElementById("start").addEventListener("click", function() {
        // chrome.tabs.executeScript({ file: '/content.js' });
        chrome.storage.sync.set({"recordedEvents": []})
        chrome.tabs.sendMessage(tabs[0].id, {todo: "start"})
    });

    document.getElementById("stop").addEventListener("click", function() {
        // Stop recording logic
        // chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        //     chrome.scripting.executeScript({
        //         target: { tabId: tabs[0].id },
        //         function: stopRecording
        //     });
        // });
        chrome.tabs.sendMessage(tabs[0].id, {todo: "stop"})
    
    });

    document.getElementById("playback").addEventListener("click", function() {

        chrome.tabs.sendMessage(tabs[0].id, {todo: "playback"})
    
    });
})





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
