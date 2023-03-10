USE employees_db;

INSERT INTO department (name)
VALUES ("Sales");
INSERT INTO department (name)
VALUES ("Engineering");
INSERT INTO department (name)
VALUES ("Finance");
INSERT INTO department (name)
VALUES ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 150000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", 120000, 2);
INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 125000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Legal Team Lead", 250000, 4);
INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 800000, 1);
INSERT INTO role (title, salary, department_id)
VALUES ("Account Manager", 160000, 3);
INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Ali", "Rudnick", 2, 4);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Marie", "Zimm", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Emily", "Manno", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Faith", "Benson", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Cam", "Mobley", 2, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Elyse", "Detling", 4, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Natalie", "Sasso", 1, 5);