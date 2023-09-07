class Employee {
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

class EmployeeManager {
  constructor() { 
    this.employees = [];
    this.counter = 1;
    this.employeeSlotsHTMLArray = JSON.parse(localStorage.getItem('employeeSlotsHTML')) || [];
  }

  createEmployee(employeeElement) {
    let employee = prompt("Enter employee Name:");

    if (employee) {
      employeeElement.querySelector('.employeeName').innerText = `${employee[0].toUpperCase()}${employee.slice(1)}`;
      employeeElement.draggable = true;
      employeeElement.id = 'employee_' + this.counter; // Assign a unique ID
      this.counter++;

      const newEmployee = new Employee(employeeElement.id, employee);
      this.employees.push(newEmployee);

      this.employeeSlotsHTMLArray.push(employeeElement.outerHTML);

      this.saveEmployeeData();

      employeeElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
      });
    }
    employeeElement.addEventListener('click', () => {
      const choice = confirm("Delete employee?");
      if (choice) {
        const index = this.employees.findIndex(emp => emp.id === employeeElement.id);
        if (index !== -1) {
          this.employees.splice(index, 1);
          this.employeeSlotsHTMLArray.splice(index, 1);
          this.saveEmployeeData();
          employeeElement.remove();
        }
      }
    });
  }

  addEmployee() {
    let employeeSlotToggle = document.querySelector('.employeeSlotToggle');
    let clone = employeeSlotToggle.cloneNode(true);
    clone.classList.add("employeeSlotToggle");
    clone.classList.add('newEmployee');
    employeeSlotToggle.after(clone);

    this.createEmployee(clone);
  }

  saveEmployeeData() {
    const employeesJSON = JSON.stringify(this.employees);
    localStorage.setItem('employeesData', employeesJSON);

    localStorage.setItem('counter', this.counter);

    const employeeSlotsHTMLArray = JSON.stringify(this.employeeSlotsHTMLArray);
    localStorage.setItem('employeeSlotsHTML', employeeSlotsHTMLArray);
  }

  loadEmployeeData() {
    const currentCounter = localStorage.getItem('counter');
    this.counter += currentCounter;

    const employeesJSON = localStorage.getItem('employeesData');
    const loadedEmployees = JSON.parse(employeesJSON);

    if (loadedEmployees) {
      this.employees = loadedEmployees.map(loadedEmployee => {
        return new Employee(loadedEmployee.id, loadedEmployee.name);
      });

      const employeeSlotsHTMLArray = JSON.parse(localStorage.getItem('employeeSlotsHTML'));
      console.log(employeeSlotsHTMLArray);
      const employeeSlotsHTML = employeeSlotsHTMLArray.join('');
      console.log(employeeSlotsHTML);
      document.querySelector('.employeeBlockContainer').innerHTML = employeeSlotsHTML;

      this.employees.forEach(employee => {
        const employeeElement = document.getElementById(employee.id);
        employeeElement.querySelector('.employeeName').innerText = `${employee.name[0].toUpperCase()}${employee.name.slice(1)}`;

        employeeElement.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', e.target.id);
        });

        employeeElement.addEventListener('click', () => {
          const choice = confirm("Delete employee?");
          if (choice) {
            const index = this.employees.findIndex(emp => emp.id === employee.id)
            if (index !== -1) {
              this.employees.splice(index, 1);
              this.employeeSlotsHTMLArray.splice(index, 1);
              this.saveEmployeeData();
              employeeElement.remove();
            }
          }
        });
      });
    }
  }
}

const employeeManager = new EmployeeManager();

const employeeButton = document.querySelector('.addEmployeeButton').addEventListener('click', () => {
  employeeManager.addEmployee();
});

const weekDaysSlots = document.querySelectorAll('.weekDaySlot');

// Load employee data from localStorage when the page loads
window.addEventListener('load', () => {
  employeeManager.loadEmployeeData();
});

weekDaysSlots.forEach(slot => {
  slot.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  slot.addEventListener('drop', (e) => {
    e.preventDefault();

    const loadedEmployees = localStorage.getItem('employeesData');

    const employeeId = e.dataTransfer.getData('text/plain');
    const employeeElement = document.getElementById(employeeId);

    if (employeeElement) {
      const newEmployeeElement = document.createElement('div');
      newEmployeeElement.textContent = employeeElement.textContent;
      newEmployeeElement.className = employeeElement.className;
      newEmployeeElement.draggable = true;
      newEmployeeElement.id = 'employee_' + employeeManager.counter;
      employeeManager.counter++;

      newEmployeeElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
      });

      if (slot.childElementCount === 0) {
        slot.appendChild(newEmployeeElement);
        newEmployeeElement.classList.add('droppedEmployee');
      }

      slot.addEventListener('dragend', (e) => {
        newEmployeeElement.remove();
      });
    } 
  });
});

//CAN STORE THE ENTIRE WEEK/CALENADR CONTAINER INTO LOCAL STORAGE TO SAVE DROPPED EMPLOYEES

// FIX BUG: IF EMPLOYEE PROMPT IS EMPTY, DO NOT ADD EMPLOYEE if employee === null??

//NEED TO UPDATE:

// DO NOT LET DRAGGABLE ELEMENTS DRAG PAST OUTSIDE OF CALENDAR/EMPLOYEE CONTAINER 

// SAVED DROPPED EMPLOYEE ELEMENTS INSIDE OF WEEKDAYSLOTS INTO LOCAL STORAGE

