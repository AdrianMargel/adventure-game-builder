
const serverUrl="http://localhost:3000/";
const siteUrl="http://127.0.0.1:5500/";
var storage = window.localStorage;

var scenarioList=document.getElementById("scenarioList");

update();

function update(){
  //clear list
  while (scenarioList.lastElementChild) {
    scenarioList.removeChild(scenarioList.lastElementChild);
  }

  //get data from server
  var xhr = new XMLHttpRequest();
  xhr.open("get", serverUrl+"scenario/list", false);
  xhr.send( null );
  let data=JSON.parse(xhr.responseText);
  console.log(data);

  //populate list
  let i;
  for(i=0;i<data.length;i++){
    let summaryDiv=document.createElement("DIV");
    summaryDiv.innerHTML=data[i].name;

    let scnId=data[i].scenarioId;

    let dltBtn=document.createElement("BUTTON");
    dltBtn.innerHTML="delete";
    dltBtn.onclick=()=>{deleteScenario(scnId)};
    let editBtn=document.createElement("BUTTON");
    editBtn.innerHTML="edit";
    editBtn.onclick=()=>{editScenario(scnId)};
    let viewBtn=document.createElement("BUTTON");
    viewBtn.innerHTML="play";
    viewBtn.onclick=()=>{viewScenario(scnId)};

    summaryDiv.appendChild(dltBtn);
    summaryDiv.appendChild(editBtn);
    summaryDiv.appendChild(viewBtn);
    scenarioList.appendChild(summaryDiv);
  }
}
function deleteScenario(id){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl+"scenario/delete"+"?id="+id, false);
  xhr.send( null );

  update();
}
function editScenario(id){
  storage.setItem('targetScenario', id);
  window.location.href = siteUrl+"/builder/builder.html";
}
function viewScenario(id){
  storage.setItem('targetScenario', id);
  window.location.href = siteUrl+"/player/player.html";
}
function newScenario(){
  storage.setItem('targetScenario', null);
  window.location.href = siteUrl+"/builder/builder.html";
}