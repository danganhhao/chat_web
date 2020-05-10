var express = require("express");
var app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views","./views");


var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);

var userIds = [];
var mangPhongServer = [];
var mangPhongHienTai = [];

io.on("connection", function(socket){
    socket.on("client-send-id", function(data){
        if (mangPhongHienTai.length === 0 ){
            var nameRoom = new Date().getTime() / 1000;
            socket.join(nameRoom)
            socket.Phong = nameRoom;
            mangPhongServer.push(nameRoom);
            mangPhongHienTai.push(nameRoom);
        }
        if (userIds.indexOf(socket.id)>=0){
            //fail
        }
        else{
            //success
            userIds.push(socket.id);
            if (userIds.length>=2){
                if (mangPhongHienTai.length > 0)
                {
                    socket.join(mangPhongHienTai[0]);

                    if (io.sockets.adapter.rooms[mangPhongHienTai[0]].length === 2){
                        io.in(mangPhongHienTai[0]).emit("server-send-number-user", {id: mangPhongHienTai[0]});
                        mangPhongHienTai.splice(0, 1);
                    }
                }
                
            }

        }
    });

    socket.on("user-leave", function(id)
    {
        socket.broadcast.to(id).emit("exit");
    });

    socket.on("disconnect", function(){
        
        for(var i = 0; i < userIds.length; i++){ 
            if (userIds[i] === socket.id) {
                userIds.splice(i, 1); 
            }
        }


        // if (userIds.length<2){
        //     io.sockets.emit("server-send-noone-here",(userIds.length - 1).toString() + " bạn đang online");
        // }
        // else
        //     io.sockets.emit("server-send-number-user",(userIds.length-1).toString() + " bạn đang online");

    });

    socket.on("client-send-data", function(data){
        data.msg = remove_html(data.msg);
        socket.broadcast.to(data.id).emit("server-send-data", {msg: data.msg});
    });

    socket.on("typing", function(data){
        socket.broadcast.to(data).emit("typing-to-client");
    })
    socket.on("unTyping", function(data){
        socket.broadcast.to(data).emit("untyping-to-client");
    })
});

app.get("/", function(req, res){
    res.render("home");
});

app.get("/api/m3u8", function(req, res){
    res.render("data");
});

function remove_html(str) {
    if ((str === null) || (str === '')) {
        return;
    } else
        str = str.toString().replace("chịch", "***");
    return str.replace(/<[^>]*>/g, '');
}
