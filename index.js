const inquirer = require('inquirer');
const mysql = require('mysql2');

const queries = require('./queries');

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
            value: 'aEmployee'
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
    inquirer
    .prompt(MainQuestions)
    .then(async (response) => {
        switch (response.mainChoice) {
            case 'vaEmployees':
                await db.promise().query(queries.ViewAllEmployees)
                .then(([rows, fields]) => {
                    console.table(rows);
                });
                break;
            case 'vaDepartments':
                await db.promise().query(queries.ViewAllDepartments)
                .then(([rows, fields]) => {
                    console.table(rows);
                });
                break;
            case 'vaRoles':
                await db.promise().query(queries.ViewAllRoles)
                .then(([rows, fields]) => {
                    console.table(rows);
                });
                break;
            case 'vEmployeesManager':
                var [rows, fields] = await db.promise().query(queries.ViewByManagerPrompt);
                var prompt = [{
                    type: 'list',
                    name: 'managerChoice',
                    message: 'Select a Manager',
                    choices: []
                }];
                rows.forEach((row) => {
                    prompt[0].choices.push({
                        name: row.first_name + ' ' + row.last_name + ' - ' + row.title + ' - ' + row.department,
                        value: row.id
                    });
                });
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.ViewByManager, [response.managerChoice])
                    .then(([rows, fields]) => {
                        console.table(rows);
                    });
                });
                break;
            case 'vEmployeesDepartment':
                var [rows, fields] = await db.promise().query(queries.ViewAllDepartments);
                var prompt = [{
                    type: 'list',
                    name: 'departmentChoice',
                    message: 'Select a Department',
                    choices: []
                }];
                rows.forEach((row) => {
                    prompt[0].choices.push({
                        name: row.name,
                        value: row.id
                    });
                });
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.ViewByDepartment, [response.departmentChoice])
                    .then(([rows, fields]) => {
                        console.table(rows);
                    });
                });
                break;
            case 'vDepartmentBudget':
                var prompt = [{
                    type: 'list',
                    name: 'departmentChoice',
                    message: 'Select a Department',
                    choices: []
                }];
                var [rows, fields] = await db.promise().query(queries.ViewAllDepartments);
                rows.forEach((row) => {
                    prompt[0].choices.push({
                        name: row.name,
                        value: row.id
                    });
                });
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.ViewDepartmentBudget, [response.departmentChoice])
                    .then(([rows, fields]) => {
                        console.table(rows);
                    });
                });
                break;
            case 'aEmployee':
                var prompt = [
                    {
                        type: 'input',
                        message: 'Enter first name of new employee:',
                        name: 'first_name'
                    },
                    {
                        type: 'input',
                        message: 'Enter last name of new employee:',
                        name: 'last_name'
                    },
                    {
                        type: 'list',
                        message: 'Select the role of new employee:',
                        name: 'role_id',
                        choices: []
                    },
                    {
                        type: 'list',
                        message: 'Select manager of new employee:',
                        name: 'manager_id',
                        choices: []
                    }
                ];
                var [rows, fields] = await db.promise().query(queries.ViewAllRoles);
                rows.forEach((row) => {
                    prompt[2].choices.push({
                        name: row.title + ' - ' + row.department,
                        value: row.id
                    });
                });
                var [rows, fields] = await db.promise().query(queries.ViewAllEmployees);
                rows.forEach((row) => {
                    prompt[3].choices.push({
                        name: row.first_name + ' ' + row.last_name + ' - ' + row.title + ' - ' + row.department,
                        value: row.id
                    });
                });
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.AddEmployee,[
                        response.first_name,
                        response.last_name,
                        response.role_id,
                        response.manager_id
                    ])
                    .then(() => {
                        console.log(response.first_name + ' ' + response.last_name + ' successfully added');
                    });
                });
                break;
            case 'aDepartment':
                var prompt = [
                    {
                        type: 'input',
                        message: 'Enter name of new department:',
                        name: 'name'
                    }
                ];
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.AddDepartment, [response.name])
                    .then(() => {
                        console.log(response.name + ' successfully added');
                    });
                });
                break;
            case 'aRole':
                var prompt = [
                    {
                        type: 'input',
                        message: 'Enter name of new role:',
                        name: 'title'
                    },
                    {
                        type: 'input',
                        message: 'Enter salary of new role:',
                        name: 'salary'
                    },
                    {
                        type: 'list',
                        message: 'Select department of new role:',
                        name: 'department_id',
                        choices: []
                    }
                ];
                var [rows, fields] = await db.promise().query(queries.ViewAllDepartments);
                rows.forEach((row) => {
                    prompt[2].choices.push({
                        name: row.name,
                        value: row.id
                    });
                });
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.AddRole, [
                        response.title,
                        response.salary,
                        response.department_id
                    ])
                    .then(() => {
                        console.log(response.title + ' successfully added');
                    });
                });
                break;
            case 'uEmployeeRole':
                var prompt = [
                    {
                        type: 'list',
                        message: 'Select Employee to change the role of:',
                        name: 'employee_id',
                        choices: []
                    },
                    {
                        type: 'list',
                        message: 'Select new role for employee',
                        name: 'role_id',
                        choices: []
                    }
                ];
                var [rows, fields] = await db.promise().query(queries.ViewAllEmployees);
                rows.forEach((row) => {
                    prompt[0].choices.push({
                        name: row.first_name + ' ' + row.last_name + ' - ' + row.title + ' - ' + row.department,
                        value: row.id
                    });
                });
                var [rows, fields] = await db.promise().query(queries.ViewAllRoles);
                rows.forEach((row) => {
                    prompt[1].choices.push({
                        name: row.title + ' - ' + row.department,
                        value: row.id
                    });
                });
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.UpdateEmployeeRole, [
                        response.role_id,
                        response.employee_id
                    ])
                    .then(() => {
                        console.log('Role successfully updated');
                    });
                });
                break;
            case 'uEmployeeManager':
                var prompt = [
                    {
                        type: 'list',
                        message: 'Select Employee to change the manager of:',
                        name: 'employee_id',
                        choices: []
                    },
                    {
                        type: 'list',
                        message: 'Select new manager for employee',
                        name: 'manager_id',
                        choices: []
                    }
                ];
                var [rows, fields] = await db.promise().query(queries.ViewAllEmployees);
                rows.forEach((row) => {
                    prompt[0].choices.push({
                        name: row.first_name + ' ' + row.last_name + ' - ' + row.title + ' - ' + row.department,
                        value: row.id
                    });
                    prompt[1].choices.push({
                        name: row.first_name + ' ' + row.last_name + ' - ' + row.title + ' - ' + row.department,
                        value: row.id
                    });
                });
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.UpdateEmployeeManager, [
                        response.manager_id,
                        response.employee_id
                    ])
                    .then(() => {
                        console.log('Manager successfully updated');
                    });
                });
                break;
            case 'dEmployee':
                var prompt = [
                    {
                        type: 'list',
                        message: 'Select Employee to delete:',
                        name: 'id',
                        choices: []
                    }
                ];
                var [rows, fields] = await db.promise().query(queries.ViewAllEmployees);
                rows.forEach((row) => {
                    prompt[0].choices.push({
                        name: row.first_name + ' ' + row.last_name + ' - ' + row.title + ' - ' + row.department,
                        value: row.id
                    });
                });
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.DeleteEmployee, [
                        response.id
                    ])
                    .then(() => {
                        console.log('Employee successfully deleted');
                    });
                });
                break;
            case 'dDepartment':
                var prompt = [
                    {
                        type: 'list',
                        message: 'Select Department to delete:',
                        name: 'id',
                        choices: []
                    }
                ];
                var [rows, fields] = await db.promise().query(queries.ViewAllDepartments);
                rows.forEach((row) => {
                    prompt[0].choices.push({
                        name: row.name,
                        value: row.id
                    });
                });
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.DeleteDepartment, [
                        response.id
                    ])
                    .then(() => {
                        console.log('Department successfully deleted');
                    });
                });
                break;
            case 'dRole':
                var prompt = [
                    {
                        type: 'list',
                        message: 'Select Role to delete:',
                        name: 'id',
                        choices: []
                    }
                ];
                var [rows, fields] = await db.promise().query(queries.ViewAllRoles);
                rows.forEach((row) => {
                    prompt[0].choices.push({
                        name: row.title + ' - ' + row.department,
                        value: row.id
                    });
                });
                await inquirer.prompt(prompt)
                .then(async (response) => {
                    await db.promise().query(queries.DeleteRole, [
                        response.id
                    ])
                    .then(() => {
                        console.log('Role successfully deleted');
                    });
                });
                break;
        }
    })
    .catch((err) => console.log(err))
    .finally(() => {InvokeMain()})
}

InvokeMain();