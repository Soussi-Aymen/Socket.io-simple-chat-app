const express =require('express');
const app=express();
const server=require("http").createServer(app);
const io=require('socket.io').listen(server);
users=[];
connections= [];
server.listen(process.env.PORT||3000);
console.log('server runing');

app.get('/',function(request,response){
res.sendFile(__dirname+'/index.html');
});

io.sockets.on('connection',function(socket){
connections.push(socket);
console.log('connected: %s sockets connected',connections.length);

//Disconnected 
socket.on('disconnect',function(data){
users.splice(users.indexOf(socket.username),1);	
connections.splice(connections.indexOf(socket),1);
console.log('disconnect: %s sockets connected',connections.length);
});

//send message
socket.on('send message',function(data){
io.sockets.emit('new message',{msg:data,user:socket.username});
});

//new user 
socket.on("new user",function(data,callback){
callback(true);
socket.username=data;
users.push(socket.username);
updateUsernames();
});

function updateUsernames(){
io.sockets.emit('get users',users);	
}


});