const http = require("http");

const employees = require('./employees.json');
const host = 'localhost';
const port = 8011;

const requestListener = function (req, res) {
  res.setHeader("Access-Control-Allow-Origin","*")
  res.setHeader("Access-Control-Allow-Headers","*")
  if(req.method==='OPTIONS'){
    res.writeHead(200);
    res.end();
  }
  else if (tryMatchEmployees(req)) returnEmployees(req, res);
  else if (tryMatchSingleEmployee(req)) returnSingleEmployee(req, res);
  else if (tryMatchProcessOffboarding(req)) processOffboarding(req, res);
  else {
    res.writeHead(404);
    res.end();
  }
  console.log(formattedStringify(employees));
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server up on http://${host}:${port}`);
});

function returnEmployees(_req, res) {
  res.setHeader("Content-Type", "application/json");
  res.writeHead(200);
  res.end(formattedStringify(employees));
}

function returnSingleEmployee(req, res) {
  const userId = req.url.split('/')[2];
  const employee = employees.find(e => e.id === userId);
  if (employee) {
    res.setHeader("Content-Type", "application/json");
    res.writeHead(200);
    res.end(formattedStringify(employee));
    return;
  }
  res.writeHead(404);
  res.end();
};

function processOffboarding(req, res) {
  const userId = req.url.split('/')[2];
  const employee = employees.find(e => e.id === userId);
  if (!employee) {
    res.writeHead(404);
    res.end();
    return;
  }
  if (employee?.status === 'ACTIVE') {
    employee.status = 'OFFBOARDED';
    res.writeHead(201);
    res.end();
    return;
  }
  res.setHeader("Content-Type", "application/json");
  res.writeHead(409);
  res.end(`{"errorMessage": "${userId} already offboarded"}`);
  return;
}

function tryMatchEmployees(req) {
  return req.method === 'GET' && /^\/employees$/i.test(req.url);
}

function tryMatchSingleEmployee(req) {
  return req.method === 'GET' && /^\/employees\/\w+$/i.test(req.url);
}

function tryMatchProcessOffboarding(req) {
  return req.method === 'POST' && /^\/users\/\w+\/offboard$/i.test(req.url);
}

function formattedStringify(obj) {
  return JSON.stringify(obj, null, 2);
}