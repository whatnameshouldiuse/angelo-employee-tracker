const inquirer = require('inquirer');
const mysql = require('mysql2');

const MainQuestions = [{
    type: 'list',
    name: 'mainChoice',
    message: 'What would you like to do?',
    choices: [
        {
            name: 'View All Employees',
            value: 'vaEmployees'
        },
        {
            name: 'View All Departments',
            value: 'vaDepartments'
        },
        {
            name: 'View All Roles',
            value: 'vaRoles'
        },
        new inquirer.Separator(),
        {
            name: 'View Employees by Manager',
            value: 'vEmployeesManager'
        },
        {
            name: 'View Employees by Department',
            value: 'vEmployeesDepartment'
        },
        new inquirer.Separator(),
        {
            name: 'View Department Budget',
            value: 'vDepartmentBudget'
        },
        new inquirer.Separator(),
        {
            name: 'Add employee',
            value:'aEmployee'
        },
        {
            name: 'Add Department',
            value: 'aDepartment'
        },
        {
            name: 'Add Role',
            value: 'aRole'
        },
        new inquirer.Separator(),
        {
            name: 'Update Employee Role',
            value: 'uEmployeeRole'
        },
        {
            name: 'Update Employee manager',
            value: 'uEmployeeManager'
        },
        new inquirer.Separator(),
        {
            name: 'Delete Employee',
            value: 'dEmployee'
        },
        {
            name: 'Delete Department',
            value: 'dDepartment'
        },
        {
            name: 'Delete Role',
            value: 'dRole'
        },
        new inquirer.Separator(),
    ]
}]

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        password: "HowAboutNo251",
        database: "employee_db",
    },
    console.log(`Connected to the employee_db database.`)
);

const InvokeMain = function() {
    inquirer.prompt(MainQuestions)
    .then((mainChoice) => {
        switch (mainChoice) {
            case 'vaEmployees':
                break;
        }
    });
}

InvokeMain();