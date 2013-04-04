//include node.js required modules
var server_http = require("http");
var querystring = require("querystring");
var url = require("url");
var fs = require('fs');

var messages = new Array();

//Create a message object
function messageObject(id, content, author){
    this.id = id;
    this.content = content;
    this.author = author;
    this.toString = function(){
        return JSON.stringify(this);
    }
}

function writeMessageFromId(id){
    var messagesToReturn = new Array()
    for (var key in messages){
         if (key >= id){
             messagesToReturn.push(messages[key])
         }
    }    
    return messagesToReturn;
}

function writeMessages(response, message){
    if (message === undefined) message = 0 ; 
    response.writeHead(201,{'Content-Type':'text/json'});
    response.write(JSON.stringify(writeMessageFromId(message)));
    response.end();
}

function postMessage(request, response){
    var fullbody = '';
    request.on('data',function(chunk){
        fullbody = chunk.toString();
    });
    request.on('end',function(){
        var jsonWithPost = querystring.parse(fullbody);
        var tempMessage = new messageObject(messages.length, 
                                            jsonWithPost.message, 
                                            jsonWithPost.author); 
        messages[messages.length] = tempMessage;
        writeMessages(response); 
    });
}

function getIndex(response){
    response.writeHead(201,{'Content-Type':'text/html'});
    response.write(fs.readFileSync("index.html"));
    response.end();
}

function getMainJs(response){
    response.writeHead(201,{'Content-Type':'text/javascript'});
    response.write(fs.readFileSync("main.js"));
    response.end();
}

server_http.createServer( function(request, response){
    var urlInfo = url.parse(request.url, true)
    var page = urlInfo.pathname

    if (page == "/message"){
        if(request.method == 'GET'){
            var fromMessage = urlInfo.query.from
            writeMessages(response, urlInfo.query.from); 
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
