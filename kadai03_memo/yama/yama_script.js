

const saveBtn = document.getElementById("saveBtn")

//newYamas: array data extracted from text boxes
let yamas //the official yama array data

let selectedYama = '';

if (localStorage.getItem('lsYamaObject') !== null){
    yamas = JSON.parse(localStorage.getItem('lsYamaObject'))
} else {
    yamas =[]
}

//alternatively, in shorthand;
//let yamas = JSON.parse(localStorage.getItem('lsYamaObject')) || [] //

renderDB()//Update the DB table

console.log(yamas)

// document.addEventListener('DOMContentLoaded', populateYamaDropdown)

document.getElementById("clearBtn").addEventListener("click", function(){
    document.querySelector(".form").reset();
})

// Another way to write:
// document.getElementById("clearBtn").addEventListener("click", () =>{
//     ["yamaName", "yamaInfo", "yamaTrips"].forEach(id => document.getElementById(id).value)
// }

//when "save" button clicked, extract data, update yamas, save in localstorage, and update list
saveBtn.addEventListener("click", function(){ 
    const yamaName = document.getElementById("yamaName").value
    const yamaInfo = document.getElementById("yamaInfo").value
    const yamaTrips = document.getElementById("yamaTrips").value//get the input values

    if (!yamaName.trim()) {
    alert("Please enter a name.")
    return
    }

    if(selectedYama){
        const yama = yamas.find(function(y){return y.name === selectedYama})
        yama.name = yamaName
        yama.info = yamaInfo
        yama.trips = yamaTrips
        selectedYama = ''
    } else {
        if(yamas.find(function(yama){//Look through yamas, and for each one (temporarily calling it yama)
            return yama.name === yamaName//find me the first one where .name matches yamaName
        })){
            alert (`"${yamaName}" already exists!`)
            return//stop here, don't save
            }
        yamas.push({
            name: yamaName,
            info: yamaInfo,
            trips: yamaTrips
        //yamas.push(newYama)
        })
    }

    localStorage.setItem('lsYamaObject', JSON.stringify(yamas))
    renderDB()
})

function renderDB(){
    const yamaTable = document.querySelector(".yamaTable")
    yamaTable.innerHTML = ""
    const yamaDB = document.createElement("table")

    for(let i=0; i<yamas.length; i++){
        const yama = yamas[i]
        //1. First, build the row
        //Create new table row
        const tr = document.createElement('tr')
        tr.classList.add('db-row')

        //Create the cell for yama name
        const nameTd = document.createElement('td')
        nameTd.classList.add('yama-name')
        nameTd.textContent=yama.name

        //Create the record cells
        const infoTd = document.createElement('td')
        infoTd.classList.add('yama-info')
        infoTd.textContent=yama.info
        const tripsTd = document.createElement('td')
        tripsTd.classList.add('yama-trips')
        tripsTd.textContent=yama.trips

        //Create the cell for edit button
        const editTd = document.createElement('td')
        editTd.classList.add('edit-button')
        editTd.textContent='Edit'

        //Create the cell for delete button
        const deleteTd = document.createElement('td')
        deleteTd.classList.add('delete-button')
        deleteTd.textContent='x'

        //--- ATTACH CLICK LISTENERS  ---


        // //When name is clicked -> select this record
        // nameTd.addEventListener('click', function(){
        //     editYama(yama.name)
        // })

        // //When "edit" is clicked, edit the record
        // editTd.addEventListener('click', function(){
        //     editYama(yama.name)
        // })

        //More efficient: 
        // const elementsToClick = [nameTd, infoTd, tripsTd, editTd]
        //loop through and attach the listener to each
        // elementsToClick.forEach(element => {
        //     element.addEventListener('click', () => editYama(yama.name));
        // })

        tr.addEventListener('click', function(event){
            if(event.target === nameTd || event.target ===editTd || event.target === infoTd || event.target === tripsTd)
                editYama(yama.name);
        })

        //When X is clicked -> delete this record
        deleteTd.addEventListener('click', function(){
            deleteYama(yama.name)
        })

        //--- ASSEMBLE ---
        
        //Put the cells into a row
        tr.appendChild(nameTd)
        tr.appendChild(infoTd)
        tr.appendChild(tripsTd)
        tr.appendChild(editTd)
        tr.appendChild(deleteTd)

        //Put the row into the table
        yamaDB.appendChild(tr)
    }

    //put the finished table onto the page div
    yamaTable.appendChild(yamaDB)/// uhhhh...??
    // populateYamaDropdown()

    yamaName.value = ''
    yamaInfo.value = ''
    yamaTrips.value = ''

        //Simply printing the yama name
        //const div = document.createElement("div")//declare div as function for creating div
        //div.textContent=yamas[i].name //
        //yamaTable.appendChild(div) // 
    }

function editYama(name){
    selectedYama = name
    console.log(selectedYama)

    const yama = yamas.find(y => y.name === name) // find the one matching record

    document.getElementById('yamaName').value = yama.name
    document.getElementById('yamaInfo').value = yama.info
    document.getElementById('yamaTrips').value = yama.trips
}

function saveNote(){

}

function deleteYama(name){
    yamas = yamas.filter(yama => yama.name !== name)
    //Take each yama, look at their names, and find which ones DO NOT match the name
    //Then keep those FALSE ones (the names that DO NOT match)
    
    //short for below;
    //friends = friends.filter(function(friend){
    //    return friend.id !== id;
    //});
    localStorage.setItem('lsYamaObject', JSON.stringify(yamas))
    renderDB()
}

// function populateYamaDropdown(){
//     const select = document.getElementById('yamas')
//     select.innerHTML = '<option value=""></option>'//reset first, to avoid duplicates

//     for (let i=0; i<yamas.length; i++){
//         const option = document.createElement('option')
//         option.value = yamas[i].name
//         option.textContent = yamas[i].name
//         select.appendChild(option)
//     }
// }