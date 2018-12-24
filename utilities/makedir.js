const fs = require('fs');

function makedir(name){
  try{
    fs.mkdirSync(name);
    return `${name}`;
  }catch(e){
    let i = 1
    nameBackup = name;
    while(true){
      try{
        fs.mkdirSync(`${nameBackup}(${i})`);
        return `${nameBackup}(${i})`;
      }catch(e){
        i++;
        continue;
      }
    }
  }
}

module.exports = makedir;
