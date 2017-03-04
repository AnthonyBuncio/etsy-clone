var http = require('http') 
var fs = require('fs') 
var port = 3000

var requestHandler = function(request, response) {  
	var filename = request.url === '/' ? 'index.html' : process.cwd() + request.url
	console.log('sending ' + filename)
	var strm = fs.readFile(filename, (err,contents) => {
		if (err) {
			response.statusMessage = "what?! poor you we didn't found yoru file!"
			response.statusCode = 404
			response.end()
		}
		else response.end(contents) 
	})
}

var server = http.createServer(requestHandler)

server.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on port ${port}. visit localhost.com:3000 to view the latest version of your app!`)
})