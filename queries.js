const ViewAllEmployees = `
SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name,
    role.title,
    role.salary,
    department.name as department
    employee.manager_id
FROM employee
INNER JOIN (
    role INNER JOIN department ON role.department_id = department.id
)
    ON employee.role_id = role.id
ORDER BY employee.id;
`;

const ViewAllDepartments = `
SELECT * FROM department ORDER BY department.id;
`

const ViewAllRoles = `
SELECT
    role.id,
    role.title,
    role.salary,
    department.name as department
FROM role
INNER JOIN department
    ON role.department_id = department.id
ORDER BY role.id;
`;

const ViewByManagerPrompt = `
SELECT 
    em.id, em.first_name, em.last_name, role.title, department.name as department
FROM 
    employee as em
INNER JOIN (
    SELECT manager_id
    FROM employee
    WHERE manager_id IS NOT NULL
    GROUP BY manager_id
) as mi
    ON em.id = mi.manager_id
LEFT JOIN (
    role LEFT JOIN department ON role.department_id = department.id)
)
    ON em.role_id = role.id;
`;

const ViewByManager = `
SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name,
    role.title,
    role.salary,
    department.name as department
    employee.manager_id
FROM employee
INNER JOIN (
    role INNER JOIN department ON role.department_id = department.id
)
    ON employee.role_id = role.id
WHERE employee.manager_id = ?
ORDER BY employee.id;
`;

const ViewByDepartment = `
SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name,
    role.title,
    role.salary,
    department.name as department
    employee.manager_id
FROM employee
INNER JOIN (
    role INNER JOIN department ON role.department_id = department.id
)
    ON employee.role_id = role.id
WHERE department.id = ?
ORDER BY employee.id;
`;

const ViewDepartmentBudget = `
SELECT
    department.id,
    department.name,
    sum(role.salary) as budget
FROM department
LEFT JOIN (
    role LEFT JOIN employee ON role.id = employee.role_id
)
    ON department.id = role.department_id
WHERE department.id = ?
GROUP BY department.id
`

const AddEmployee = `
INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    (?, ?, ?, ?);
`;

const AddDepartment = `
INSERT INTO department
    (name)
VALUES
    (?);
`;

const AddRole = `
INSERT INTO role
    (title, salary, department_id)
VALUES
    (?, ?, ?);
`;

const UpdateEmployeeRole = `
UPDATE employee
SET role_id = ?
WHERE id = ?;
`

const UpdateEmployeeManager = `
UPDATE employee
SET manager_id = ?
WHERE id = ?;
`

const DeleteEmployee = `
DELETE FROM employee
WHERE id = ?;
`

const DeleteDepartment = `
DELETE FROM department
WHERE id = ?;
`

const DeleteRole = `
DELETE FROM role
WHERE id = ?;
`

module.exports = {
    ViewAllEmployees,
    ViewAllDepartments,
    ViewAllRoles,
    ViewByManagerPrompt,
    ViewByManager,
    ViewByDepartment,
    ViewDepartmentBudget,
    AddEmployee,
    AddDepartment,
    AddRole,
    UpdateEmployeeRole,
    UpdateEmployeeManager,
    DeleteEmployee,
    DeleteDepartment,
    DeleteRole
}