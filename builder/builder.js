
const serverUrl="http://localhost:3000/";

class Scenario{
  //String name

  //ArrayList<> data
  //ArrayList<> statuses
  constructor(){
    this.name="new scenario";
    this.data=[];
    this.statuses=[];
  }
}
class Status{
  //int USId
  //float value

  //String name
  //String displayType
  //float startVal
  //float max
  //float min
  constructor(){
    this.name="new status";
    this.startVal=0;
    this.max=null;
    this.min=null;
  }
}
class Effect{
  //Status status
  //float effect
  constructor(){
    this.status=null;
    this.effect=0;
  }
}

//USId = universal scenario Identifier
class Start{
  //String editType
  //int USId

  //String name
  //String title
  //String description
  //media<<>>

  //int nextScene (USId)
  constructor(){
    this.editType="start";
    this.USId=null;
  }
}
class SceneSolo{
  //String editType
  //int USId

  //String name
  //String title
  //String description
  //media<<>>

  //int nextScene (USId)
  constructor(){
    this.editType="sceneSolo";
    this.USId=null;
    this.name="new scene";
    this.title="title";
    this.description="description";
  }
}
class SceneQuestion{
  //String editType
  //int USId

  //String name
  //String title
  //String description
  //media<<>>

  //ArrayList<Choice> choices
  constructor(){
    this.editType="sceneQuestion";
    this.USId=null;
    this.name="new scene";
    this.title="title";
    this.description="description"; 
  }

}
class Choice{
  //String editType
  //int USId

  //String name
  //String description 
  //ArrayList<Effect> effects

  //int nextScene (USId)
  constructor(){
    this.editType="choice";
    this.USId=null;
    this.name="new choice";
    this.description="description"; 
    this.effects=[];
  }
}
class Vector {
  constructor(xOrVec,y,angleInit) {
    if(arguments.length == 1) {
      this.x=xOrVec.x;
      this.y=xOrVec.y;
    }else {
      let x=xOrVec;
      if(arguments.length == 3&&angleInit){
        this.x=Math.cos(x)*y;
        this.y=Math.sin(x)*y;
      }else{
        this.x=x;
        this.y=y;
      }
    }
    //console.log(this,xOrVec,y,angleInit);
  }
  addVec(vec) {
    this.x+=vec.x;
    this.y+=vec.y;
  }
  subVec(vec) {
    this.x-=vec.x;
    this.y-=vec.y;
  }
  sclVec(scale) {
    this.x*=scale;
    this.y*=scale;
  }
  nrmVec(){
    this.sclVec(1/this.getMag());
  }
  nrmVec(mag){
    this.sclVec(mag/this.getMag());
  }
  limVec(lim){
    var mag=this.getMag();
    if(mag>lim){
      this.sclVec(lim/mag);
    }
  }
  getAng() {
    return Math.atan2(this.y, this.x);
  }
  getAng(vec) {
    return Math.atan2(vec.y-this.y, vec.x-this.x);
  }
  getMag() {
    return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2));
  }
  getMag(vec) {
    return Math.sqrt(Math.pow(vec.x-this.x,2)+Math.pow(vec.y-this.y,2));
  }
  rotVec(rot){
    var mag=this.getMag();
    var ang=this.getAng();
    ang+=rot;
    this.x=Math.cos(ang)*mag;
    this.y=Math.sin(ang)*mag;
  }
  minVec(min){
    this.x=Math.min(this.x,min.x);
    this.y=Math.min(this.y,min.y);
  }
  maxVec(max){
    this.x=Math.max(this.x,max.x);
    this.y=Math.max(this.y,max.y);
  }
  inRange(vec,dist){
    let diffX=Math.abs(vec.x-this.x);
    if(diffX>dist){
      return false;
    }
    let diffY=Math.abs(vec.y-this.y);
    if(diffY>dist){
      return false;
    }
    return Math.sqrt(Math.pow(diffX,2)+Math.pow(diffY,2))<=dist;
  }
  setVec(vec){
    this.x=vec.x;
    this.y=vec.y;
  }
}

//---------------------------------------------
class Slot{
  //Vector pos;
  //Vector size;
  //Box held;
  //String type;
  
  //alt: (clone,p)
  constructor(p,s,t){
    if(arguments.length == 2) {
      this.pos=new Vector(s);
    
      this.size=new Vector(p.size);
      this.held=null;
      this.type=p.type;
    }else{
      this.pos=new Vector(p);
      this.size=new Vector(s);
      this.held=null;
      this.type=t;
    }
  }


