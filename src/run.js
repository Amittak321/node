const {app} =  require('./server');

async function run (){
    
    app.listen(2000 , ()=>{
        console.log("server is running on 2000")
    })
}

run();