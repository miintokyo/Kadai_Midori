
const video = document.getElementById('video')
const startBtn = document.getElementById('startvideobtn')
let stream = null;
let FaceMatcher = null

startBtn.addEventListener('click', toggleCamera) /*★Event listeners*/

function toggleCamera (){
    if (stream === null) {
        startCamera()
    } else {
        stopCamera()
    }
}

async function startCamera() {
    stream = await navigator.mediaDevices.getUserMedia( {video : true})
    video.srcObject = stream
    startBtn.innerHTML = "Stop Camera"
    detectFace()
}

async function stopCamera () {
    stream.getTracks().forEach(track => track.stop()) 
    /*
    "Get all the tracks in the stream, and for each one, stop it.""
    getTracks()
    forEach 
    ★ track => track.stop means the same as 
    function stop(track) {
        track.stop()
    }*/
    video.srcObject = null
    startBtn.innerHTML = "Start Camera"
}

async function loadModels(){//please download the AI weight files from faceapi into memory  
    await faceapi.nets.ssdMobilenetv1.loadFromUri('./models')
    await faceapi.nets.faceLandmark68Net.loadFromUri('./models')
    await faceapi.nets.faceRecognitionNet.loadFromUri('./models')
    console.log('models loaded')
}

loadModels().then(() => loadKnownFaces())

let isProcessing = false

async function detectFace(){ 
    // Define an async function called detectFace. 
    console.log('detectFace running')
    // Log a debug message. 
    setInterval(async () => { // the async before the => means that the  
        if (isProcessing) return
    // use of await within the "arrow" function is enabled?? 
        if (video.readyState === 4){
        const detections = await faceapi.detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidenceScore: 0.3 }))//Looks at the frame in the video
        // take the current frame from the video element, 
        // run Face API's face detection on it, and log whatever it finds
        console.log('detections: ',detections)

               if (detections.length > 0) {
                    const liveDetection = await faceapi.detectSingleFace(video)
                        .withFaceLandmarks()
                        .withFaceDescriptor()
                    
                    if (liveDetection) {
                        const match = faceMatcher.findBestMatch(liveDetection.descriptor)
                        // console.log('match:', match.label)
                        if(match.label === 'Midori') {
                            isProcessing = true;
                            document.getElementById('scan-message').innerHTML = 'Hello Midori!'
                            document.querySelector('.scanner').classList.add('authenticated')
                            setTimeout(() => {
                                document.getElementById('scan-message').innerHTML = 'Scanning...'
                                document.querySelector('.scanner').classList.remove('authenticated')
                                document.documentElement.style.setProperty('--corner-color', 'darkcyan')
                                isProcessing = false;
                            },6001)
                        } else {
                            isProcessing = true;
                            document.getElementById('scan-message').innerHTML = 'Face not recognized. Please register yourself.'
                            document.querySelector('.scanner').classList.add('unknown')
                            console.log(document.querySelector('#scanner').classList)
                            setTimeout(() => {
                                document.getElementById('scan-message').innerHTML = 'Scanning...'
                                document.querySelector('.scanner').classList.remove('unknown')
                                document.documentElement.style.setProperty('--corner-color', 'darkcyan')
                                isProcessing = false;
                            },6001)                        
                        }
                    }
                }

        }
        //faceapi: the app, used to detect the faces from "video" stream
    }, 300)
    // every 300 milliseconds, 
}

let knownPeople = ['Midori', 'Snoopy', 'Pigggy']

async function loadKnownFaces() {
    const labelledDescriptors = [] //empty collection

    for (const name of knownPeople){

        const image = await faceapi.fetchImage(`./known_faces/${name}.jpg`)
        const detection = await faceapi.detectSingleFace(image)
            .withFaceLandmarks()
            .withFaceDescriptor()

        labelledDescriptors.push(
            new faceapi.LabeledFaceDescriptors(name, [detection.descriptor])
        )
    }
    faceMatcher = new faceapi.FaceMatcher(labelledDescriptor)
    console.log('faceMatcher ready: ', faceMatcher)

}


// _score — confidence that it's a face (0 to 1)
// _box — the coordinates of where the face is in the frame (x, y, width, height)
// _imageDims — the dimensions of the video frame

// async function startCamera() {
//     const stream = await navigator.mediaDevices.getUserMedia( {video : true} )
// }

// setInterval(async () => {
//     //scan for faces here 

// }, 3000) //every 3000 milliseconds

// if (match found){
//     //show Hello name
// } if else {
//     //show registration prompt
// }