  inBounds(target){
    return target.x>=this.pos.x&&target.y>=this.pos.y
      && target.x<=this.pos.x+this.size.x&&target.y<=this.pos.y+this.size.y;
  }
  canHold(toTest){
    return toTest.getType()==this.type;
  }
  getHeld(){
    return this.held;
  }
  isFull(){
    return this.held!=null;
  }
  emptySlot(){
    this.held=null;
  }
  display(){
    noStroke();
    fill("#d0d0d0");
    drawRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
    if(this.held!=null){
      this.held.display();
    }
  }
  fillSlot(toFill){
    this.held=toFill;
    this.held.setPos(this.pos);
  }
  move(toMove){
    this.pos.addVec(toMove);
    if(this.held!=null){
      this.held.move(toMove);
    }
  }
}
class Connection{
  //Vector startPos;
  //Vector endPos;
  //Box start;
  //Box end;

  constructor(s){
    this.start=s;
    this.updatePos();
    this.end=null;
    this.endPos=null;
  }
  applyUSId(){
    if(this.start!=null&&this.end!=null){
      let startData=this.start.data;
      let endData=this.end.data;
      if(startData!=null&&endData!=null){
        startData.nextUSId=endData.USId;
      }
    }
  }
  reset(){
    this.end=null;
    this.endPos=null;
  }
  setEnd(toSet){
    this.end=toSet;
    this.updatePos();
  }
  updatePos(){
    this.startPos=this.start.getOutNode();
    if(this.end!=null){
      this.endPos=this.end.getInNode();
    }
  }
  setEndPos(toMove){
    this.endPos=new Vector(toMove);
  }
  inBounds(target){
    if(this.endPos==null){
      return target.getMag(this.startPos)<nodeSize/2;
    }else{
      return target.getMag(this.endPos)<nodeSize/2||target.getMag(this.startPos)<nodeSize/2;
    }
  }
  getStart(){
    return this.start;
  }
  getEnd(){
    return this.end;
  }
  display(){
    if(this.endPos!=null){
      stroke("#000000");
      noFill();
      drawLine(this.startPos.x,this.startPos.y,this.endPos.x,this.endPos.y);
      
      let tri1=new Vector(nodeSize/2,0);
      let tri2=new Vector(PI/2+0.4,nodeSize/2,true);
      let tri3=new Vector(-PI/2-0.4,nodeSize/2,true);
      tri1.addVec(this.endPos);
      tri2.addVec(this.endPos);
      tri3.addVec(this.endPos);
      drawLine(tri1.x,tri1.y,tri2.x,tri2.y);
      drawLine(tri2.x,tri2.y,tri3.x,tri3.y);
      drawLine(tri1.x,tri1.y,tri3.x,tri3.y);
      //ellipse(endPos.x,endPos.y,nodeSize,nodeSize);
    }
    noFill();
    stroke("#000000");
    drawCircle(this.startPos.x,this.startPos.y,nodeSize);
  }
}
class Box{
  //ArrayList<Slot> slots;
  //Connection con;
  //Vector pos;
  //Vector size;
  //String type;
  //boolean hasOut;
  //boolean hasIn;

  //data

  constructor(p, s, t, hO, hI,d){
    this.slots=[];
    this.pos=new Vector(p);
    this.size=new Vector(s);
    this.type=t;
    this.hasOut=hO;
    this.hasIn=hI;
    if(this.hasOut){
      this.con=new Connection(this);
    }else{
      this.con=null;
    }
    this.data=d;
    if(this.data!=null){
      if(this.data.pos){
        this.pos=new Vector(this.data.pos.x,this.data.pos.y);
      }

      if(this.data.effects){
        let i;
        for(i=0;i<this.data.effects.length;i++){
          if(this.data.effects[i].status){
            let realStatus=getStatusByUSId(this.data.effects[i].status.USId);
            this.data.effects[i].status=realStatus;
          }
        }
      }
    }
  }

  setUSId(){
    if(this.data!=null){
      this.data.USId=assignUSId();
    }

    let i;
    for(i=0;i<this.slots.length;i++){
      let held=this.slots[i].getHeld();
      if(held!=null){
        held.setUSId();
      }
    }
  }
  getSaveData(){
    this.data.pos=this.pos;
    return this.data;
  }

  kill(){
    //you only need to delete the connections as nested boxes are not part of the global array
    killCons(this);
    let i;
    for(i=0;i<this.slots.length;i++){
      let held=this.slots[i].getHeld();
      if(held!=null){
        held.kill();
      }
    }
  }
  
  getCon(){
    return this.con;
  }
  addAllCons(addTo){
    if(this.con!=null){
      addTo.push(this.con);
    }
    let i;
    for(i=0;i<this.slots.length;i++){
      let temp=this.slots[i].getHeld();
      if(temp!=null){
        temp.addAllCons(addTo);
      }
    }
  }
  loadCons(addTo){
    //console.log("t",this.data);
    if(this.con!=null){
      if(this.data&&this.data.nextUSId){
        this.con.setEnd(getByUSId(this.data.nextUSId));
      }
      addTo.push(this.con);
    }
    let i;
    for(i=0;i<this.slots.length;i++){
      let temp=this.slots[i].getHeld();
      if(temp!=null){
        temp.loadCons(addTo);
      }
    }
  }
  
