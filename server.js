const http = require("http");
const app = require("./app");

// const port = process.env.PORT || 3000;

const server = http.createServer(app);

// var distDir = __dirname + "/dist/";
//  app.use(express.static(distDir));

// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static('client/build'));
// }

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}
server.listen(port, function () {
    console.log("server started successfully on "+ port); 
});