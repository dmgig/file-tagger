console.log('app.js');

var app = angular.module('fileTaggerApp', ['ngRoute']);

app.config(function($locationProvider, $routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/tagging.html"
    })
    .when("/tagging", {
        templateUrl : "views/tagging.html"
    })
    .when("/files", {
        templateUrl : "views/files.html"
    })
    .otherwise({redirectTo: '/'});;
    
    $locationProvider.html5Mode(true);
});

app.controller('ftController', ['$scope', '$http', function ($scope, $http) {
    
  $scope.searchTerm = '';
  $scope.fileList   = [];
  $scope.activeFile = false;
  $scope.tagList    = [];

  var timer;      
  $scope.$watch('searchTerm', function(n, o){
    
    clearTimeout(timer);
    timer = setTimeout(function(){
    
      console.log("NEW: "+n);
      console.log("OLD: "+o);
      
      if(n == '' && o == '') return;
      
      if(n == ''){
        getFileList(); return;
      }
      
      if(n != o){
        console.log('SEARCH TERM: '+$scope.searchTerm);
        $scope.fileList = [];
        $http({
          method: 'GET',
          url:    '/api/files/search/'+$scope.searchTerm
        }).then(function successCallback(response) {
          console.log("SEARCH RESPONSE: "+$scope.searchTerm);
          console.log(response);
          $scope.fileList = response.data;
          $scope.activeFile = false;
          moveActiveFile(0);
        }, function errorCallback(response) {
          console.log('error');
          console.log(response);
        });        
      }
    }, 750);
  });  
  
  // Simple GET request example:
  var getFileList = function(){
    $scope.fileList = [];
    $http({
      method: 'GET',
      url:    '/api/filelist'
    }).then(function successCallback(response) {
      console.log(response);
      $scope.fileList = response.data;
      $scope.activeFile = false;
      moveActiveFile(0);
    }, function errorCallback(response) {
      console.log('error');
      console.log(response);
    });
  }
  getFileList();
  
  $scope.clickFile = function(index){
     moveActiveFile(index);
  }

  $scope.keyPress = function($event){
    // 40 = up 38 = down, 37 = left, 39 = right
    var keyCode = $event.which || $event.keyCode;
    console.log(keyCode);
    switch(keyCode){
      case 38:
        keyPressedUp($event);
        break;
      case 40:
        keyPressedDown($event);
        break;
      case 39:
        keyPressedRight($event);
        break;
      case 37:
        keyPressedLeft($event);
        break;
      default: break;
    }
    $scope.$apply(); 
  }

  var $doc = angular.element(document);

  $doc.on('keydown', $scope.keyPress);
  $scope.$on('$destroy',function(){
    $doc.off('keydown', $scope.keyPress);
  });


  var createFile = function(data, callback){
    $http({
      method: 'POST',
      url:    '/api/files',
      data:   data
    }).then(function successCallback(response) {
      callback(response.data);
    }, function errorCallback(response) {
      console.log('error');
      console.log(response);
    });      
  }
  
  var retrieveFileByPath = function(path, callback){
    $http({
      method: 'GET',
      url:    '/api/files/path/'+encodeURIComponent(path)
    }).then(function successCallback(response) {
      console.log(response);
      callback(response.data);
    }, function errorCallback(response) {
      console.log('error');
      console.log(response);
    });       
  }
  
  var updateFile = function(data, callback){
    console.log('UPDATING FILE');
    console.log(data);
    $http({
      method: 'PUT',
      url:    '/api/files/'+data._id,
      data:   data
    }).then(function successCallback(response) {
      console.log(response);
      callback(response.data);
    }, function errorCallback(response) {
      console.log('error');
      console.log(response);
    });       
  }

  
  function moveActiveFile(new_key){
  
    console.log('NEW KEY: '+new_key);
  
    // If there is an exit file and has an id, update it
    console.log($scope.activeFile);
    if($scope.activeFile){
      if(typeof $scope.fileList[$scope.activeFile]._id !== typeof undefined){
        $scope.fileList[$scope.activeFile].tags = $scope.tagList;
        updateFile($scope.fileList[$scope.activeFile], function(response){
          console.log('UPDATED '+$scope.fileList[$scope.activeFile]._id);
        });
      }
    }
  
    // Newly selected file
    $scope.activeFile = new_key;
    $scope.tagList = [];
    
    var current_path = $scope.fileList[$scope.activeFile].path;
    retrieveFileByPath(current_path, function(data){
      console.log(data);
      if(data === null){
        console.log('no file saved. Creating record.');
        createFile($scope.fileList[$scope.activeFile], function(data){
          console.log('created file');
          console.log(data);
          $scope.fileList[$scope.activeFile].tags = $scope.tagList;
          $scope.fileList[$scope.activeFile]._id = data._id;          
        });
      }else{
        $scope.fileList[$scope.activeFile]._id = data._id;
        $scope.tagList = data.tags;
      }
      $('.filelist').removeClass('active');
      var newFileDiv = $("#files").find("div[data-fileid='"+$scope.activeFile+"']");
      newFileDiv.addClass('active');
    });
  }
  
  /**
   * make file active above current
   * if at top of file list, do nothing
   */
  function keyPressedUp($event){
    $event.preventDefault();
    if($scope.activeFile == 0) return;
    moveActiveFile(Number($scope.activeFile) - 1);
  }

  /**
   * make file active below current
   * if at bottom of file list, do nothing
   */      
  function keyPressedDown($event){
    $event.preventDefault();
    if($scope.activeFile == $scope.fileList.length - 1) return;
    var new_key = Number($scope.activeFile) + 1;
    console.log(new_key);
    moveActiveFile(new_key);        
  }
  
  /**
   * Dictation
   */
  if (window.hasOwnProperty('webkitSpeechRecognition')) {

    var recognition = new webkitSpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.lang = "en-US";

    recognition.onresult = function(e) {
      var result = e.results[0][0].transcript;
      $('#transcript').val(result);
      recognition.stop();
      console.log('got result '+result);
      dumpTag(result);
      $('#transcript').val('');
    };

    recognition.onerror = function(e) {
      recognition.stop();
    }

  }       

  var keyIsPressed = false;
  
  function keyPressedRight($event){
    $event.preventDefault();
    if(!keyIsPressed){
      $("#mic").addClass('recording', 500);
      recognition.start();
    }
    keyIsPressed = true;
  }
  
  function keyUpRight($event){
    $event.preventDefault();
    keyIsPressed = false;
    var keyCode = $event.which || $event.keyCode;
    if(keyCode == 39){
      $("#mic").removeClass('recording', 250);
      recognition.stop();
    }
  }

  $doc.on('keyup', keyUpRight);
  $scope.$on('$destroy',function(){
    $doc.off('keyup', keyUpRight);
  });
  
  function keyPressedLeft($event){
    $event.preventDefault();
    recognition.stop();
    $scope.tagList.pop();
  }

  var dumpTag = function(tag){
    $scope.tagList.push(tag);
    $scope.$apply();
  }

  $scope.searchClear = function(){
    $scope.searchTerm = '';
  }
    
    
}]);
