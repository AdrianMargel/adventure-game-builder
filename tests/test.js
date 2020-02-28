
var serverUrl="http://localhost:3000/";
var sampleData=["test 1","test 2","test 3"];

function test(){
  var xhr = new XMLHttpRequest();
  xhr.open("POST", serverUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(sampleData));
}
