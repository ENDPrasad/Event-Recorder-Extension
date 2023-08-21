// content.js

// Initialize array to store recorded events
var recordedEvents = [];
var testCaseTitle = "";

var isAssert = false;

const checkRecording = () => {
  chrome.storage.sync.get(
    ["isRecording", "recordedEvents", "isPlayback"],
    (events) => {
      if (events.isRecording) {
        testCaseTitle = events.recordedEvents[0].title;
        addListeners();
        console.log("recording....");
        console.log(events.recordedEvents);
      } else {
        removeListeners();
        console.log("Not recording..");
        console.log(events.recordedEvents);
      }

      if (events.isPlayback) {
        console.log("Playback started!!");
        playback();
      }
    }
  );
};

checkRecording();

// Adding listeners
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.todo === "start") {
    testCaseTitle = request.title;
    // addListeners();
    checkRecording();
  }
  if (request.todo === "stop") {
    // removeListeners();
    checkRecording();
    console.log("recording stopped!!");

    chrome.storage.sync.get("recordedEvents", (events) => {
      console.log(events.recordedEvents);
    });
  }
  if (request.todo === "playback") {
    console.log("Playback started");
    playback();
    // Clear the stored Data
    // chrome.storage.sync.clear(() => {
    //   console.log("Everything was removed");
    // });
  }
});

// To clear the local storage

// chrome.storage.local.clear(() => {
//     console.log('Everything was removed');
// });

const removeListeners = () => {
  document.removeEventListener("click", () => {
    console.log("event listeners removed!!");
  });

  document.removeEventListener("input", () => {
    console.log("event listeners removed!!");
  });
};

const addListeners = () => {
  recordedEvents = [];
  // URL changes
  //   window.addEventListener("navigate", (event) => {
  //     console.log(event);
  //     var updatedRecordedEvents = [];
  //     chrome.storage.sync.get("recordedEvents", (events) => {
  //       var eventInfo = {
  //         timestamp: Date.now(),
  //         eventType: "navigate",
  //         url: event.target.location.href,
  //         event: event,
  //       };
  //       updatedRecordedEvents = events.recordedEvents;
  //       updatedRecordedEvents.push(eventInfo);
  //       chrome.storage.sync.set({ recordedEvents: updatedRecordedEvents });
  //     });
  //   });

  // For selection text
  document.addEventListener("selectionchange", (event) => {
    var updatedRecordedEvents = [];
    var eventInfo = {};
    chrome.storage.sync.get(["recordedEvents", "isRecording"], (events) => {
      if (!events.isRecording) {
        return;
      }
      updatedRecordedEvents = events.recordedEvents;

      if (events.recordedEvents.length == 1) {
        updatedRecordedEvents.push({
          timestamp: Date.now(),
          eventType: "navigate",
          url: window.location.href,
        });
      }
      //   let XPathData = getElementXPath(event.target);
      //   console.log(
      //     events.recordedEvents[events.recordedEvents.length - 1].XPath
      //   );
      var currentSelection = window.getSelection().toString();
      var lastRecord = events.recordedEvents.slice(-1)[0];
      if (
        currentSelection.slice(1, currentSelection.length) == lastRecord.text
      ) {
        eventInfo = lastRecord;
        eventInfo.text = currentSelection;
        updatedRecordedEvents = events.recordedEvents.slice(
          0,
          events.recordedEvents.length - 1
        );
      } else {
        eventInfo = {
          timestamp: Date.now(),
          eventType: "assert",
          element: event.target,
          text: window.getSelection().toString(),
          event: event,
        };
      }
      updatedRecordedEvents.push(eventInfo);
      chrome.storage.sync.set({ recordedEvents: updatedRecordedEvents });
      isAssert = true;
    });
  });

  // For Selected text
  //   document.addEventListener("mouseup keyup selectionchange", (event) => {
  //     const selection = getSelectionText();
  //     if (selection) {
  //       var updatedRecordedEvents = [];
  //       chrome.storage.sync.get("recordedEvents", (events) => {
  //         updatedRecordedEvents = events.recordedEvents;
  //         var eventInfo = {
  //           timestamp: Date.now(),
  //           eventType: "assert",
  //           event: event,
  //           text: txt,
  //         };
  //         updatedRecordedEvents.push(eventInfo);
  //         chrome.storage.sync.set({ recordedEvents: updatedRecordedEvents });
  //       });
  //     }
  //   });

  // Event listener for inputs
  document.addEventListener("input", function (event) {
    var updatedRecordedEvents = [];
    var eventInfo = {};
    chrome.storage.sync.get(["recordedEvents", "isRecording"], (events) => {
      if (!events.isRecording) {
        return;
      }
      updatedRecordedEvents = events.recordedEvents;

      if (events.recordedEvents.length == 1) {
        updatedRecordedEvents.push({
          timestamp: Date.now(),
          eventType: "navigate",
          url: window.location.href,
        });
      }
      let XPathData = getElementXPath(event.target);
      //   console.log(
      //     events.recordedEvents[events.recordedEvents.length - 1].XPath
      //   );
      var lastRecord = events.recordedEvents.slice(-1)[0];
      if (String(XPathData.XPath) == String(lastRecord.XPath)) {
        eventInfo = lastRecord;
        eventInfo.inputValue = event.target.value;
        updatedRecordedEvents = events.recordedEvents.slice(
          0,
          events.recordedEvents.length - 1
        );
      } else {
        eventInfo = {
          timestamp: Date.now(),
          eventType: "input",
          targetElement: event.target.tagName,
          element: event.target,
          text: XPathData.text,
          inputValue: event.target.value,
          event: event,
          XPath: XPathData.XPath,
        };
      }
      updatedRecordedEvents.push(eventInfo);
      chrome.storage.sync.set({ recordedEvents: updatedRecordedEvents });
    });

    // window.addEventListener('hashchange', (event) =>{
    //     console.log(event)
    //     var updatedRecordedEvents = []
    //     chrome.storage.sync.get('recordedEvents', (events) => {
    //     var eventInfo = {
    //         timestamp: Date.now(),
    //         eventType: 'hashchange',
    //         newURL: event.target.location.href,
    //         event: event
    //     };
    //     updatedRecordedEvents = events.recordedEvents
    //     updatedRecordedEvents.push(eventInfo);
    //     chrome.storage.sync.set({'recordedEvents': updatedRecordedEvents})
    // })
    // })
  });

  // Event listener for clicks
  document.addEventListener("click", (event) => {
    var updatedRecordedEvents = [];
    chrome.storage.sync.get(["recordedEvents", "isRecording"], (events) => {
      if (!events.isRecording) {
        return;
      }
      updatedRecordedEvents = events.recordedEvents;
      var lastRecord = events.recordedEvents.slice(-1)[0];
      if (lastRecord.eventType == "assert" && isAssert) {
        isAssert = false;
        return;
      }

      if (events.recordedEvents.length == 1) {
        updatedRecordedEvents.push({
          timestamp: Date.now(),
          eventType: "navigate",
          url: window.location.href,
        });
      }
      let XPathData = getElementXPath(event.target);
      var eventInfo = {
        timestamp: Date.now(),
        eventType: "click",
        targetElement: event.target.tagName,
        element: event.target,
        text: XPathData.text,
        event: event,
        XPath: XPathData.XPath,
        inputValue: event.target.value ?? "",
      };
      updatedRecordedEvents.push(eventInfo);
      chrome.storage.sync.set({ recordedEvents: updatedRecordedEvents });
    });
  });
};

