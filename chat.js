//include node.js required modules
var server_http = require("http");
var querystring = require("querystring");
var url = require("url");
var fs = require("fs");
var events = require("events");

//Create our event object
var eventEmitter = new events.EventEmitter();

//Create a message object
function messageObject(content, author){
    this.content = content;
    this.author = author;
    this.toString = function(){
        return JSON.stringify(this);
    }
}


function postMessage(request, response){
    var fullbody = '';
    request.on('data',function(chunk){
        fullbody = chunk.toString();
    });
    request.on('end',function(){
        var jsonWithPost = querystring.parse(fullbody);
        var tempMessage = new messageObject(jsonWithPost.message, 
                                            jsonWithPost.author); 
        //creation of the event message 
        eventEmitter.emit("message", tempMessage.toString());
        response.writeHead(201,{'Content-Type':'text/json'});
        response.end();
    });
}

function getIndex(response){
    response.writeHead(200,{'Content-Type':'text/html'});
    response.write(fs.readFileSync("index.html"));
    response.end();
}

function getMainJs(response){
    response.writeHead(200,{'Content-Type':'text/javascript'});
    response.write(fs.readFileSync("main.js"));
    response.end();
}

server_http.createServer( function(request, response){
    var urlInfo = url.parse(request.url, true)
    var page = urlInfo.pathname

    if (page == "/message"){
        if(request.method == 'GET'){
            response.writeHead(200,{
                 'Content-Type':'text/event-stream',
                 'Cache-Control' : 'no-cache',
                 'Connection' : 'keep-alive'});
            // creation of the listener that is going to handle the response
            eventEmitter.once("message", function(message){
                 response.write("data:"+ message.toString() + "\n\n");
                 response.end()
                 delete response;
             });
        }
         else if(request.method == 'POST'){
            postMessage(request, response);
        }else{
           console.log("request Error");    
        }
    }
    if (page === "/"){
        getIndex(response);        
    }
    if (page === "/main.js"){
        getMainJs(response);
    }
}).listen(8080);
