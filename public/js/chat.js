var socket = io("https://namechat.herokuapp.com");
var id = "";

socket.on("server-send-number-user", function(data){
    $("#waiting").hide();
    $("#ready-chat").show();
    id = data.id;
});

socket.on("server-send-data", function(data){
    $("#chat_area").append("<div class='d-flex justify-content-start mb-4'><div class='img_cont_msg'><img src='img/cat.png' class='rounded-circle user_img_msg'></div><div id class='msg_cotainer'>" + data.msg.toString() + "</div></div>");
    $("#chat_area").animate({ scrollTop: $('#chat_area').prop("scrollHeight")}, 100);
});

socket.on("typing-to-client", function(){
    $("#typing").show();
});

socket.on("untyping-to-client", function(){
    $("#typing").hide();
});

socket.on("server-send-noone-here", function(){
    $("#waiting").show();
    $("#ready-chat").hide();
});

socket.on("exit", function(){
    alert("Người ấy đã rời đi !!");
})

$(document).ready(function()
{   
    $("#waiting").show();
    $("#ready-chat").hide();
    var clientId = new Date().getTime() / 1000;
    socket.emit("client-send-id", clientId.toString());
    
    $("#send_data").click(function(){
        if (!$('textarea#txtMessage').val())
            return;
        else
            sendMessage();
    });

    $("#txtMessage").keypress(function (e) {
        if (e.which === 13) {
            if (!$('textarea#txtMessage').val())
                return;
            else
                sendMessage();
            e.preventDefault();
        }
    });
    
   // $('textarea#txtMessage').focusin(function(){
   //     socket.emit("typing", id);
   // })
   // $('textarea#txtMessage').focusout(function(){
   //     socket.emit("unTyping", id);
   // })
    $("#typing").hide();

    $("#stop").click(function(){
        socket.emit("user-leave", id);
        window.location.reload(false); 
    });

    window.addEventListener("beforeunload", function (e) {
        socket.emit("user-leave", id);
        return null;     
      });
    
});

function sendMessage()
{
    socket.emit("client-send-data", {msg: $('textarea#txtMessage').val(), id: id});
    $("#chat_area").append("<div class='d-flex justify-content-end mb-4'><div class='msg_cotainer_send'>" + $('textarea#txtMessage').val() + "</div><div class='img_cont_msg'><img src='img/dog.png' class='rounded-circle user_img_msg'></div></div>");
    $("#chat_area").animate({ scrollTop: $('#chat_area').prop("scrollHeight")}, 100);
    $('textarea#txtMessage').val("");
}