  getOutNode(){
    let node=new Vector(this.pos);
    node.addVec(new Vector(this.size.x,this.size.y/2));
    return node;
  }
  getInNode(){
    let node=new Vector(this.pos);
    node.addVec(new Vector(0,this.size.y/2));
    return node;
  }
  
  addSlot(toAdd){
    this.slots.push(toAdd);
  }
  
  inBounds(target){
    return target.x>=this.pos.x&&target.y>=this.pos.y
      && target.x<=this.pos.x+this.size.x&&target.y<=this.pos.y+this.size.y;
  }
  setPos(newPos){
    let diff=new Vector(newPos);
    diff.subVec(this.pos);
    this.move(diff);
  }
  move(toMove){
    this.pos.addVec(toMove);
    let i;
    for(i=0;i<this.slots.length;i++){
      this.slots[i].move(toMove);
    }
  }
  grab(grabPos){
    let slot=this.getSlot(grabPos);
    if(slot==null){
      return this;
    }
    let held=slot.getHeld();
    if(held==null){
      return this;
    }
    slot.emptySlot();
    return held;
  }
  removeBox(grabBox){
    let slot=this.getSlotBox(grabBox);
    if(slot!=null){
      let held=slot.getHeld();
      slot.emptySlot();
      return held;
    }
    return null;
  }
  drop(toDrop,dropPos){
    let slot=this.getSlot(dropPos);
    if(slot==null){
      return false;
    }
    let held=slot.getHeld();
    if(held==null){
      if(slot.canHold(toDrop)){
        slot.fillSlot(toDrop);
        return true;
      }
    }
    return false;
  }
  getSlot(target){
    let i;
    for(i=this.slots.length-1;i>=0;i--){
      if(this.slots[i].inBounds(target)){
        return this.slots[i];
      }
    }
    return null;
  }
  getSlotBox(target){
    let i;
    for(i=this.slots.length-1;i>=0;i--){
      if(this.slots[i].getHeld()===target){
        return this.slots[i];
      }
    }
    return null;
  }
  
  getType(){
    return this.type;
  }

  update(){
    
  }
  
  display(){
    if(this===softSelect){
      stroke("#00ff00");
    }else{
      stroke("#000000");
    }
    fill("#B0B0B0");
    drawRect(this.pos.x,this.pos.y,this.size.x,this.size.y);
    let i;
    for(i=0;i<this.slots.length;i++){
      this.slots[i].display();
    }
    if(this.hasIn){
      stroke("#000000");
      let inPos=this.getInNode();
      let space=2;
      let tri1=new Vector(nodeSize/2+space,0);
      let temp=new Vector(PI/2+0.4,nodeSize/2+space,true);
      let diffX=temp.x;
      tri1.x-=diffX;
      let tri2=new Vector(0,temp.y);
      let tri3=new Vector(0,-temp.y);
      tri1.addVec(inPos);
      tri2.addVec(inPos);
      tri3.addVec(inPos);
      drawLine(tri1.x,tri1.y,tri2.x,tri2.y);
      drawLine(tri1.x,tri1.y,tri3.x,tri3.y);
    }
    fill("#000000");
    drawText(this.data.name||this.type,this.pos.x+this.size.x/2,this.pos.y+20);
  }
}

class InfiniteBox extends Box{
  //Slot templateSlot;
  //float topGap;
  //Box dropped;
  //int droppedIndex;

  constructor(p, s, t, hO, hI, ts, tg,d){
    super(p,s,t,hO,hI,d);
    this.templateSlot=ts;
    this.topGap=tg;
    
    this.dropped=null;
    this.droppedIndex=-1;

    //add choices from data if there are any
    if(this.data.choices){
      let slottedBoxes=[];
      let i;
      for(i=0;i<this.data.choices.length;i++){
        let choiceData=this.data.choices[i];
        slottedBoxes.push(new Box(new Vector(0,0),new Vector(230,80),"choice",true,false,choiceData));
      }

      this.slots=[];
      let addY=this.templateSlot.size.y+marginY;
      let addPos=new Vector(marginX,this.topGap);

      for(i=0;i<slottedBoxes.length;i++){
        let insertSlot=new Slot(this.templateSlot,addPos);
        insertSlot.fillSlot(slottedBoxes[i]);
        this.slots.push(insertSlot);
        addPos.y+=addY;
      }
      let addSlot=new Slot(this.templateSlot,addPos);
      this.slots.push(addSlot);
      addPos.y+=addY;
      this.size=new Vector(this.templateSlot.size.x+marginX*2,addPos.y-this.pos.y);
    }
    this.update();
  }

  //@Override
  getSaveData(){
    let childData=[];
    let i;
    for(i=0;i<this.slots.length;i++){
      let child=this.slots[i].getHeld();
      if(child!=null&&child.data!=null){
        childData.push(child.data);
      }
    }
    this.data.choices=childData;
    this.data.pos=this.pos;
    return this.data;
  }