function saveFile(data, extension = "txt") {
  const fileName = `${data.title}.${extension}`;

  const textFileAsBlob = new Blob([data.data], { type: "text/plain" });
  const downloadLink = document.createElement("a");
  downloadLink.download = fileName;

  downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
  downloadLink.target = "_blank";
  downloadLink.click();

  return fileName;
}

function getDataInSteps(recordedSteps) {
  let data = "";
  let title = "";
  recordedSteps.forEach((element, index) => {
    // To get step numbers
    // if (index) data += index.toString() + ". " + element + "\n";
    if (index == 1) {
      title = element;
    }
    data += element + "\n";
  });
  return { data: data, title: title };
}

const playback = () => {
  chrome.storage.sync.get("recordedEvents", (events) => {
    recordedSteps = [];
    var testData = [
      "------------------------",
      "        Test Data",
      "------------------------",
    ];
    events.recordedEvents.forEach((element, index) => {
      // console.log(element.event.target.innerText)
      // setTimeout(() => {
      //     if(element.eventType === "click"){
      //         // element.event.target.click()
      //         let currElement = getElementByXpath(element.XPath)
      //         currElement.click()
      //     }
      //     else if(element.eventType === "input"){
      //         element.event.target.value = element.inputValue
      //     }
      // }, 1000)
      // console.log(element.XPath)

      // document.evaluate(element.XPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.style.border = "3px solid red"

      if (element.eventType === "click")
        if (element.inputValue) {
          recordedSteps.push(
            `Click on the ${element.text} element and enter ${element.inputValue} \n\t XPath - ${element.XPath}\n`
          );
          testData.push(element.inputValue);
        } else
          recordedSteps.push(
            `--> Click on the ${element.text} element \n\t XPath - ${element.XPath}\n`
          );
      else if (element.eventType === "input") {
        recordedSteps.push(
          `--> Enter the value of '${element.inputValue}' in the input field \n\t XPath - ${element.XPath}\n`
        );
        testData.push(element.inputValue);
      } else if (element.eventType === "navigate") {
        recordedSteps.push(
          "------------------------------",
          "           Steps",
          "------------------------------",
          "--> Navigate to " + element.url
        );
      } else if (element.eventType === "title") {
        // recordedSteps.push("--------------", "   Title", "--------------");
        recordedSteps.push("Test Title: ", element.title);
      } else if (element.eventType === "assert")
        recordedSteps.push(
          `--> Check Whether '${element.text}' text exists or not`
        );
    });

    console.log(recordedSteps);
    chrome.storage.sync.set({ recordedSteps: recordedSteps });

    chrome.storage.sync.get("recordedSteps", (items) => {
      // null implies all items
      console.log(saveFile(getDataInSteps(items.recordedSteps)));
      chrome.storage.sync.set({ isPlayback: false });

      // Convert object to a string.
      // var result = JSON.stringify(items);

      // // Save as file
      // var url = 'data:application/json;base64,' + btoa(result);
      // chrome.downloads.download({
      //     url: url,
      //     saveAs: true
      // });
    });
  });

  // recordedEvents.forEach((element) => {
  //     console.log(element.event.target.innerText)
  //     setTimeout(() => {
  //         if(element.event.eventType === "click"){
  //             element.event.target.click()
  //         }
  //         else if(element.event.eventType === "input"){
  //             element.event.target.value = element.event.inputValue

  //         }

  //     }, 1000)
  // });
};

