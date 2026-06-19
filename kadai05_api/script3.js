// Import the core Firebase App initialization function from the Firebase web SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

// Import specific Realtime Database utilities needed for managing chat data
import { getDatabase, ref, push, set, onChildAdded, update, remove, onChildChanged, onChildRemoved } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

// Firebase configuration settings identifying your specific Realtime Database project
const firebaseConfig = {
    apiKey: "AIzaSyBWWqd29B1TI7CCoCfo-C7X922yfv_HUf8",
    authDomain: "gs-app-d31c2.firebaseapp.com",
    databaseURL: "https://gs-app-d31c2-default-rtdb.firebaseio.com",
    projectId: "gs-app-d31c2",
    storageBucket: "gs-app-d31c2.firebasestorage.app",
    messagingSenderId: "890057410251",
    appId: "1:890057410251:web:8268793d7242c4ef473d4e"
};

// Initialize the core Firebase application instance with the configuration above
const app = initializeApp(firebaseConfig);

// Connect to the Realtime Database instance tied to your initialized Firebase app
const db = getDatabase(app);
let map;

async function geocodePlace(placeName){

    const API_KEY = "AIzaSyDdMRILNIEC1Gn3P3LmmBoHOKSioUHQWQ8";

    const url =
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(placeName)}&key=${API_KEY}`;

    const response = await fetch(url);

    const data = await response.json();

    if(data.status !== "OK"){
        throw new Error("Location not found");
    }

    return data.results[0].geometry.location;
}

// Wait for the HTML document structure to be fully loaded and parsed before running scripts
document.addEventListener("DOMContentLoaded", function() {
    map = new google.maps.Map(
    document.getElementById("map"),{
        center: {
            lat: 35.6764,
            lng: 139.6500},
            zoom: 11 
    }
);

    // Create a reference pointing directly to the "messages" node/folder in your Firebase database
    const messagesRef = ref(db, "messages");
    
    // Set up a state variable tracking the currently selected category topic, defaulting to "none"
    let currentTopic = "none";

    // Select the dropdown menu element from the DOM to manage the topic filtering system
    let dropdown = document.querySelector(".dropdown-menu");
    
    // Listen for clicks anywhere inside the dropdown menu (using Event Delegation)
    dropdown.addEventListener("click", function(event) {
        
        // Check if the actual clicked element was an anchor tag link (<a>)
        if(event.target.tagName === "A") {
            
            // Update the main filter button's label text to reflect the chosen option
            document.querySelector(".dropbtn").innerHTML = event.target.textContent;
            
            // Normalize the text string to lowercase and strip outer spaces to match class naming conventions
            let selectedTopic = event.target.textContent.toLowerCase().trim();
            
            // Gather all current message container elements rendered in the DOM
            let allMessages = document.querySelectorAll(".message");
            
            // Iterate over each message element to conditionally show or hide them based on the filter
            allMessages.forEach(msgDiv => {
                
                // If "All Topics" is picked, or if the individual message contains the chosen topic's class name
                if(selectedTopic === "all topics" || msgDiv.classList.contains(selectedTopic)) {
                    // Make the element visible on screen
                    msgDiv.style.display = "block";
                } else {
                    // Hide the element from the display layout entirely
                    msgDiv.style.display = "none";
                }
            });
        }
    });

    // Select the main text input field where messages are typed
    const msgInput = document.querySelector(".msgtext");
    
    // Select the send button element
    const sendBtn = document.querySelector(".sendbtn");
    
    // Select all radio inputs sharing the 'topics' group name and loop through them
    document.querySelectorAll('input[name="topics"]').forEach(radio => {
        
        // Listen for when a user selects or changes a radio category button
        radio.addEventListener("click", function() {
            // Update the state tracking variable to match the newly active category ID

            // If the clicked radio button was ALREADY the active topic, the user wants to unselect it
            if (this.id === currentTopic) {
                this.checked = false;        // Visually uncheck the radio button
                currentTopic = "none";       // Reset the tracking state to "none"
            } else {
                // Otherwise, update the state tracking variable to match the newly active category ID
                currentTopic = this.id;
            }
            
            // Check the ID of the selected radio button to update the theme UI accordingly
            switch (currentTopic) {
                case "none":
                    msgInput.style.color = "black";          // Change text input color to dark green
                    msgInput.style.borderColor = "grey";        // Change input border to green
                    sendBtn.style.backgroundColor = "grey";     // Change button background to green
                    msgInput.placeholder = "🗨️🐦 Chitter chatter..."; // Set thematic placeholder text
                    break;                     
                case "foods": 
                    msgInput.style.color = "darkgreen";          // Change text input color to dark green
                    msgInput.style.borderColor = "green";        // Change input border to green
                    sendBtn.style.backgroundColor = "green";     // Change button background to green
                    msgInput.placeholder = "🍜 Suggest a restaurant..."; // Set thematic placeholder text
                    break;
                case "activities":
                    msgInput.style.color = "darkblue";           // Change text input color to dark blue
                    msgInput.style.borderColor = "blue";         // Change input border to blue
                    sendBtn.style.backgroundColor = "darkblue";  // Change button background to dark blue
                    msgInput.placeholder = "🎯 Things we should do..."; // Set thematic placeholder text
                    break;
                case "shopping":
                    msgInput.style.color = "darkred";            // Change text input color to dark red
                    msgInput.style.borderColor = "magenta";       // Change input border to magenta
                    sendBtn.style.backgroundColor = "magenta";   // Change button background to magenta
                    msgInput.placeholder = "🛍️ What should we buy..."; // Set thematic placeholder text
                    break;
                case "random":
                    msgInput.style.color = "orangered";          // Change text input color to orangered
                    msgInput.style.borderColor = "orangered";    // Change input border to orangered
                    sendBtn.style.backgroundColor = "orangered"; // Change button background to orangered
                    msgInput.placeholder = "💭 Anything else...";  // Set thematic placeholder text
                    break;
            }
        });
    });


    // Select the message submission button element again for handling submission events
    const sendbtn = document.querySelector(".sendbtn");
    
    // Listen for click actions on the message submission button
    sendbtn.addEventListener("click", function() {
        
        // Prevent submission if the user hasn't typed anything meaningful (ignoring whitespace)
        if(!msgInput.value.trim()) {
            return;
        }
        
        // Assemble a structured data object containing all details of the new chat message
        const newMessage = {
            topic: currentTopic, // Saves the current active category classification string
            sender: "MidoriK",    // Hardcodes the profile name for the message author
            text: document.querySelector(".msgtext").value, // Captures the current string from message input
            place: document.querySelector(".maptext").value, // Captures the current string from map input
            timestamp: Date.now(), // Generates a numerical Unix millisecond timestamp representing right now

            reaction: null
        };
        
        // Output the created message payload configuration to the console for monitoring
        console.log(newMessage);

        // Upload and append the message object payload to the assigned 'messages' location path inside Firebase
        push(messagesRef, newMessage);

        // Clear out the input form fields so they are clean and ready for the next message entry
        document.querySelector(".msgtext").value = "";
        document.querySelector(".maptext").value = "";
    });

    // Establish a live, real-time listener tracking when entries are added into the designated Firebase pathway
    onChildAdded(messagesRef, function(snapshot) {
        
        // Unpack raw structural database snapshots into a practical native JavaScript object model
        const msg = snapshot.val();
        const msgId = snapshot.key;
        
        // Output the incoming data payload block into the developer console logs
        console.log(msg);
        
        // Locate the target wrapper DOM block responsible for storing visual chat rows
        const chatsDiv = document.getElementById("chats");
        
        // Construct a clean, isolated root <div> element node explicitly for housing this new message block
        const msgDiv = document.createElement("div");
        msgDiv.dataset.id = msgId;
        
        // Assign a base layout class identifier to the created wrapper division element
        msgDiv.classList.add("message");
        
        // Append an secondary structural class designating the specific category category (e.g., 'foods')
        msgDiv.classList.add(msg.topic);

        // Construct raw HTML templates injected dynamically containing data extracted from the Firebase reference record
        const m = `
        <div class="message-content">
            <img src="MidoriK.JPG" style="width:35px;height:35px;border-radius:50%;">

            <div>
                <p>${msg.text}</p>

                ${
                  // Evaluate if map tracking link details exist. Render a structured link badge if valid, else return empty space.
                  msg.place
                    ? `
                    <div class="map-card">
                        📍 ${msg.place}
                        <button class="open-location-btn">
                            🗺 Add To Map
                        </button>
                    </div>
                    `
                    : ""
                }

                <div class="reaction-bar">
                    <button class="love-btn">🩷 Love it! </button>

                    <button class="like-btn">👍 Sounds good </button>

                    <button class="maybe-btn">🤔 Maybe... </button>
                </div>

                <small>${new Date(msg.timestamp).toLocaleDateString()}</small>

            </div>
        </div>
        `;

        // Inject the freshly processed layout template into the outer element container frame
        msgDiv.innerHTML = m;
        
        // Place the completed message component into the display area at the bottom of the chat list
        chatsDiv.appendChild(msgDiv);
        const messageRef = 
                ref(db, `messages/${msgId}`);
        
        const openLocationBtn = msgDiv.querySelector(".open-location-btn")

            if(openLocationBtn){
            openLocationBtn.addEventListener(
                    "click",
                    async function(){
                        try{
                            const location =
                                await geocodePlace(msg.place);
                            new google.maps.Marker({
                                position: location,
                                map: map,
                                title: msg.place
                            });
                            map.panTo(location);
                            map.setZoom(15);

                        }catch(error){
                            alert(
                                "Could not find location"
                            );
                            console.error(error);

                        }

                    }
                );

            }

        const loveBtn = 
                msgDiv.querySelector(".love-btn");
                if(msg.reaction === "love"){
                    loveBtn.classList.add("selected");
                }
        if(loveBtn){
            loveBtn.addEventListener("click", function(){
                update(messageRef, {
                    reaction: "love"
                })
            })
        }
        const likeBtn = msgDiv.querySelector(".like-btn");
            if(msg.reaction === "like"){
                likeBtn.classList.add("selected");
            }
            if(likeBtn){
                likeBtn.addEventListener("click", function(){
                    update(messageRef, {
                        reaction: "like"
                    })
                })
            }
        const maybeBtn = msgDiv.querySelector(".maybe-btn");
            if(msg.reaction === "maybe"){
                maybeBtn.classList.add("selected")
            }
            if(maybeBtn){
                maybeBtn.addEventListener("click", function(){
                    update(messageRef, {
                        reaction: "maybe"
                    })
                })
        }

        // Increment the tracking variable maintaining total registered dashboard messages by one
        messageCount++;
        
        // Write the calculated value total to update the text metric displayed within the header counters
        document.querySelector("#messageCount").textContent = messageCount;

        // Select the scrollable message window container object
        const chats = document.querySelector(".chats");
        
        // Automatically scroll the viewport window downwards to instantly focus on the most recent message card
        requestAnimationFrame(() => {
        chats.scrollTop = chats.scrollHeight;
    });
    });

    // Initialize the primary baseline ledger variable maintaining global active message totals at zero
    onChildChanged(messagesRef, function(snapshot){
        const msg = snapshot.val();
        const msgId = snapshot.key;

        const messageDiv = document.querySelector(`[data-id="${msgId}"]`);

        if(!messageDiv){
            return;
        }
        
        const loveBtn = messageDiv.querySelector(".love-btn");
        const likeBtn = messageDiv.querySelector(".like-btn");
        const maybeBtn = messageDiv.querySelector(".maybe-btn");

        loveBtn.classList.remove("selected");
        likeBtn.classList.remove("selected");
        maybeBtn.classList.remove("selected");

        if(loveBtn && msg.reaction === "love"){
            loveBtn.classList.add("selected");
        }
        if(likeBtn && msg.reaction === "like"){
            likeBtn.classList.add("selected")
        }
        if(maybeBtn && msg.reaction === "maybe"){
            maybeBtn.classList.add("selected")
        }

    })
    let messageCount = 0;

});