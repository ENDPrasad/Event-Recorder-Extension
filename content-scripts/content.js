// content.js

// Initialize array to store recorded events
var recordedEvents = [];


// Adding listeners
chrome.runtime.onMessage.addListener((request, sender, sendResponse)=>{
    if(request.todo === "start"){
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
    
// Event listener for clicks
document.addEventListener('click', (event) => {
    var updatedRecordedEvents = []
    chrome.storage.sync.get('recordedEvents', (events) => {
        var eventInfo = {
            timestamp: Date.now(),
            eventType: 'click',
            targetElement: event.target.tagName,
            element: event.target,
            innerText: event.target.innerText,
            event: event
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
                element: event.target,
                event: event
            };
            updatedRecordedEvents.push(eventInfo);
            chrome.storage.sync.set({'recordedEvents': updatedRecordedEvents})
        }
    })
    
});
}

// Not working, unable to get event in the object??

const playback = () => {

    chrome.storage.sync.get("recordedEvents", (events) => {
        events.recordedEvents.forEach((element) => {
            // console.log(element.event.target.innerText)
            setTimeout(() => {
                if(element.eventType === "click"){
                    element.event.target.click()
                }
                else if(element.eventType === "input"){
                    element.event.target.value = element.inputValue
                }
            }, 1000)
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

