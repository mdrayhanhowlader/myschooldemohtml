// login check
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) window.location.href = "login.html";

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
});

// demo student data
let students = [
  { id: "01", name: "Ahsan", class: "5", section: "A", result: "A+", fees: 1000, attendance: "95%" },
  { id: "02", name: "Rima", class: "6", section: "B", result: "A", fees: 900, attendance: "92%" },
  { id: "03", name: "Karim", class: "7", section: "C", result: "B+", fees: 1100, attendance: "90%" }
];

// Add button: only admin/teacher
const addBtn = document.getElementById("addStudentBtn");
if (loggedInUser.role !== "admin" && loggedInUser.role !== "teacher") {
  addBtn.style.display = "none";
}

// determine visible students
function getVisibleStudents() {
  if (loggedInUser.role === "student") {
    return students.filter(s => s.id === loggedInUser.id); // only self
  }
  return students; // admin/teacher see all
}

// render cards
function renderCards() {
  const container = document.getElementById("studentCards");
  container.innerHTML = "";
  getVisibleStudents().forEach(s => {
    const card = document.createElement("div");
    card.className = "card student-card";
    card.innerHTML = `
      <h3>${s.name}</h3>
      <p>ID: ${s.id}</p>
      <p>Class: ${s.class} | Section: ${s.section}</p>
      <p>Result: ${s.result}</p>
      <p>Fees: $${s.fees}</p>
      <p>Attendance: ${s.attendance}</p>
    `;
    container.appendChild(card);
  });
}

// render table
function renderTable() {
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";
  getVisibleStudents().forEach((s, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.class}</td>
      <td>${s.section}</td>
      <td>${s.result}</td>
      <td>${s.fees}</td>
      <td>${s.attendance}</td>
      <td>
        ${(loggedInUser.role === "admin" || loggedInUser.role === "teacher") ? 
          `<button class="btn-edit" data-index="${index}">Edit</button>
           <button class="btn-delete" data-index="${index}">Delete</button>` : 
          `<span>--</span>`}
      </td>
    `;
    tbody.appendChild(tr);
  });

  // attach delete events
  document.querySelectorAll(".btn-delete").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.index;
      students.splice(idx, 1);
      renderAll();
    });
  });

  // attach edit events
  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.index;
      const s = getVisibleStudents()[idx];
      const newName = prompt("Edit Name", s.name);
      if (newName) s.name = newName;
      renderAll();
    });
  });
}

// add student (only admin/teacher)
addBtn.addEventListener("click", () => {
  const id = prompt("Student ID");
  const name = prompt("Student Name");
  const cls = prompt("Class");
  const section = prompt("Section");
  const result = prompt("Result");
  const fees = prompt("Fees");
  const attendance = prompt("Attendance");
  if (id && name && cls && section) {
    students.push({ id, name, class: cls, section, result, fees, attendance });
    renderAll();
  }
});

// render all
function renderAll() {
  renderCards();
  renderTable();
}

// initial render
renderAll();
