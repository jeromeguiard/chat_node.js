var ws;
/*
* when there is a new message create a new element and insert it.
*/
function insertNewMessage(message){
    var messageAsJson = JSON.parse(message);
    var elementMessage = document.createElement("div");
    var elementContent = document.createElement("div");
    var elementAuthor = document.createElement("div");
    var mainElement = document.getElementById("chat");
    elementContent.innerText = messageAsJson.content;
    elementAuthor.innerText = messageAsJson.author;
    elementMessage.appendChild(elementContent);
    elementMessage.appendChild(elementAuthor);
    mainElement.appendChild(elementMessage);
}
/*
* Function set to retrieve a message every 5 seconds
*/
function main(){
    ws = new WebSocket("ws://192.168.56.101:8080");
    ws.onmessage = function(e){
        insertNewMessage(e.data);
    }
}

/*
* Submit message by sending it to the server thanks to a post method
*/
function submitMessage(){
    var messageValue = document.getElementById("message").value;
    var usernameValue = document.getElementById("username").value;
    var dataToSend = "message="+messageValue+"&author="+usernameValue;
    var message = {'content':  messageValue, 'author': usernameValue};
    ws.send(JSON.stringify(message));
    document.getElementById("message").value = "";
}