  //@Override
  drop(toDrop,dropPos){
    let slot=null;
    let i;
    for(i=this.slots.length-1;i>=0;i--){
      if(this.slots[i].inBounds(dropPos)){
        let tempSlot=this.slots[i];
        if(tempSlot.canHold(toDrop)){
          slot=tempSlot;
          slot=this.slots[i];
          this.droppedIndex=i;
          this.dropped=toDrop;
          break;
        }
      }
    }
    
    if(slot!=null){
      return true;
    }
    return false;
  }

  //@Override
  update(){
    let slottedBoxes=[];
    let i;
    for(i=0;i<this.slots.length;i++){
      let toAdd=this.slots[i].getHeld();
      if(toAdd!=null){
        slottedBoxes.push(toAdd);
      }
    }
      
    if(this.dropped!=null){
      slottedBoxes.splice(Math.min(this.droppedIndex,slottedBoxes.length),0,this.dropped);
      this.dropped=null;
    }
      
    this.slots=[];
    //console.log(this.templateSlot);
    let addY=this.templateSlot.size.y+marginY;
    let addPos=new Vector(marginX,this.topGap);

    addPos.addVec(this.pos);
    for(i=0;i<slottedBoxes.length;i++){
      let insertSlot=new Slot(this.templateSlot,addPos);
      insertSlot.fillSlot(slottedBoxes[i]);
      this.slots.push(insertSlot);
      addPos.y+=addY;
    }
    let addSlot=new Slot(this.templateSlot,addPos);
    this.slots.push(addSlot);
    addPos.y+=addY;
    this.size=new Vector(this.templateSlot.size.x+marginX*2,addPos.y-this.pos.y);
  }
}

function fill(toSet){
  fillVar=toSet;
}
function noFill(){
  fillVar="#00000000";
}
function stroke(toSet){
  strokeVar=toSet;
}
function noStroke(){
  strokeVar="#00000000";
}