// function getElementByXpath(path) {
//     return document.evaluate(
//       path,
//       document,
//       null,
//       XPathResult.FIRST_ORDERED_NODE_TYPE,
//       null
//     ).singleNodeValue;
//   }

function getElementXPath(element) {
  var XPath = "//" + element.tagName;

  if (element.ariaLabel)
    return {
      XPath: XPath + "[@aria-label='" + element.ariaLabel + "']",
      text: element.ariaLabel,
    };
  else if (element.name)
    return {
      XPath: XPath + "[@name='" + element.name + "']",
      text: element.name,
    };
  else if (element.title)
    return {
      XPath: XPath + "[@title='" + element.title + "']",
      text: element.title,
    };
  else if (element.tagName === "INPUT" && element.placeholder)
    return {
      XPath: XPath + "[@placeholder='" + element.placeholder + "']",
      text: element.placeholder,
    };
  else if (element.innerText)
    return {
      XPath: XPath + "[text()='" + element.innerText + "']",
      text: element.innerText,
    };
  else if (element.id)
    return { XPath: XPath + "[@id='" + element.id + "']", text: element.id };
  else return getElementXPath(element.parentNode);
  // else
  //   return getElementTreeXPath(element);
}

//   function getElementTreeXPath(element)
//   {
//     var paths = [];

//     // Use nodeName (instead of localName) so namespace prefix is included (if any).
//     for (; element && element.nodeType == 1; element = element.parentNode)
//     {
//       var index = 0;
//       for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
//       {
//         // Ignore document type declaration.
//         if (sibling.nodeType == Node.DOCUMENT_TYPE_NODE)
//           continue;

//         if (sibling.nodeName == element.nodeName)
//           ++index;
//       }

//       var tagName = element.nodeName.toLowerCase();
//       var pathIndex = (index ? "[" + (index+1) + "]" : "");
//       paths.splice(0, 0, tagName + pathIndex);
//     }

//     return paths.length ? "/" + paths.join("/") : null;
//   };

// Get Selected text
function getSelectionText() {
  var text = "";
  if (window.getSelection) {
    text = window.getSelection().toString();
  } else if (document.selection && document.selection.type != "Control") {
    text = document.selection.createRange().text;
  }
  return text;
}

// For badge text
// chrome.storage.onChanged.addListener((changes, namespace) => {
//   // set a badge
//   //   updateBadge();
//   chrome.browserAction.setBadgeText({
//     text: changes.isRecording ? "ON" : "OFF",
//   });
// });

// For Badge
// const updateBadge = () => {
//   chrome.storage.sync.get("isRecording", (events) => {
//     let txt = "";
//     if (events.isRecording) {
//       txt = "ON";
//     } else {
//       txt = "OFF";
//     }
//     chrome.action.setBadgeText({
//       text: txt,
//     });
//     // set badge color
//     chrome.action.setBadgeBackgroundColor({
//       color: "#96B6C5",
//     });
//   });
// };

// updateBadge();
