const http = require('http');
const path = require('path');
const fs = require('fs');

const root = __dirname;
const port = process.env.PORT || 3000;

const mime = {
  '.html':'text/html; charset=utf-8',
  '.js':'application/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.json':'application/json; charset=utf-8',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.svg':'image/svg+xml',
  '.webp':'image/webp',
  '.ico':'image/x-icon'
};

function safeJoin(base, target){
  const targetPath = '.' + path.normalize('/' + target);
  return path.join(base, targetPath);
}

const server = http.createServer((req,res)=>{
  try{
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    const file = safeJoin(root, reqPath);
    if (!file.startsWith(root)){
      res.statusCode = 400; res.end('Bad Request'); return;
    }
    fs.stat(file, (err,stats)=>{
      if (err || !stats.isFile()){
        res.statusCode = 404; res.end('Not found'); return;
      }
      const ext = path.extname(file).toLowerCase();
      const type = mime[ext] || 'application/octet-stream';
      res.setHeader('Content-Type', type);
      const stream = fs.createReadStream(file);
      stream.pipe(res);
    });
  }catch(e){
    res.statusCode = 500; res.end('Server error');
  }
});

server.listen(port, ()=>{
  console.log(`Static server running at http://localhost:${port}`);
});
