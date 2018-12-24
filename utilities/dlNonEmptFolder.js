const fs = require('fs');
const path = require('path');



function nonEmptyFolderDelete(a){
  let read = fs.readdirSync(a);
    for(let i = 0; i < read.length; i++){
      if(fs.statSync(path.join(a,read[i])).isDirectory()){
        nonEmptyFolderDelete(path.join(a,read[i]));
      }else{
        fs.unlinkSync(path.join(a,read[i]));
      }
    }
    fs.rmdirSync(a);
}

module.exports = nonEmptyFolderDelete;
