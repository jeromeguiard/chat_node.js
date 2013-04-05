//include node.js required modules
var server_http = require("http");
var querystring = require("querystring");
var url = require("url");
var fs = require("fs");
var events = require("events");
var WebSocketServer = require('websocket').server;

//Create a message object
function messageObject(content, author){
    this.content = content;
    this.author = author;
    this.toString = function(){
        return JSON.stringify(this);
    }
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

var httpServer = server_http.createServer( function(request, response){
    var urlInfo = url.parse(request.url, true)
    var page = urlInfo.pathname

    if (page == "/message"){
    }
    if (page === "/"){
        getIndex(response);        
    }
    if (page === "/main.js"){
        getMainJs(response);
    }
});
httpServer.listen(8080);

wsServer = new WebSocketServer({
    httpServer: httpServer,
});
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    connection.on('message', function(message) {
        wsServer.broadcastUTF(message.utf8Data);
    });
    connection.on('close',function(){
            console.log("bye bye ");
       });
});