function drawText(text,x,y){
  ctx.fillStyle = fillVar;
  ctx.font = 18*zoom+"px Arial";
  ctx.textAlign = "center";
  ctx.fillText(text, x*zoom+cam.x,y*zoom+cam.y); 
  //textAlign(CENTER);
  //textSize(size*zoom);
  //text(text,x*zoom+cam.x,y*zoom+cam.y);
}
function drawLine(x1,y1,x2,y2){
  ctx.strokeStyle = strokeVar;
  ctx.beginPath();
  ctx.moveTo(x1*zoom+cam.x,y1*zoom+cam.y);
  ctx.lineTo(x2*zoom+cam.x,y2*zoom+cam.y);
  ctx.stroke();
  //line(x1*zoom+cam.x,y1*zoom+cam.y,x2*zoom+cam.x,y2*zoom+cam.y);
}
function drawRect(x, y, w, h){
  ctx.strokeStyle = strokeVar;
  ctx.fillStyle = fillVar;
  ctx.beginPath();
  ctx.rect(x*zoom+cam.x,y*zoom+cam.y,w*zoom,h*zoom);
  ctx.fill();
  ctx.stroke();
  //ctx.fillRect(x*zoom+cam.x,y*zoom+cam.y,w*zoom,h*zoom);
}
function drawCircle(x, y, d){
  ctx.strokeStyle = strokeVar;
  ctx.fillStyle = fillVar;
  ctx.beginPath();
  ctx.arc(x*zoom+cam.x,y*zoom+cam.y,d/2*zoom, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke(); 
  //ellipse(x*zoom+cam.x,y*zoom+cam.y,w*zoom,h*zoom);
}
function drawBackground(){
  let canvasSize = canvas.getBoundingClientRect();
  ctx.fillStyle = fillVar;
  ctx.beginPath();
  ctx.rect(0,0,canvasSize.width,canvasSize.height);
  ctx.fill();
  //ctx.fillRect(x*zoom+cam.x,y*zoom+cam.y,w*zoom,h*zoom);
}

var allBoxes=[];
var allCons=[];
var selected=null;
var selectedCon=null;
var grabPos;
var softSelect=null;
var enableControls=true;

var nodeSize=15;
var marginX=20;
var marginY=20;

var zoomBase=1.1;
var zoomExp=0;
var zoom=Math.pow(zoomBase,zoomExp);
var minZoom=-30;
var maxZoom=20;
var moveSpeed=18;
var cam=new Vector(0,0);

var WDown;
var SDown;
var ADown;
var DDown;
var PI=Math.PI;
var strokeVar;
var fillVar;
var framerate=1000/60;

var allStatuses=[];

var canvas=document.getElementById("canvas");
var ctx=canvas.getContext("2d");

var realMouse=new Vector(0,0);

var controls=document.getElementById("controls");
var scenarioOptions=document.getElementById("scenarioOptions");
var storage = window.localStorage;
var currentUSId=0;
var loadedScenario=null;

setup();
draw();
setInterval(()=>{draw()},framerate);
document.onmousemove = handleMouseMove;
document.onmousedown = mousePressed;
document.onmouseup = mouseReleased;
canvas.onwheel = wheelMoved;
document.onkeydown=keyPressed;
document.onkeyup=keyReleased;
window.addEventListener("resize", resize);

function setup(){
  resize();
  noStroke();
  noFill();
  //size(800,800);

  if(serverLoad()){
    loadScenario();
  }else{
    let startData=new Start();
    let startBox=new Box(new Vector(150,150),new Vector(100,100),"start",true,false,startData);
    allBoxes.push(startBox);
    initConsBox(startBox);
  }
  updateControls();
  // allBoxes.push(new Box(new Vector(50,230),new Vector(250,100),"scene",true,true));
  // allBoxes.push(new Box(new Vector(50,10),new Vector(230,80),"choice",true,false));
  // let template=new Slot(new Vector(0,0),new Vector(230,80),"choice");
  // allBoxes.push(new InfiniteBox(new Vector(350,10),new Vector(230,80),"scene",false,true,template,50));
  // initCons();
}
function draw(){
  //println(frameRate);
  //background(255);
  noStroke();
  if(enableControls){
    fill("#DfDfDf");
  }else{
    fill("#C3C3C3");
  }
  drawBackground();
  if(selected!=null){
    let toSet=getMouse();
    toSet.subVec(grabPos);
    selected.setPos(toSet);
  }
  if(selectedCon!=null){
    let toSet=getMouse();
    selectedCon.setEndPos(toSet);
  }
  let i;
  for(i=0;i<allCons.length;i++){
    allCons[i].updatePos();
  }
  for(i=0;i<allBoxes.length;i++){
    allBoxes[i].display();
  }
  if(selected!=null){
    selected.display();
  }
  for(i=0;i<allCons.length;i++){
    allCons[i].display();
  }
  
  if(WDown){
    cam.y+=moveSpeed;
  }
  if(SDown){
    cam.y-=moveSpeed;
  }
  if(ADown){
    cam.x+=moveSpeed;
  }
  if(DDown){
    cam.x-=moveSpeed;
  }

  //to display mouse:
  //fill("#00A0A0");
  //drawRect(getMouse().x,getMouse().y,10,10);
}

function serverLoad(){
  let scnId =  localStorage.getItem('targetScenario');
  if(scnId!=-1){

    //get data from server
    var xhr = new XMLHttpRequest();
    xhr.open("get", serverUrl+"scenario"+"?id="+scnId, false);
    xhr.send( null );
    let data=JSON.parse(xhr.responseText);

    loadedScenario = data;
  }
  if(loadedScenario==null){
    loadedScenario=new Scenario();
    return false;
  }
  return true;
}
function loadScenario(){
  console.log(loadedScenario);
  allStatuses=loadedScenario.statuses;
  let seedBoxes=loadedScenario.data;
  let i;
  //add all boxes
  for(i=0;i<seedBoxes.length;i++){
    let addBox;
    let data=seedBoxes[i];
    if(data.editType=="sceneSolo"){
      addBox=new Box(new Vector(0,0),new Vector(250,100),"scene",true,true,data);
    }else if(data.editType=="sceneQuestion"){
      let topGap=50;
      let slotSize=new Vector(230,80);
      let template=new Slot(new Vector(0,0),slotSize,"choice");
      addBox=new InfiniteBox(new Vector(0,0),new Vector(0,0),"scene",false,true,template,topGap,data);
    }else if(data.editType=="choice"){
      addBox=new Box(new Vector(0,0),new Vector(230,80),"choice",true,false,data);
    }else if(data.editType=="start"){
      addBox=new Box(new Vector(150,150),new Vector(100,100),"start",true,false,data);
    }
    allBoxes.push(addBox);
  }
  //connect all boxes
  for(i=0;i<allBoxes.length;i++){
    allBoxes[i].loadCons(allCons);
  }
}
function getByUSId(tarId){
  for(i=0;i<allBoxes.length;i++){
    if(allBoxes[i].data&&allBoxes[i].data.USId==tarId){
      return allBoxes[i];
    }
  }
  return null;
}
function getStatusByUSId(tarId){
  for(i=0;i<allStatuses.length;i++){
    if(allStatuses[i].USId==tarId){
      return allStatuses[i];
    }
  }
  return null;
}
function newScene(){
  let data=new SceneSolo();

  let spawnPos=getScreenCenter();
  let size=new Vector(250,100);
  let half=new Vector(size);
  half.sclVec(0.5);
  spawnPos.subVec(half);

  let addBox=new Box(spawnPos,size,"scene",true,true,data);
  allBoxes.push(addBox);
  initConsBox(addBox);
}
function newQuestion(){
  let data=new SceneQuestion();

  let spawnPos=getScreenCenter();
  let topGap=50;
  let slotSize=new Vector(230,80);
  let size=new Vector(slotSize);
  size.addVec(new Vector(marginX*2,topGap+marginY));

  let half=new Vector(size);
  half.sclVec(0.5);
  spawnPos.subVec(half);

  let template=new Slot(new Vector(0,0),slotSize,"choice");
  let addBox=new InfiniteBox(spawnPos,new Vector(0,0),"scene",false,true,template,topGap,data);
  allBoxes.push(addBox);
  initConsBox(addBox);

}
function newChoice(){
  let data=new Choice();

  let spawnPos=getScreenCenter();
  let size=new Vector(230,80);
  let half=new Vector(size);
  half.sclVec(0.5);
  spawnPos.subVec(half);

  let addBox=new Box(spawnPos,size,"choice",true,false,data);
  allBoxes.push(addBox);
  initConsBox(addBox);
}

function resize(){
  canvas.width = document.getElementsByTagName("BODY")[0].offsetWidth;
  canvas.height = Math.max(window.innerHeight-200,200);
}
function mousePressed(){
  let scrollY = window.scrollY

  let mouse=new Vector(realMouse);
  let rect = canvas.getBoundingClientRect();
  let minX=0;
  let minY=0;
  let maxX=minX+rect.width;
  let maxY=minY+rect.height;
  enableControls=(mouse.x>=minX&&mouse.x<=maxX && mouse.y>=minY&&mouse.y<=maxY);

  if(!enableControls){
    return;
  }
  mouseDown(getMouse());
}
function mouseReleased(){
  if(!enableControls){
    return;
  }
  mouseUp(getMouse());
}

function initCons(){
  let i;
  for(i=allBoxes.length-1;i>=0;i--){
    allBoxes[i].addAllCons(allCons);
  }
}
function initConsBox(box){
  box.addAllCons(allCons);
}

function update(){
  let i;
  for(i=allBoxes.length-1;i>=0;i--){
    allBoxes[i].update();
  }
}
function getScreenCenter(){
  let rect = canvas.getBoundingClientRect();
  let center=new Vector(rect.width,rect.height);
  center.sclVec(0.5);
  center.subVec(cam);
  center.sclVec(1/zoom);
  return center;
}
function handleMouseMove(event) {
  let rect = canvas.getBoundingClientRect();
  realMouse=new Vector(event.clientX - rect.left, event.clientY - rect.top);
}
function getMouse(){
  return new Vector((realMouse.x-cam.x)/zoom,(realMouse.y-cam.y)/zoom);
}
function mouseDown(pos){
  forcePushControls(controls);
  softSelect=null;
  selectedCon=getOverCon(pos);
  if(selectedCon!=null){
    selectedCon.reset();
  }else{
    let target=getOver(pos);
    if(target!=null){
      selected=target.grab(pos);
      softSelect=selected;
      grabPos=new Vector(pos);
      grabPos.subVec(selected.pos);
      remove(allBoxes,selected);
    }
  }
  updateControls();
}
function mouseUp(pos){
  if(selectedCon!=null){
    dropCon(pos);
  }
  if(selected!=null){
    drop(pos);
  }
}

function dropCon(pos){
  let target=getOver(pos);
  if(target!=null&&target.hasIn){
    selectedCon.setEnd(target);
    selectedCon.updatePos();
  }else{
    selectedCon.reset();
  }
  selectedCon=null;
  
}
function drop(pos){
  let target=getOver(pos);
  if(target!=null){
    if(!target.drop(selected,pos)){
      allBoxes.push(selected);
    }
  }else{
    allBoxes.push(selected);
  }
  update();
  selected=null;
  //Box target=getTargetSlot(pos);
}
function getOver(pos){
  let i;
  for(i=allBoxes.length-1;i>=0;i--){
    if(allBoxes[i].inBounds(pos)){
      return allBoxes[i];
    }
  }
  return null;
}
function getOverCon(pos){
  let i;
  for(i=allCons.length-1;i>=0;i--){
    if(allCons[i].inBounds(pos)){
      return allCons[i];
    }
  }
  return null;
}

function deleteSoftSelect(){
  if(softSelect){
    if(softSelect.data==null||softSelect.data.editType!="start"){
      killBox(softSelect);
      softSelect=null;
    }
  }
  updateControls();
}
function killBox(toKill){
  let i;
  for(i=allBoxes.length-1;i>=0;i--){
    if(allBoxes[i]===toKill){
      allBoxes[i].kill();
      allBoxes.splice(i,1);
      return;
    }
  }

  for(i=allBoxes.length-1;i>=0;i--){
    let removed=allBoxes[i].removeBox(toKill);
    if(removed!=null){
      removed.kill();
      allBoxes[i].update();
      return;
    }
  }
}
function killCons(toKill){
  let i;
  for(i=allCons.length-1;i>=0;i--){
    if(allCons[i].getStart()===toKill){
      allCons.splice(i,1);
    }else if(allCons[i].getEnd()===toKill){
      allCons[i].reset();
    }
  }
}

function keyPressed(event){
  if(!enableControls){
    return;
  }
  let key=event.key;
  if(key=='w'||key=='W'){
    WDown=true;
  }
  if(key=='s'||key=='S'){
    SDown=true;
  }
  if(key=='a'||key=='A'){
    ADown=true;
  }
  if(key=='d'||key=='D'){
    DDown=true;
  }

  if(key=='Tab'){
    enableControls=false;
  }

  if(key=='Delete'){
    deleteSoftSelect();
  }
}
function keyReleased(event){
  if(!enableControls){
    return;
  }

  let key=event.key;
  if(key=='w'||key=='W'){
    WDown=false;
  }
  if(key=='s'||key=='S'){
    SDown=false;
  }
  if(key=='a'||key=='A'){
    ADown=false;
  }
  if(key=='d'||key=='D'){
    DDown=false;
  }
}
function wheelMoved(event) {
  if(!enableControls){
    return;
  }
  zoomExp=Math.min(maxZoom,Math.max(minZoom,zoomExp-Math.max(-2,Math.min(2,event.deltaY))));
  event.preventDefault();
  cam.subVec(new Vector(realMouse));
  cam.sclVec(1/zoom);
  zoom=Math.pow(zoomBase,zoomExp);
  cam.sclVec(zoom);
  cam.addVec(new Vector(realMouse));
}

function remove(arr,toRemove){
  let i;
  for( i = 0; i < arr.length; i++){ 
    if ( arr[i] === toRemove) {
      arr.splice(i, 1);
    }
  }
}

//---------------------------------------------
function localSave(){
  let toStore=loadedScenario;
  storage.setItem('scenario', JSON.stringify(exportScenerio(toStore)));
  console.log(storage);
}
function serverSave(){
  resetExport();
  let toStore=loadedScenario;
  toStore=exportScenerio(toStore);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl+"scenario", false);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(toStore));

  if(!loadedScenario.scenarioId){
    var xhr2 = new XMLHttpRequest();
    xhr2.open("get", serverUrl+"scenario/newid", false);
    xhr2.send( null );
    let newScnId=xhr2.responseText;

    console.log(newScnId);
    loadedScenario.scenarioId=newScnId;
    storage.setItem('targetScenario', newScnId);
  }
}

