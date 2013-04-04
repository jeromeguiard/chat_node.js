//lastMessage Id used to know the last message received
var lastMessageId = 0;
/*
* when there is a new message create a new element and insert it.
*/
function insertNewMessage(message){
    var messageAsJson = JSON.parse(message);
    for(var key in messageAsJson){
	if(parseInt(messageAsJson[key].id) >= lastMessageId){
            var elementMessage = document.createElement("div");
            var elementContent = document.createElement("div");
            var elementAuthor = document.createElement("div");
            var mainElement = document.getElementById("chat");
            elementContent.innerText = messageAsJson[key].content;
            elementAuthor.innerText = messageAsJson[key].author;
            elementMessage.appendChild(elementContent);
            elementMessage.appendChild(elementAuthor);
            mainElement.appendChild(elementMessage);
            lastMessageId++; 
        }
    }
}

/*
* Retrieving message from the server
*/
function getMessage(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "/message?from="+lastMessageId);
    xmlhttp.addEventListener("load", function(){
        insertNewMessage(this.response);
    });
    xmlhttp.send(null);
}

/*
* Function set to retrieve a message every 5 seconds
*/
function main(){
    window.setInterval(getMessage, 5000);
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
