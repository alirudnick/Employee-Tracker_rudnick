const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({extended: false }));
app.use = (express.json());

//connect to database
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'iamenough',
    database: 'employees_db'
},
console.log('Connected to the employees_db database')
);


// function which prompts the user for what action they should take
function firstPrompt() {

  inquirer
    .prompt({
      type: "list",
      name: "task",
      message: "What do you want to do?",
      choices: [
        "View departments",
        "View roles",
        "View employees",
        "Add a department",
        "Add a role",
        "Add employee",
        "Update employee",
        "End"]
    })
    .then((answer) => {
      if (answer.task === 'View departments') {
        viewDepartments();
      } else if (answer.task === 'View roles') {
        viewRoles();
      } else if (answer.task === 'View employees') {
        viewEmployees();
      } else if (answer.task === 'Add a department') {
        addDepartment();
      } else if (answer.task === 'Add a role') {
        addRole();
      } else if (answer.task === 'Add employee') {
        addEmployee();
      } else if (answer.task === 'Update employee') {
        updateEmployee();
      }
      })
    };
  
options();

function viewDepartments() {
  db.query('SELECT * FROM department', function (err, results) {
    err ? console.err(err) : console.table(results) 
    options();
  })
};

function viewRoles() {
  db.query('SELECT * FROM role', function (err, results) {
    err ? console.err(err) : console.table(results)
    options();
  })
};

function viewEmployees() {
  db.query('SELECT * FROM employee', function (err, results) {
    err ? console.err(err) : console.table(results)
    options();
  })
};

function addDepartment() {
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'What department would you like to add?',
        name: 'addDepartment'
      }
    ])
    .then((answer) => {
      db.query('INSERT INTO department(name) VALUES(?)', answer.addDepartment, function (err, results) {
        if (err) {
          console.log(err)
        } else {
          db.query('SELECT * FROM department', function (err, results) {
            err ? console.err(err) : console.table(results)
            options();
          })
        }
      })
    })
    };

function addRole() {
  const department = () => db.promise().query('SELECT * FROM department')
    .then((rows) => {
        let departmentNames = rows[0].map(obj => ({
          name: obj.name,
          value: obj.id
        }));
        console.log(departmentNames);
        return departmentNames;
  })
  inquirer
    .prompt([
      {
        type: 'input',
        message: 'Please add new role.',
        name: 'addRole'
      },
      {
        type: 'list',
        message: 'What department does this role belong to?',
        name: 'addRoleDepartment',
        choices: department
        
      },
      {
        type: 'input',
        message: 'Please enter salary.',
        name: 'addSalary'
      }
    ])
    .then((answer) => {
      db.promise().query('INSERT INTO role (title, department_id, salary) VALUES(?, ?, ?)', [answer.addRole, answer.addRoleSalary, answer.addRoleDepartment])
      .then(function (results) {
          db.query('SELECT * FROM department', function (err, results) {
            err ? console.err(err) : console.table(results)
            options();
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
  const role = () => db.promise().query('SELECT * FROM role')
    .then((rows) => {
        let roleNames = rows[0].map(obj => ({
          name: obj.title,
          value: obj.id
        }));
        return roleNames;
  })
  const employee = () => db.promise().query('SELECT * FROM employee')
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
        message: 'Please enter the first name of the employee.',
        name: 'addFirstName'
      },
      {
        type: 'input',
        message: 'Please enter the last name of the employee',
        name: 'addLastName'
      },
      {
        type: 'list',
        message: `What is the employee's role?`,
        name: 'addEmployeeRole',
        choices: role
      },
      {
        type: 'list',
        message: 'Who is the manager?',
        name: 'addEmployeeManager',
        choices: employee
      }
    ])
    .then((answer) => {
      console.log(answer);
      db.promise().query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)', [answer.addEmployeeFirstName, answer.addEmployeeLastName, answer.addEmployeeRole, answer.addEmployeeManager])
      .then(function (results) {
          db.query('SELECT * FROM employee', function (err, results) {
            err ? console.err(err) : console.table(results)
            options();
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
  const employee = () => db.promise().query('SELECT * FROM employee')
    .then((rows) => {
        let employeeNames = rows[0].map(obj => obj.first_name);
        return employeeNames;
  })
  const role = () => db.promise().query('SELECT * FROM role')
    .then((rows) => {
        let roleNames = rows[0].map(obj => obj.title);
        return roleNames;
  })
  inquirer
    .prompt([
      {
        type: 'list',
        message: `What role do you want to update?`,
        name: 'updateEmployeeName',
        choices: employee
      },
      {
        type: 'list',
        message: 'What is the role of this employee?',
        name: 'updateEmployeeRole',
        choices: role
      }
    ])
    .then
     }