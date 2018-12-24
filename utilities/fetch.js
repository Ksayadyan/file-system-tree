const fs = require('fs');
const path = require('path');

function fetch(a){
  if(fs.existsSync(a)){
    console.log('Path exists');
    let read = fs.readdirSync(a);
    console.log('Directory is ',read);
    let arr = [];
    let obj = {};
    for(let i = 0; i < read.length; i++){
      try {
      obj[read[i]] = fetch(path.join(a,read[i]))
        arr.push(obj);
        obj = {};
      } catch (e) {
        arr.push(read[i]);
      }
    }
    console.log(JSON.stringify(arr,null,2));
    return arr;
  }else{
    return false;
  }
}
module.exports = fetch;
