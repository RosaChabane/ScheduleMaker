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
      location.reload();

      employeeElement.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
      });
    }
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

    const dateText = localStorage.getItem('dateText');
    document.getElementById('dateOfWeek').innerHTML = dateText;

    const infoText = localStorage.getItem('infoText');
    document.getElementById('extraInfo').innerHTML = infoText;

    const amShiftHP1 = localStorage.getItem('amShiftHP1');
    document.getElementById('amShiftHP1').innerHTML = amShiftHP1;

    const pmShiftHP1 = localStorage.getItem('pmShiftHP1');
    document.getElementById('pmShiftHP1').innerHTML = pmShiftHP1;

    const amShiftHP2 = localStorage.getItem('amShiftHP2');
    document.getElementById('amShiftHP2').innerHTML = amShiftHP2;

    const pmShiftHP2 = localStorage.getItem('pmShiftHP2');
    document.getElementById('pmShiftHP2').innerHTML = pmShiftHP2;

    if (!dateText) {
      document.getElementById('dateOfWeek').innerHTML = "click to edit"
    }

    if (!infoText) {
      document.getElementById('extraInfo').innerHTML = "click to edit";
    }
    
    if (!amShiftHP1) {
      document.getElementById('amShiftHP1').innerHTML = "click to edit"
    }

    if (!pmShiftHP1) {
      document.getElementById('pmShiftHP1').innerHTML = "click to edit"
    }

    if (!amShiftHP2) {
      document.getElementById('amShiftHP2').innerHTML = "click to edit"
    }

    if (!pmShiftHP2) {
      document.getElementById('pmShiftHP2').innerHTML = "click to edit"
    }

    if (loadedEmployees) {
      this.employees = loadedEmployees.map(loadedEmployee => {
        return new Employee(loadedEmployee.id, loadedEmployee.name);
      });

      const employeeSlotsHTMLArray = JSON.parse(localStorage.getItem('employeeSlotsHTML'));
      const employeeSlotsHTML = employeeSlotsHTMLArray.join('');
      document.querySelector('.employeeBlockContainer').innerHTML = employeeSlotsHTML;

      this.employees.forEach(employee => {
        const employeeElement = document.getElementById(employee.id);
        employeeElement.querySelector('.employeeName').innerText = `${employee.name[0].toUpperCase()}${employee.name.slice(1)}`;

        employeeElement.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', e.target.id);
        });

        employeeElement.addEventListener('click', () => {
          const choice = confirm("Delete employee?");

          if (choice && this.employees.length < 2) {
            confirm("CANNOT REMOVE ONLY REMAINING EMPLOYEE");
          }

          if (choice && this.employees.length >= 2) {
            const index = this.employees.findIndex(emp => emp.id === employee.id)
            if (index !== -1) {
              this.employees.splice(index, 1);
              this.employeeSlotsHTMLArray.splice(index, 1);
              this.saveEmployeeData();
              employeeElement.remove();
              location.reload();
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

// WeekdaySlot event listeners
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

// Date/Note/shifts event listeners

const dateOfWeek = document.getElementById('dateOfWeek');
const extraInfo = document.getElementById('extraInfo');
const amShiftHP1 = document.getElementById('amShiftHP1');
const pmShiftHP1 = document.getElementById('pmShiftHP1');
const amShiftHP2 = document.getElementById('amShiftHP2');
const pmShiftHP2 = document.getElementById('pmShiftHP2');

dateOfWeek.addEventListener('click', () => {
  const date = prompt("Enter text");
  dateOfWeek.innerText = date;
  localStorage.setItem('dateText', dateOfWeek.innerHTML);
});

extraInfo.addEventListener('click', () => {
  const info = prompt("Enter text");
  extraInfo.innerText = info;
  localStorage.setItem('infoText', extraInfo.innerHTML);
});

amShiftHP1.addEventListener('click', () => {
  const shift = prompt("Enter shift info");
  amShiftHP1.innerText = shift;
  localStorage.setItem('amShiftHP1', amShiftHP1.innerHTML);
});

pmShiftHP1.addEventListener('click', () => {
  const shift = prompt("Enter shift info");
  pmShiftHP1.innerText = shift;
  localStorage.setItem('pmShiftHP1', pmShiftHP1.innerHTML);
});

amShiftHP2.addEventListener('click', () => {
  const shift = prompt("Enter shift info");
  amShiftHP2.innerText = shift;
  localStorage.setItem('amShiftHP2', amShiftHP2.innerHTML);
});

pmShiftHP2.addEventListener('click', () => {
  const shift = prompt("Enter shift info");
  pmShiftHP2.innerText = shift;
  localStorage.setItem('pmShiftHP2', pmShiftHP2.innerHTML);
});

