const { createServer } = require('node:http');
const fs = require('fs')

const hostname = 'localhost';
const port = 80;

const server = createServer((req, res) =>
    {

        let file_name = req.url.substring(1);

        if(fs.existsSync(file_name))
        {
            res.statusCode = 200;
            res.setHeader('Content-Type', getContentType(file_name));
            res.write(fs.readFileSync(file_name));
        }
        else
        {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'text/html');
            console.log(`[ERROR] Can\'t find file "${file_name}"`);
            res.write(fs.readFileSync('./backend/error_404/index.html'));
        }
        res.end();
    }
);

server.listen(port, hostname, () =>
    {
        console.log(`Server running at http://${hostname}:${port}/`);
    }
);

const getContentType = (file_name) =>
{
    let file_extention = file_name.substring(file_name.indexOf('.')+1);

    switch(file_extention)
    {
        case "html": return "text/html"; break;
        case "ico": return "image/png"; break;
        case "js": return "text/javascript"; break;
        case "css": return "text/css"; break;
        default: console.log(`[ERROR] undefined content-type: ${file_extention}`); return "text/plain";
    }
}

