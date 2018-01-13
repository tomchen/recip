const http = new require('http');

const ws = new require('ws');

const wss = new ws.Server({noServer: true});

const clients = new Set();

let wsInstance = null;

const server = http.createServer((req, res) => {

	if (req.url === '/') {

		if (!req.headers.upgrade || req.headers.upgrade.toLowerCase() != 'websocket') {

			if (req.method === 'POST') {

				const body = [];
				req.on('data', chunk => {
					body.push(chunk);
				});
				return req.on('end', () => {
					const parsedBody = Buffer.concat(body).toString();
					const command = parsedBody.split('=')[1];
					if (wsInstance) {
						wsInstance.send(command);
					}
					return res.end("OK");
				});

			} else {
				
				res.setHeader('Content-Type', 'text/html');
				res.write('<html>');
				res.write('<head><title>Recip Controller</title><head>');
				res.write('<body><form action="/" method="post"><input type="button" id="prev" value="&lt;" /><input type="button" id="next" value="&gt;" /></form></body>');
				res.write('<script>');
				res.write('document.getElementById("prev").addEventListener("click", function(e) {');
				res.write('	var xhr = new XMLHttpRequest();');
				res.write('	xhr.open("POST", "/", true);');
				res.write('	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");');
				res.write('	xhr.send("c=-1");');
				res.write('	e.preventDefault();');
				res.write('}, false);');
				res.write('document.getElementById("next").addEventListener("click", function(e) {');
				res.write('	var xhr = new XMLHttpRequest();');
				res.write('	xhr.open("POST", "/", true);');
				res.write('	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");');
				res.write('	xhr.send("c=1");');
				res.write('	e.preventDefault();');
				res.write('}, false);');
				res.write('</script>');
				res.write('</html>');
				res.end();

			}
			return;
		}
		
		wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);

	}
});

server.listen(80);

function onSocketConnect(ws) {
	clients.add(ws);
	
	wsInstance = ws;

	ws.onclose = function() {
		clients.delete(ws);
		wsInstance = null;
	};
}