// content.js

// Initialize array to store recorded events
var recordedEvents = [];
var testCaseTitle = ""


// Adding listeners
chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    if(request.todo === "start"){
        testCaseTitle = request.title
        addListeners()
        console.log("recording started!!")
    }
    if(request.todo === "stop"){
        removeListeners()
        console.log("recording stopped!!")

        chrome.storage.sync.get("recordedEvents", (events) => {
            console.log(events.recordedEvents)
        })
    }
    if(request.todo === "playback"){
        console.log("Playback started")
        playback()
    }
})

// To clear the local storage

// chrome.storage.local.clear(() => {
//     console.log('Everything was removed');
// });


const removeListeners = () => {
    document.removeEventListener("click", ()=>{
        console.log("event listeners removed!!")
    })

    document.removeEventListener("input", ()=>{
        console.log("event listeners removed!!")
    })
}


const addListeners = () => {
    recordedEvents = []
    // URL changes
    // window.addEventListener('popstate', (event) =>{
    //     console.log(event)
    //     var updatedRecordedEvents = []
    // chrome.storage.sync.get('recordedEvents', (events) => {
    //     var eventInfo = {
    //         timestamp: Date.now(),
    //         eventType: 'navigate',
    //         newURL: event.target.location.href,
    //         event: event
    //     };
    //     updatedRecordedEvents = events.recordedEvents
    //     updatedRecordedEvents.push(eventInfo);
    //     chrome.storage.sync.set({'recordedEvents': updatedRecordedEvents})
    // })
    // })
// Event listener for clicks
document.addEventListener('click', (event) => {
    var updatedRecordedEvents = []
    chrome.storage.sync.get('recordedEvents', (events) => {
        let XPathData = getElementXPath(event.target)
        var eventInfo = {
            timestamp: Date.now(),
            eventType: 'click',
            targetElement: event.target.tagName,
            element: event.target,
            text: XPathData.text,
            event: event,
            XPath: XPathData.XPath
        };
        updatedRecordedEvents = events.recordedEvents
        updatedRecordedEvents.push(eventInfo);
        chrome.storage.sync.set({'recordedEvents': updatedRecordedEvents})
    })
});

// Event listener for inputs
document.addEventListener('input', function(event) {
    var updatedRecordedEvents = []
    chrome.storage.sync.get('recordedEvents', (events) => {
        if(events.recordedEvents){
            var eventInfo = {
                timestamp: Date.now(),
                eventType: 'input',
                targetElement: event.target.tagName,
                inputValue: event.target.value,
                event: event,
                innerHTML: event.target.innerHTML,
                element: event.target.element
            };
            updatedRecordedEvents.push(eventInfo);
            chrome.storage.sync.set({'recordedEvents': updatedRecordedEvents})
        }
    })

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
}


function saveFile(data, extension = 'txt') {
    const fileName = `${data.title}.${extension}`;

    const textFileAsBlob = new Blob([data.data], {type: 'text/plain'});
    const downloadLink = document.createElement('a');
    downloadLink.download = fileName;

    downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
    downloadLink.target = '_blank';
    downloadLink.click();

    return fileName;
}

function getDataInSteps(recordedSteps){
    let data = ""
    let title = ""
    recordedSteps.forEach((element, index) => {
        if(index)
        data += (index).toString() + ". " + element + "\n"
        else{
            data = element + "\n"
            title = element
        }
    })
    return {data: data, title: title}
}

// Not working, unable to get event in the object??

const playback = () => {

    chrome.storage.sync.get("recordedEvents", (events) => {
        recordedSteps = []
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

            if(element.eventType === 'click')
                recordedSteps.push(`Click on the ${element.text} button \n\t XPath - ${element.XPath}\n`)
            else if(element.eventType === 'input')
                recordedSteps.push("Enter value of " + element.inputValue + " in the element " + element.innerText?element.innerText:element.targetElement)
            else if(element.eventType === 'navigate')
                recordedSteps.push("Navigate to " + element.newURL)
            else if(element.eventType === "title")
                recordedSteps.push(element.title)

        });

        console.log(recordedSteps)
        chrome.storage.sync.set({'recordedSteps': recordedSteps})

        chrome.storage.sync.get("recordedSteps", (items) => { // null implies all items
            console.log(saveFile(getDataInSteps(items.recordedSteps)))
            // Convert object to a string.
            // var result = JSON.stringify(items);
        
            // // Save as file
            // var url = 'data:application/json;base64,' + btoa(result);
            // chrome.downloads.download({
            //     url: url,
            //     saveAs: true
            // });
        });

    })

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
}



// function getElementByXpath(path) {
//     return document.evaluate(
//       path,
//       document,
//       null,
//       XPathResult.FIRST_ORDERED_NODE_TYPE,
//       null
//     ).singleNodeValue;
//   }

  function getElementXPath(element)
  {
    var XPath = "//" + element.tagName

  if(element.ariaLabel)
    return {XPath: XPath + "[@aria-label='" + element.ariaLabel + "']", text: element.ariaLabel}
  else if(element.name)
    return {XPath: XPath + "[@name='" + element.name + "']", text: element.name}
  else if(element.title)
    return {XPath: XPath + "[@title='" + element.title + "']", text: element.title}
  else if(element.tagName === "INPUT" && element.placeholder)
    return {XPath: XPath + "[@placeholder='" + element.placeholder + "']", text: element.placeholder}
  else if(element.innerText)
    return {XPath: XPath + "[text()='" + element.innerText + "']", text: element.innerText}
  else if(element.id)
    return {XPath: XPath + "[@id='" + element.id + "']", text: element.id}
  else
    return getElementXPath(element.parentNode)
    // else
    //   return getElementTreeXPath(element);
  };
  
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
  

