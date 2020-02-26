class Scenario{
  //int scenarioId
  //ArrayList<> data
  constructor(){
    this.data=[];
  }
}

//USId = universal scenario Identifier
class SceneSolo{
  //String editType
  //int USId

  //String name
  //String title
  //String description
  //media<<>>

  //int nextScene (USId)
  //Box source
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
  //Box source
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
  //effects<<>>

  //int nextScene (USId)<<>>
  //Box source
  constructor(){
    this.editType="choice";
    this.USId=null;
    this.name="new choice";
    this.description="description"; 
  }
}

let loadedScenario=null;

var storage = window.localStorage;
function localLoad(){
  console.log(storage);
  loadedScenario =  JSON.parse(localStorage.getItem('scenario'));
}

function load(toLoad){
  loadedScenario=toLoad;
}

localLoad();
console.log(loadedScenario);