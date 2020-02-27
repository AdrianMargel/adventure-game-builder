
var storage = window.localStorage;
var loadedScenario=null;
var currentScene=null;
var player=document.getElementById("player");
var statuses=document.getElementById("statuses");

init();

function init(){
  localLoad();
  initStatuses();
  let start=getStart();
  setScene(start.nextUSId);
  loadScene();
}
function localLoad(){
  console.log(storage);
  loadedScenario =  JSON.parse(localStorage.getItem('scenario'));
  console.log(loadedScenario);
}
function initStatuses(){
  let i;
  for(i=0;i<loadedScenario.statuses.length;i++){
    let stat=loadedScenario.statuses[i];
    stat.value=parseFloat(stat.startVal);
  }
}
function getStart(){
  let i;
  for(i=0;i<loadedScenario.data.length;i++){
    if(loadedScenario.data[i].editType=="start"){
      return loadedScenario.data[i];
    }
  }
  return null;
}
function getByUSId(targetId){
  for(i=0;i<loadedScenario.data.length;i++){
    if(loadedScenario.data[i].USId==targetId){
      return loadedScenario.data[i];
    }
  }
  return null;
}
function setScene(targetId){
  currentScene=getByUSId(targetId);
}
function loadScene(){
  //clear display
  while (player.lastElementChild) {
    player.removeChild(player.lastElementChild);
  }
  while (statuses.lastElementChild) {
    statuses.removeChild(statuses.lastElementChild);
  }

  //display statuses
  let i;
  for(i=0;i<loadedScenario.statuses.length;i++){
    let stat=loadedScenario.statuses[i];
    let statDisp=document.createElement("P");
    statDisp.innerHTML=`${stat.name}: ${stat.value}`;
    statuses.appendChild(statDisp);
  }

  //display scene
  if(currentScene.editType=="sceneSolo"){
    let title=document.createElement("P");
    title.classList.add("title");
    title.innerHTML=currentScene.title;

    let description=document.createElement("P");
    description.classList.add("description");
    description.innerHTML=currentScene.description;

    let nextBtn=document.createElement("BUTTON");
    nextBtn.classList.add("next");
    nextBtn.innerHTML="next";
    if(currentScene.nextUSId){
      nextBtn.onclick=()=>{setScene(currentScene.nextUSId);loadScene()};
    }else{
      nextBtn.onclick=()=>{end()};
    }

    player.appendChild(title);
    player.appendChild(description);
    player.appendChild(nextBtn);

  }else if(currentScene.editType=="sceneQuestion"){
    let title=document.createElement("P");
    title.classList.add("title");
    title.innerHTML=currentScene.title;

    let description=document.createElement("P");
    description.classList.add("description");
    description.innerHTML=currentScene.description;

    player.appendChild(title);
    player.appendChild(description);

    //add choices
    for(i=0;i<currentScene.choices.length;i++){
      let choice=document.createElement("BUTTON");
      choice.classList.add("choice");
      choice.innerHTML=currentScene.choices[i].description;
      let nextId=currentScene.choices[i].nextUSId;
      let choiceEffects=currentScene.choices[i].effects;
      if(nextId){
        choice.onclick=()=>{applyEffects(choiceEffects); setScene(nextId);loadScene()};
      }else{
        choice.onclick=()=>{applyEffects(choiceEffects); loadScene(); end()};
      }
      player.appendChild(choice);
    }
  }else{

  }
}
function end(){
  console.log("end");
}

function applyEffects(toApply){
  let i;
  for(i=0;i<toApply.length;i++){
    let j;
    for(j=0;j<loadedScenario.statuses.length;j++){
      let status=loadedScenario.statuses[j];
      if(toApply[i].status!=null&&status.USId==toApply[i].status.USId){
        status.value+=parseFloat(toApply[i].effect);
      }
    }
  }
}