function resetExport(){
  currentUSId=0;
}
function exportScenerio(scenario){
  let i;
  //assign ids to Statuses
  for(i=0;i<allStatuses.length;i++){
    allStatuses[i].USId=assignUSId();
  }
  //assign ids
  for(i=0;i<allBoxes.length;i++){
    allBoxes[i].setUSId();
  }
  //set connections
  for(i=0;i<allCons.length;i++){
    allCons[i].applyUSId();
  }
  let allData=[];
  //get all data
  for(i=0;i<allBoxes.length;i++){
    let data=allBoxes[i].getSaveData();
    if(data!=null){
      allData.push(data);
    }
  }
  //set data
  scenario.data=allData;
  scenario.statuses=allStatuses;
  return scenario;
}

function assignUSId(){
  currentUSId++;
  return currentUSId;
}

function forcePushControls(target){
  let nodes=target.childNodes;
  let i;
  for(i=0;i<nodes.length;i++){
    if(nodes[i].push){
      nodes[i].push();
    }
    forcePushControls(nodes[i]);
  }
}

var effectControls;
function updateControls(){
  effectControls=[];
  while (controls.lastElementChild) {
    controls.removeChild(controls.lastElementChild);
  }
  while (scenarioOptions.lastElementChild) {
    scenarioOptions.removeChild(scenarioOptions.lastElementChild);
  }

  if(softSelect!=null){
    let data=softSelect.data;
    if(data.editType=="choice"){
      //add basic choice options
      let nameInput=document.createElement("INPUT");
      nameInput.setAttribute("type", "text");
      nameInput.setAttribute("value", data.name);
      nameInput.push = ()=>{data.name=nameInput.value};
      nameInput.onchange = ()=>{nameInput.push()};

      let descInput=document.createElement("INPUT");
      descInput.setAttribute("type", "text");
      descInput.setAttribute("value", data.description);
      descInput.push = ()=>{data.description=descInput.value};
      descInput.onchange = ()=>{descInput.push()};

      controls.appendChild(nameInput);
      controls.appendChild(descInput);

      let effectListDiv=document.createElement("DIV");
      //list of effects
      let effectList=data.effects;
      let i;
      for(i=0;i<effectList.length;i++){
        let effectItem=effectList[i];

        let effectDiv=document.createElement("DIV");

        //create dropdown
        let selector=document.createElement("SELECT");
        let noOption=document.createElement("OPTION");
        noOption.innerHTML="none";
        noOption.data=null;

        selector.appendChild(noOption);
        let j;
        for(j=0;j<allStatuses.length;j++){
          let option=document.createElement("OPTION");
          option.innerHTML=allStatuses[j].name;
          option.data=allStatuses[j];
          if(allStatuses[j]==effectItem.status){
            option.setAttribute("selected", "selected");
          }
          effectControls.push(option);
          selector.appendChild(option);
        }
        selector.onchange=()=>{effectItem.status=selector.options[selector.selectedIndex].data};


        let valInput=document.createElement("INPUT");
        valInput.setAttribute("type", "number");
        valInput.setAttribute("value", effectItem.effect);
        valInput.push = ()=>{effectItem.effect=valInput.value};
        valInput.onchange = ()=>{valInput.push()};

        let remBtn=document.createElement("BUTTON");
        remBtn.innerHTML="remove";
        remBtn.onclick=()=>{remove(effectList,effectItem); updateControls();};

        effectDiv.appendChild(selector);
        effectDiv.appendChild(valInput);
        effectDiv.appendChild(remBtn);
        effectListDiv.appendChild(effectDiv);
      }
      let newEffBtn=document.createElement("BUTTON");
      newEffBtn.classList.add("newEffect");
      newEffBtn.innerHTML="add new effect";
      newEffBtn.onclick=()=>{effectList.push(new Effect()); updateControls();};

      effectListDiv.appendChild(newEffBtn);
      controls.appendChild(effectListDiv);
    }else if(data.editType=="sceneSolo"){
      let nameInput=document.createElement("INPUT");
      nameInput.setAttribute("type", "text");
      nameInput.setAttribute("value", data.name);
      nameInput.push = ()=>{data.name=nameInput.value};
      nameInput.onchange = ()=>{nameInput.push()};

      let titleInput=document.createElement("INPUT");
      titleInput.setAttribute("type", "text");
      titleInput.setAttribute("value", data.title);
      titleInput.push = ()=>{data.title=titleInput.value};
      titleInput.onchange = ()=>{titleInput.push()};

      let descInput=document.createElement("INPUT");
      descInput.setAttribute("type", "text");
      descInput.setAttribute("value", data.description);
      descInput.push = ()=>{data.description=descInput.value};
      descInput.onchange = ()=>{descInput.push()};

      controls.appendChild(nameInput);
      controls.appendChild(titleInput);
      controls.appendChild(descInput);
    }else if(data.editType=="sceneQuestion"){
      let nameInput=document.createElement("INPUT");
      nameInput.setAttribute("type", "text");
      nameInput.setAttribute("value", data.name);
      nameInput.push = ()=>{data.name=nameInput.value};
      nameInput.onchange = ()=>{nameInput.push()};

      let titleInput=document.createElement("INPUT");
      titleInput.setAttribute("type", "text");
      titleInput.setAttribute("value", data.title);
      titleInput.push = ()=>{data.title=titleInput.value};
      titleInput.onchange = ()=>{titleInput.push()};

      let descInput=document.createElement("INPUT");
      descInput.setAttribute("type", "text");
      descInput.setAttribute("value", data.description);
      descInput.push = ()=>{data.description=descInput.value};
      descInput.onchange = ()=>{descInput.push()};

      controls.appendChild(nameInput);
      controls.appendChild(titleInput);
      controls.appendChild(descInput);
    }

  }

  //Scenario and Status editor

  let sNameInput=document.createElement("INPUT");
  sNameInput.setAttribute("type", "text");
  sNameInput.setAttribute("value", loadedScenario.name);
  sNameInput.push = ()=>{loadedScenario.name=sNameInput.value};
  sNameInput.onchange = ()=>{sNameInput.push()};
  scenarioOptions.appendChild(sNameInput);

  let statusListDiv=document.createElement("DIV");

  let i;
  for(i=0;i<allStatuses.length;i++){
    let data=allStatuses[i];

    let statusDiv=document.createElement("DIV");

    let nameInput=document.createElement("INPUT");
    nameInput.setAttribute("type", "text");
    nameInput.setAttribute("value", data.name);
    nameInput.push = ()=>{data.name=nameInput.value};
    nameInput.onchange = ()=>{nameInput.push(); updateStatusControls();};

    let valInput=document.createElement("INPUT");
    valInput.setAttribute("type", "number");
    valInput.setAttribute("value", data.startVal);
    valInput.push = ()=>{data.startVal=valInput.value};
    valInput.onchange = ()=>{valInput.push()};

    let remBtn=document.createElement("BUTTON");
    remBtn.innerHTML="remove";
    remBtn.onclick=()=>{deleteStatus(data); updateControls();};

    statusDiv.appendChild(nameInput);
    statusDiv.appendChild(valInput);
    statusDiv.appendChild(remBtn);
    statusListDiv.appendChild(statusDiv);
  }
  let newStatBtn=document.createElement("BUTTON");
  newStatBtn.classList.add("newStatus");
  newStatBtn.innerHTML="add new status";
  newStatBtn.onclick=()=>{newStatus(); updateControls();};

  statusListDiv.appendChild(newStatBtn);
  scenarioOptions.appendChild(statusListDiv);
}
function updateStatusControls(){
  let i=0;
  for(i=0;i<effectControls.length;i++){
    effectControls[i].innerHTML=effectControls[i].data.name;
  }
}

function newStatus(){
  allStatuses.push(new Status());
}
function deleteStatus(toRemove){
  remove(allStatuses,toRemove);
}