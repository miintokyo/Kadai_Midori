
//$('.app').hide().fadeIn(1000); LATER!

const friendList = document.querySelector("#friendList") 
let friends //for JSON stringify/parse
const savedFriends = localStorage.getItem('LSfriendList') //getItem (in JSON form)

let selectedFriend = null //variable for "which friend is being selected?""

if(savedFriends !== null){//Step 5.ReRendering sidebar
    friends = JSON.parse(savedFriends)
}else {
    friends = []  // starts empty, grows as you add people
    // {
    //     dateid: '', name: 'Midori', birthday: '19880614', memo1: 'aa', memo2:'bb'
    // }
}

renderSidebar()

// Short version of above — same logic, one line
// const friends = savedFriends ? JSON.parse(saved) : []
// Read it like a question:
// savedFriends ?         → "does savedFriends have a value?"
// JSON.parse(savedFriends)  → "yes → convert it to an array"
// : []               → "no → use an empty array"
// condition ? valueIfTrue : valueIfFalse

// function addRecords(){
//     //Write function for displaying the profileRecord div and journalMemo div textareas/buttons for the new friend
//     document.querySelector('#profile-record').slideDown(500);
//     document.querySelector('#journal-record').slideDown(900);    
// }

const addFriendbtn = document.getElementById("addFriend")

addFriendbtn.addEventListener("click", function (){//Step 1. Create new Friend object "newFriend"
    const newname = document.getElementById("nameinput").value

    const newFriend = {
        id: Date.now(),
        name: newname,
        profileMemo: '',
        journalMemo: '',
    }

    friends.push(newFriend) //Step 2. push the newFriend onto "friends" Array
    console.log(friends)//for testing
    localStorage.setItem('LSfriendList', JSON.stringify(friends))//Step 3.Save array to localStorage
    addRecords()//function to open the Profile-record & journal record panels 
    renderSidebar()//Step. 4 
})

function addRecords(){
    //Write function for displaying the profileRecord div and journalMemo div textareas/buttons for the new friend
    document.querySelector('.profile-record').classList.add('fade-in');
    document.querySelector('.journal-record').classList.add('fade-in');
}

function renderSidebar() {
    //clear the sidebar
    friendList.innerHTML = ''
    const table = document.createElement('table')
    // for (let i=0; i<friends.length; i++){
    //     const friend = friends[i]
    //     const div = document.createElement('div')
    //     div.textContent = friend.name
    //     sidebar.appendChild(div)
    // }

    friends.forEach(friend => {//friend is a temporary variable , representing 1 friend per loop
        const tr = document.createElement('tr')
        tr.classList.add('friend-row')//For CSS styling
        const nameTd = document.createElement('td')
        nameTd.classList.add('friend-name')
        nameTd.textContent = friend.name

        const deleteTd = document.createElement('td')
        deleteTd.classList.add('delete-button')
        deleteTd.textContent = 'X'

        //Add eventlistener for X
        deleteTd.addEventListener('click', function(){
            deleteFriend(friend.id)
        })

        tr.appendChild(nameTd) //Assemble: put both cells into the row
        tr.appendChild(deleteTd)
        table.appendChild(tr) //Put the row into the table

        nameTd.addEventListener('click', function(){
            addFriend(friend.id)
        })

    })
    //Put the finished table into the page
    friendList.appendChild(table)
}

function deleteFriend(id){
    friends = friends.filter(friend => friend.id !== id)
    localStorage.setItem('LSfriendList', JSON.stringify(friends))    
    friendList.innerHTML=''
    renderSidebar()        
}

function addFriend(){

}

function selectFriend(){

}

if (localStorage.getItem("nameEntry")){
    "print the names in the list"
}


// const sidebar = document.querySelector('.sidebar')

// const creatediv = document.createElement('div')
// div.textContent = 'Midori'
// sidebar.appendChild(div)


//Save New Friend
