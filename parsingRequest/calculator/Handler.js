const { sumRequestHandler } = require("./sum");

const requestHandler=(req,res)=>{
console.log(req.url,req.method);
if(req.url==='/'){
    res.setHeader('Content-Type','text/html');
    res.write(`<html>
    <h1><head><title>Practise set</title></head></h1>
    <body>
    <h1>Welcome to Caculator page</h1>
    <a href="/calculator">Go To Calculator</a>
    </body>
    </html>
    `);
    return res.end();
}
else if(req.url.toLowerCase()==="/calculator"){
    res.write(`<html>
        <h1><head><title>Practise set</title></head></h1>
        <body>
        <h1>Here is the Calculator</h1>
        <form action="/calculate-result" method="POST">
        <input type="text" placeholder="first Num" name="first">
        <input type="text" placeholder="Second Num" name="second">
        <input type="submit" value="Sum">
        </form>
        </body>
        </html>
        `);
        return res.end();

}
else if(req.url.toLowerCase()==="/calculate-result" && req.method==='POST'){
    return sumRequestHandler(req,res);
    
}
else{
    res.setHeader('Content-Type','text/html');
    res.write(`<html>
    <h1><head><title>Complete coding</title></head></h1>
    <body>
    <h1>404 error Page does not Exist</h1>
    <a href="/">Go to home</a>
    </body>
    </html>
    `);
    return res.end();

}

};
exports.requestHandler=requestHandler;