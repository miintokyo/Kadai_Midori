// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
  import { getDatabase, ref, push, set, onChildAdded, update, remove, onChildChanged,  onChildRemoved } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries


  // Your web app's Firebase configuration
    const firebaseConfig = {
    apiKey: "AIzaSyBWWqd29B1TI7CCoCfo-C7X922yfv_HUf8",
    authDomain: "gs-app-d31c2.firebaseapp.com",
    databaseURL: "https://gs-app-d31c2-default-rtdb.firebaseio.com",
    projectId: "gs-app-d31c2",
    storageBucket: "gs-app-d31c2.firebasestorage.app",
    messagingSenderId: "890057410251",
    appId: "1:890057410251:web:8268793d7242c4ef473d4e"
    };

  // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);


document.addEventListener("DOMContentLoaded", function() {

const messagesRef = ref(db, "messages") //points to a "messages" folder in your db  
    let currentTopic = "food"

    let dropdown = document.querySelector(".dropdown-menu")
    dropdown.addEventListener("click", function(event){
      if(event.target.tagName === "A"){
        document.querySelector(".dropbtn").innerHTML = event.target.textContent
      }
    })

const msgInput = document.querySelector(".msgtext");
document.querySelectorAll('input[name="topics"]').forEach(radio =>{
  radio.addEventListener("change", function(){
    switch (this.id){
      case "food": 
        msgInput.style.color = "darkgreen";
        msgInput.style.borderColor ="green";
        break;
      case "activities":
        msgInput.style.color = "darkblue";
        msgInput.style.borderColor = "darkblue";
        break;
      case "shopping":
        msgInput.style.color = "darkred";
        msgInput.style.borderColor = "darkred"
        break;
      case "random":
        msgInput.style.color = "orangered"
        msgInput.style.borderColor = "orangered"
        break;
    }
    switch (this.id){
      case "food":
        msgInput.placeholder = "🍜 Suggest a restaurant...";
        break;
      case "activities":
        msgInput.placeholder = "🎯 Things we should do...";
        break;
      case "shopping":
        msgInput.placeholder = "🛍️ What should we buy...";
        break;
      case "random":
        msgInput.placeholder = "💭 Anything else...";
        break;
    }
    currentTopic = this.id;
  })
})

    // Send message
    const sendbtn = document.querySelector(".sendbtn")
    sendbtn.addEventListener("click", function(){
      if(!msgInput.value.trim()){
       return;
      }
        const newMessage = {
            topic: currentTopic,
            sender: "MidoriK",
            text: document.querySelector(".msgtext").value,
            mapLink: document.querySelector(".maptext").value,
            timestamp: Date.now()
        }
        console.log(newMessage)

        //opens the cabinet and points finger at the folder called "messages".
        //Just says, "this is where I'm working"
        push (messagesRef, newMessage) //sends it up
        //adds a new piece of paper into that folder, & gives it a unique ID
        //set () //for replacing whatever is at a location with new data.

        document.querySelector(".msgtext").value = ""
        document.querySelector(".maptext").value = ""
    })
  // Receive message 
    onChildAdded(messagesRef, function(snapshot){//points at messagesRef
      const msg = snapshot.val();//unsraps the snapshot into a variable called msg
      console.log(msg)
      const chatsDiv = document.getElementById("chats")
      const msgDiv = document.createElement("div")
      msgDiv.classList.add("message")
      msgDiv.classList.add(msg.topic)

    const m = `
    <div class="message-content">
        <img src="MidoriK.JPG" style="width:35px;height:35px;border-radius:50%;">

        <div>
            <p>${msg.text}</p>

            ${
              msg.mapLink
                ? `
                <div class="map-card">
                    📍 Location attached
                    <br>
                    <a href="${msg.mapLink}" target="_blank">
                        Open Map
                    </a>
                </div>
                `
                : ""
            }

            <small>${new Date(msg.timestamp).toLocaleDateString()}</small>
        </div>
    </div>
    `;

      msgDiv.innerHTML= m
      chatsDiv.appendChild(msgDiv)

      messageCount++;
      document.querySelector("#messageCount").textContent =
          messageCount;

      const chats = document.querySelector(".chats");
      chats.scrollTop = chats.scrollHeight;

    })

    let messageCount = 0;

  })
