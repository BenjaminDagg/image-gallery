var express = require('express');
var app = require('express')();
var path = require('path');

//for deployment
var http = require('http').Server(app);



app.use( express.static( __dirname + `/build` ) );

app.get('*', (req, res)=>{
    res.sendFile(path.join(__dirname, '/build/index.html'));
});


//dev
//app.listen(process.env.PORT || 8080 ,() => console.log('server listening'));

//for deployment
http.listen(process.env.PORT || 8080 ,() => console.log('server listening'));