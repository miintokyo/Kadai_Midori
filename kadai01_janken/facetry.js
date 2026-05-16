
let classifier; 
let video;      
let label = "Loading..."; 
let modelURL = 'https://teachablemachine.withgoogle.com/models/WBpOitKvP/'; // Update this with your new model link

function preload() {
  console.log("1. Starting to load the model...");
  // We add 'modelReady' as a second argument to help us debug
  classifier = ml5.imageClassifier(modelURL + 'model.json', modelReady);
}

function modelReady() {
  // If this shows up in the console, the model is working!
  console.log("2. Model is officially LOADED!");
  document.getElementById("status").innerHTML = "Status: <br> 読み込み完了!<br>準備が出来ました。";
}

function setup() {
  let cnv = createCanvas(640, 480);
  cnv.parent('video-column');
  cnv.style('display', 'block');
  video = createCapture(VIDEO);
  video.size(640,480);
  video.hide();
  classifyVideo();
}

function classifyVideo() {
  classifier.classify(video, gotResult);
}

function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }
  label = results[0].label;
  console.log("AI sees: "+ label);
}
  
  // --- UPDATED COURSEWORK LOGIC ---
  // Here we use the if/else structure to assign a number to each expression
  
function draw() {
  image(video, 0, 0); 
  
  // Draw a semi-transparent box behind the text to make it readable
  fill(0, 0, 0, 150);
  rect(0, 0, 250, 60);

  // Write the detected expression on the screen
  textSize(32);
  fill(255, 255, 0); // Yellow text
  text(label, 10, 40); 
}

const statusSpan= document.getElementById("status");
const call = ["じゃん", "けん", "ぽん！"]
const pchands = ["😗 <br>(ぐー✊)", "😏<br>(ちょき✌)", "😮<br>(ぱー✋)"]
const pcfinalhands = ["✊", "✌", "✋"]
let pcnum = null;
let counter = 0;
let userChoice = 0;
const myfinalhand = document.querySelector("#myfinalhand");

document.addEventListener("DOMContentLoaded", function(){
  const startbtn = document.getElementById("start");
  document.querySelector("#start").onclick = function(){
    startbtn.disabled = true;
  const countdown = setInterval(() => {
    if(counter < 2){
      statusSpan.innerHTML = call[counter];
      document.getElementById("status").style.fontSize = "35px";
      document.getElementById("status").style.color = "red";
      document.getElementById("status").style.fontWeight = "bold";            
      counter ++;
    } else if (counter===2) {
      statusSpan.innerHTML = call[counter];
      document.getElementById("status").style.fontSize = "40px";
      document.getElementById("status").style.color = "red";
      document.getElementById("status").style.fontWeight = "bold";      
      pcnum = Math.floor(Math.random() *3); //ランダムの数値を生成
      document.querySelector("#emoji-display").innerHTML=pchands[pcnum];  
      document.querySelector("#pcfinalhand").innerHTML=pcfinalhands[pcnum]; 
      classifyVideo();  
      setTimeout(() => {
        userChoice = parseInt(label);
        // ... winner logic goes here ...
      }, 200);
      counter ++;
      let displayText = "";

      if (userChoice === 0) { myfinalhand.innerHTML = "✊"; } 
      else if (userChoice === 1) { myfinalhand.innerHTML = "✌"; } 
      else if (userChoice === 2) { myfinalhand.innerHTML = "✋"; }

    if(userChoice === pcnum) {
        document.querySelector("#counter").innerHTML = "おあいこでした🤝";
        document.getElementById("counter").style.color = "black";
        document.getElementById("counter").style.backgroundColor = "lightgrey";        
      } else if (
        (userChoice === 0 && pcnum === 1) || // Rock beats Scissors
        (userChoice === 1 && pcnum === 2) || // Scissors beats Paper
        (userChoice === 2 && pcnum === 0)    // Paper beats Rock
      ) {
        document.querySelector("#counter").innerHTML = "あなたの勝ち🎉";
        document.getElementById("counter").style.color = "orange";  
        document.getElementById("counter").style.backgroundColor = "lightyellow";
      } else {
        document.querySelector("#counter").innerHTML = "あなたの負け";
        document.getElementById("counter").style.color = "blue";
        document.getElementById("counter").style.backgroundColor = "lightblue";
      } 
      counter++;
    } else {

      clearInterval(countdown);
      setTimeout(() => {
        statusSpan.innerHTML="";
        startbtn.disabled = false;
        counter = 0;
        document.querySelector("#emoji-display").innerHTML="⌛";  
        document.querySelector("#counter").innerHTML = "結果...";
        document.getElementById("counter").style.color = "lightgrey";
        document.getElementById("counter").style.backgroundColor = "#fafafa";
        document.getElementById("status").style.fontSize = "18px";
       document.getElementById("status").style.color = "grey";
      }, 4200);
    }
  }, 800);
  }
})
