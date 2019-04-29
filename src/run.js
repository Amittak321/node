const {app} =  require('./server');
const {connection} = require('./module/db');
//const log = require('debug')('app:run')
async function run (){
    await connection.connect(function (error) {
        if (!!error) {
           console.log('Error');
        }
        else {
            console.log('database connected');
        }
    });
    
    app.listen(2000 , ()=>{
        console.log("server is running on 2000")
    })
}

run();
//console.log("root is : "+__dirname);