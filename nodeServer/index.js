const http = require('http');
const { parse } = require('querystring');
var express = require('express');
var bodyParser = require('body-parser');

class ScenarioSummary{
	//int scenarioId
	//String name
	//String desctiption
	constructor(scenario){
		this.scenarioId=scenario.scenarioId;
		this.name=scenario.name;
	}
}

var allScenarios=[];
var currentScenarioId=0;


const port = 3000;
var app = express();
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//basic testing methods
app.get('/', (req, res) => res.send('Server is running'))
app.post('/', function(req, res) {
	console.log(req.body);
	res.sendStatus(200);
});


//create/update scenario
app.post('/scenario', function(req, res) {
	console.log("create/update");
	let toAdd=req.body;
	console.log(toAdd);
	//TODO validation <<>>
	if(toAdd.scenarioId){
		console.log("has id",toAdd);
		//<<>>
	}else{
		console.log("no id",toAdd);
		let newId=assignScenarioId();
		toAdd.scenarioId=newId;
		allScenarios.push(toAdd);
	}
	res.sendStatus(200);
	//console.log(allScenarios);
	//res.sendStatus(200);
});
app.get('/scenario/newid', function(req, res) {
	res.send(""+currentScenarioId);
});
//get list of scenario summaries
app.get('/scenario/list', function(req, res) {
	res.send(JSON.stringify(allScenarioSummaries()));
});
function allScenarioSummaries(){
	let summaries=[];
	let i;
	for(i=0;i<allScenarios.length;i++){
		summaries.push(new ScenarioSummary(allScenarios[i]));
	}
	return summaries;
}
//get a specific scenario
app.get('/scenario', function(req, res) {
	var id = req.query.id;
	res.send(JSON.stringify(getScenario(id)));
});
function getScenario(id){//improve with binary search?<<>>
	if(id!=null){
		let i;
		for(i=0;i<allScenarios.length;i++){
			if(allScenarios[i].scenarioId==id){
				return allScenarios[i];
			}
		}
	}
	return null;
}
//create/update scenario
app.post('/scenario/delete', function(req, res) {
	var id = req.query.id;
	if(deleteScenario(id)){
		console.log("deleted "+id);
	}else{
		console.log("could not delete "+id);
	}
	res.sendStatus(200);
});
function deleteScenario(id){//improve?<<>>
	if(id!=null){
		let i;
		for(i=0;i<allScenarios.length;i++){
			if(allScenarios[i].scenarioId==id){
				allScenarios.splice(i,1);
				return true;
			}
		}
	}
	return false;
}

function assignScenarioId(){
	currentScenarioId++;
	return currentScenarioId;
}

app.listen(port, () => console.log(`app listening on port ${port}!`))