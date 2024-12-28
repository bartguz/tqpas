const fs = require('fs');

const names = [
  'Bob',
  'Jack',
  'Emma',
  'Amy',
  'Coral',
  'Steve',
  'Thor',
  'Johan',
  'Sven',
  'Krzysztof'
];

const surnames = [
  'Smith',
  'Schmidt',
  'Bay',
  'Wrzesien',
  'Strauss',
  'Reeves',
  'Hamilton',
  'Milic',
  'Carbon',
  'Snow',
];

const devices = [
  'Macbook Air',
  'Magic Mouse',
  'Macbook Water'
];

function getRandomTo(limit) {
  return Math.floor(Math.random() * limit);
}

function generateEmployees(amount) {
  const employees = [];

  const offboardedIndex = getRandomTo(amount);
  for (let i = 0; i < amount; i++) {
    employees.push(generateEmployee(i === offboardedIndex));
  }
  return employees;
}

function getRandomString() {
  return Math.random().toString(36).slice(2);
}

function generateEmployee(offboarded) {
  const name = names[getRandomTo(names.length)];
  const surname = surnames[getRandomTo(surnames.length)];
  const id = getRandomString();
  return {
    id,
    name: `${name} ${surname}`,
    department: "Engineering",
    status: offboarded ? "OFFBOARDED" : "ACTIVE",
    email: `${name}.${surname}@wp.pl`.toLowerCase(),
    equipments: generateEquipments()
  };

}

function generateEquipments() {
  return devices.slice(0, getRandomTo(3) + 1).map(device => ({
    id: getRandomString(),
    name: device
  }));
}
fs.writeFileSync(`${__dirname}/employees.json`, JSON.stringify(generateEmployees(+process.argv[2]??10),null,2));