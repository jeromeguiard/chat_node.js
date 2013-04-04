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
* Retrieving message from the server
*/
function getMessage(){
    var source = new EventSource('/message');
    source.addEventListener('message', function(e){
        insertNewMessage(e.data);
    },false);
}

/*
* Function set to retrieve a message every 5 seconds
*/
function main(){
    getMessage();
}

/*
* Submit message by sending it to the server thanks to a post method
*/
function submitMessage(){
    var messageValue = document.getElementById("message").value;
    var usernameValue = document.getElementById("username").value;
    var dataToSend = "message="+messageValue+"&author="+usernameValue;
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.addEventListener("load", function(){
        insertNewMessage(this.response);
    });
    xmlhttp.open("POST", "/message", true);
    xmlhttp.setRequestHeader("Content-Type",
                             "application/x-www-form-urlencoded");
    xmlhttp.send(dataToSend);
    document.getElementById("message").value = "";
}
