//dependencies
const consoleTable = require("console.table");
const mysql = require("mysql2");
const inquirer = require("inquirer");


const connection = mysql.createConnection({ 
    host: "localhost",
    port: "3306",
    user: "root",
    password: "iamenough",
    database: "employees_db"
})

connection.connect(function (err) {
  if (err) throw err;
  start();
});

function start(){
  inquirer.prompt([
  {
    type: 'list',
    name:'userChoice',
    message: 'What would you like to do?',
    choices: [
    'View Departments',
    'View Roles',
    'View Employees',
    'Add a Department',
    'Add a Role',
    'Add an Employee',
    'Update an Employee',
    'Exit'
    ]
      
  }

  ]).then((res)=>{
    console.log(res.userChoice);
    switch(res.userChoice){
      case 'View Departments':
        viewAllDept();
        break;
      case 'View Roles':
        viewAllRoles();
        break;
      case 'View Employees':
        viewAllEmployees();
        break;
      case 'Add a Department':
        addDepartment();
        break;
      case 'Add a Role':
        addNewRole();
        break;
      case 'Add an Employee':
        addEmployee();
        break;
      case 'Update an Employee':
        updateEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
      }
      
    }).catch((err)=>{
  if(err)throw err;
  });
}


function viewAllDept() {
  connection.query('SELECT * FROM department', function (err, results) {
    err ? console.err(err) : console.table(results) 
    start();
  })
};

function viewAllRoles() {
  connection.query('SELECT * FROM role', function (err, results) {
    err ? console.err(err) : console.table(results)
    start();
  })
};


function viewAllEmployees() {
  connection.query('SELECT * FROM employee', function (err, results) {
    err ? console.err(err) : console.table(results)
    start();
  })
};

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the new department?',
        name: 'addDepartment'
      }
    ])
    .then((res) => {
      connection.query('INSERT INTO department(name) VALUES(?)', res.addDepartment, function (err, results) {
        if (err) {
          console.log(err)
        } else {
          connection.query('SELECT * FROM department', function (err, results) {
            err ? console.err(err) : console.table(results)
            start();
          })
        }
      })
    })
};

function addNewRole() {
  const department = () => connection.promise().query('SELECT * FROM department')
    .then((rows) => {
        let departmentNames = rows[0].map(obj => ({
          name: obj.name,
          value: obj.id
        }));
        return departmentNames;
  })
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Please add name of new role.',
        name: 'addNewRole'
      },
      {
        type: 'input',
        message: 'What is the salary of new role?',
        name: 'addNewRoleSalary'
      },
      {
        type: 'list',
        message: 'What department is the new role in?',
        name: 'addNewRoleDepartment',
        choices: department
      }
    ])
    .then((res) => {
      connection.promise().query('INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?)', [res.addNewRole, res.addNewRoleSalary, res.addNewRoleDepartment])
      .then(function (results) {
          connection.query('SELECT * FROM department', function (err, results) {
            err ? console.err(err) : console.table(results)
            start();
          })
      })
      .catch(err => {
        if (err) {
          console.log(err);
        }
      })
    })
};


function addEmployee() {
  const role = () => connection.promise().query('SELECT * FROM role')
    .then((rows) => {
        let roleNames = rows[0].map(obj => ({
          name: obj.title,
          value: obj.id
        }));
        return roleNames;
  })
  const employee = () => connection.promise().query('SELECT * FROM employee')
    .then((rows) => {
        let employeeNames = rows[0].map(obj => ({
          name: `${obj.first_name} ` + `${obj.last_name}`,
          value: obj.id
        }));
        return employeeNames;
  })
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Please enter employee first name.',
        name: 'addEmpFirstName'
      },
      {
        type: 'input',
        message: 'Please enter employee last name.',
        name: 'addEmpLastName'
      },
      {
        type: 'list',
        message: `What is this employee's role?`,
        name: 'addEmpRole',
        choices: role
      },
      {
        type: 'list',
        message: 'Who is this employees manager?',
        name: 'addEmpManager',
        choices: employee
      }
    ])
    .then((answers) => {
      connection.promise().query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)', [answers.addEmpFirstName, answers.addEmpLastName, answers.addEmpRole, answers.addEmpManager])
      .then(function (results) {
          connection.query('SELECT * FROM employee', function (err, results) {
            err ? console.err(err) : console.table(results)
            start();
          })
      })
      .catch(err => {
        if (err) {
          console.log(err)
        }
      })
    })
}

function updateEmployeeRole() {
  const employee = () => connection.promise().query('SELECT * FROM employee')
    .then((rows) => {
        let employeeName = rows[0].map(
          ({ id, first_name, last_name }) => ({
            name: `${first_name} ${last_name}`,
            value: id
          })
        );
        return employeeName;
  })
  const role = () => connection.promise().query('SELECT * FROM role')
    .then((rows) => {
        let roleNames = rows[0].map(obj => obj.title);
        return roleNames;
  })
  inquirer
    .prompt([
      {
        type: 'list',
        message: `Whose role do you want to update?`,
        name: 'updateEmployeeName',
        choices: employee
      },
      {
        type: 'list',
        message: 'What is this employees new role?',
        name: 'updateEmployeeRole',
        choices: role
      },
      {
        type: 'input',
        message: 'What is this employees updated salary?',
        name: 'updateEmployeeSalary',
      }
    ])
    .then((answers) => {
      connection.promise().query('SELECT id FROM role WHERE title = ?', answers.updateEmployeeRole)
      .then(answers => {
        let foundId = answers[0].map(obj => obj.id);
        return foundId[0];
      })
      .then((foundId) => {
        connection.query('UPDATE employee SET role_id = ? WHERE id = ?', [foundId, answers.updateEmployeeName])
      })
      .then(function (results) {
        connection.query('SELECT * FROM employee', function (err, results) {
          err ? console.err(err) : console.table(results)
          start();
        })
    })
      .catch(err => {
        if (err) {
          console.log(err)
        }
      })
    })
}