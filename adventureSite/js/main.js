
class Scenario{
 	constructor(){
 		this.scenes=[];
 		this.questions=[];
 	}
 	getScene(sceneId){
		let i;
 		for(i=0;i<this.scenes.length;i++){
 			if(this.scenes[i].id==sceneId)
 				return this.scenes[i];
 		}
 		return null;
 	}
 	addScene(toAdd){
 		this.scenes.push(toAdd);
 	}
 	addQuestion(toAdd){
 		this.questions.push(toAdd);
 	}
}

class Scene{
	constructor(id,question) {
		this.id=id;
		this.question=question;
		//this.img="test.png";
		this.options=[];
	}
	addOption(toAdd){
		this.options.push(toAdd);
	}
	getHTML(){
		var generated=
			"<p class='question'>"+this.question+"</p>"+
			"<div class='choices'>";
		let i;
 		for(i=0;i<this.options.length;i++){
 			generated+=this.options[i].getHTML();
 		}
 		generated+="</div>";
	 	return generated;
	}
}

class Option{
	constructor(sceneId,description,img) {
		this.description=description;
		this.img=img;
		this.sceneId=sceneId;
	}
	getHTML(){
		return "<div class='choiceCard' style=\"background-image: url('"+this.img+"')\" onclick=\"selectScene('"+this.sceneId+"',true)\">"+
				"<p class='choiceTitle'>"+this.description+"</p>"+
			"</div>";
	}
}

function selectScene(tarId,saveMove){
	let scene=scenario.getScene(tarId);
	if(scene==null){
		var display=document.getElementById("storyDisplay");
		display.innerHTML="Oops, something has gone wrong! Sorry about that!";
		return;
	}
	if(saveMove){
		choices.push(scene);
	}

	var display=document.getElementById("storyDisplay");
	display.innerHTML=scene.getHTML();
	//updateChoices();
}
function selectQuestion(tarId){
	let question=scenario.getQuestion(tarId);
	if(question==null){
		displaySummary();
		//var display=document.getElementById("storyDisplay");
		//display.innerHTML="Oops, something has gone wrong! Sorry about that!";
		return;
	}
	var display=document.getElementById("storyDisplay");
	display.innerHTML=question.getHTML();
}

function updateChoices(){

	var generated="<div class='choicesHistory'><div class='container'><p class='summaryTitle'>This was your story</p>";

	let i;
	for(i=0;i<choices.length;i++){
		generated+=choices[i].getSmallHTML();
	}

	generated+="</div></div>";

	var display=document.getElementById("choicesDisplay");
	display.innerHTML=generated;
}

function displaySummary(){
	var display=document.getElementById("storyDisplay");
	display.innerHTML="<div class='ending'>"+
    	"<p class='endingTitle'>The end</p>"+
    	"<p class='endingDescription'>You can see the life of an adventurer is very difficult.</p>"+
    	"<div class='center'><button class='end'>Continue</button></div>"
  		"</div>";
  	updateChoices();
}

var choices=[];
//var loadData = JSON.parse(readTextFile("scenarios/demo1/data.json"));
var scenario=new Scenario();

scenario.addScene(new Scene(1,1,"You returned to the start","You've returned to where you started... the cycle continues."));
scenario.addScene(new Scene(2,2,"You went right","That was the right choice."));
scenario.addScene(new Scene(3,3,"You went left","You went down the left path."));

scenario.addScene(new Scene(4,6,"You followed the rabbit","You follow the rabbit deep into the woods to a clearing."));
scenario.addScene(new Scene(5,4,"You ignored the rabbit","You continue down the path ignoring the rabbit, it's probably nothing."));
scenario.addScene(new Scene(6,4,"You threw a rock at the rabbit","You throw a rock at the rabbit, unfortunately it misses. You continue down the path."));

scenario.addScene(new Scene(7,null,"You became the leafs","Leafs are amazing! You jump right in and disappear forever into the pile. You are now one with the leafs. A little while later the wind picks up and you blow away."));
scenario.addScene(new Scene(8,4,"You ignored the leafs","The leafs hate you too. You can sense them judging you as you walk past them and continue on your journey."));

scenario.addScene(new Scene(9,5,"You approached the castle","You stand and admire the great stone walls and wonder what is inside...<img src='img/castle.png'>"));
scenario.addScene(new Scene(10,null,"You ran home","You decide this adventure stuff is for someone else. You turn around and head home."));

scenario.addScene(new Scene(11,null,"A dragon killed you","Unfortunately the dragon is bigger and faster that you. There is nothing you can do and so you accept your fate."));

scenario.addScene(new Scene(12,null,"You got poisoned","Both wells are poisoned. The rabbit waits for you to die and then steals all of your stuff."));

let tempQuestion1=new Question(1,"You come to a fork in the road, which way do you go?");
tempQuestion1.addOption(new Option(3,"Go left","img/left.png"));
tempQuestion1.addOption(new Option(2,"Go right","img/right.png"));
scenario.addQuestion(tempQuestion1);

let tempQuestion2=new Question(2,"A white rabbit crosses the path ahead of you.");
tempQuestion2.addOption(new Option(4,"Follow it into the woods","img/test.png"));
tempQuestion2.addOption(new Option(5,"Ignore it","img/test.png"));
tempQuestion2.addOption(new Option(6,"Throw a rock at it","img/test.png"));
scenario.addQuestion(tempQuestion2);

let tempQuestion3=new Question(3,"You see a suspicious pile of leafs on the ground.");
tempQuestion3.addOption(new Option(7,"Yay leafs!","img/test.png"));
tempQuestion3.addOption(new Option(8,"I hate leafs...","img/test.png"));
scenario.addQuestion(tempQuestion3);

let tempQuestion4=new Question(4,"Ahead lies a massive castle.");
tempQuestion4.addOption(new Option(9,"Approach the castle","img/test.png"));
tempQuestion4.addOption(new Option(10,"Go home","img/test.png"));
scenario.addQuestion(tempQuestion4);

let tempQuestion5=new Question(5,"A dragon appears out of nowhere!");
tempQuestion5.addOption(new Option(11,"Attempt to fight","img/test.png"));
tempQuestion5.addOption(new Option(11,"Attempt to run","img/test.png"));
scenario.addQuestion(tempQuestion5);

let tempQuestion6=new Question(6,"In the clearing are two wells. The rabbit begins to speak and tells you one is the fountain of life and the other the fountain of death.");
tempQuestion6.addOption(new Option(12,"Drink from the white well","img/test.png"));
tempQuestion6.addOption(new Option(12,"Drink from the black well","img/test.png"));
tempQuestion6.addOption(new Option(10,"Give up ang go home","img/test.png"));
scenario.addQuestion(tempQuestion6);

selectQuestion(1);

function readTextFile(file)
{
	var allText="";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                allText = rawFile.responseText;
                // document.getElementById("debug").innerHTML = allText;
            }
        }
    }
    console.log(rawFile);
    rawFile.send(null);
    return allText;
}