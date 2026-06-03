const http=require('http');
const userRequestHandler=require('./user');
const Server=http.createServer(userRequestHandler);
const PORT=3000;
Server.listen(PORT,()=>{
    console.log(`Server running on address http://localhost:${PORT}`);
});