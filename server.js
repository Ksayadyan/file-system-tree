const express = require('express');
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('fs');
const folderDelete = require('./utilities/dlNonEmptFolder.js');
const makedir = require('./utilities/makedir.js');
const fetch = require('./utilities/fetch.js');

let app = express();
app.use(express.static(__dirname + '/public'))

app.get('/',(req,res)=>{
  res.sendFile('index.html')
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/tree',(req,res)=>{
  console.log('tree request')
  res.send(fetch(req.body.path));
})

app.post('/root',(req,res)=>{
  console.log('Root request')
  read = fs.readdirSync('/');
  res.send(read);
  console.log(read);
});
app.post('/delete',(req,res)=>{
  console.log('delete request');
  console.log(req.body.value);
  if(fs.existsSync(req.body.value)){
    console.log('Trying to unlink');
    fs.unlinkSync(req.body.value);
    res.status(200);
    res.send();
  }else{
    res.status(400);
    res.send();
  }
})
app.post('/make',(req,res)=>{
  console.log(req.body.path + '/'+ req.body.value)
  if(fs.existsSync(req.body.path)){
    console.log('Path to make exists');
    let path = req.body.path + '/'+ req.body.value;
    console.log(path)
    if(fs.existsSync(path)){
        console.log('File already exists');
        res.status(304);
        res.send();
    }else{
      fs.appendFileSync(path);
      res.status(200);
      res.send();
    }
  }else{
    res.status(400);
    res.send();
  }
})

app.post('/makedemand',(req,res)=>{
  let path = req.body.path + '/'+ req.body.value;
  fs.appendFileSync(path);
  console.log('Force Append')
  res.status(200);
  res.send();
});

app.post('/deletefolder',(req,res)=>{
  console.log('Delete folder request',req.body.value);
  try{
    fs.rmdirSync(req.body.value);
    res.status(200);
    res.send();
  }catch(e){
    res.status(304);
    res.send();
  }
})

app.post('/deletefolderdemand',(req,res)=>{
  console.log('Delete on Demnad request');
  folderDelete(req.body.value);
  res.status(200);
  res.send();
});

app.post('/makefolder',(req,res)=>{
  console.log('Made folder request');
  console.log(req.body.value)
  //console.log(path.join(req.body.path,req.body.value));
  let name =  makedir(path.join(req.body.path,req.body.value));
  res.status(200);
  //let result = fetch(path.join(req.body.path));
  //let arr = result[result.length-1];
  let obj = {};
  Object.defineProperty(obj,`${path.basename(name.toString())}`,{value:[],
    enumerable: true,
  })
  let arr1 = [];
  arr1.push(obj)
  console.log('new object',obj);
  console.log('dat array ',arr1);
  res.send(arr1);
})
app.listen(3000,()=>{
  console.log('Server is running onlocal host 3000')
})

function Make(a){
  this.a = [];
}
