// ========== Teacher Dashboard JS ==========

// ---------- Auth Check ----------
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser || loggedInUser.role !== "teacher") {
  window.location.href = "login.html";
}

// ---------- Logout ----------
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
});

// ---------- Sidebar Navigation ----------
const menuLinks = document.querySelectorAll(".side-menu a");
const sections = document.querySelectorAll(".section");

menuLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    menuLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");

    const target = link.dataset.section;
    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// ---------- Demo Data ----------
let teacherClasses = ["7", "8"]; // only class numbers
let teacherSections = ["A", "B"]; // example sections
let students = [
  { id: "S701", name: "Ahsan", class: "7", section: "A", attendance: false, autoAttendance: false, marks: {} },
  { id: "S702", name: "Rima", class: "7", section: "A", attendance: true, autoAttendance: false, marks: {} },
  { id: "S711", name: "Babu", class: "7", section: "B", attendance: false, autoAttendance: false, marks: {} },
  { id: "S803", name: "Rafiq", class: "8", section: "A", attendance: true, autoAttendance: false, marks: {} },
  { id: "S805", name: "Imran", class: "8", section: "A", attendance: false, autoAttendance: true, marks: {} }
  // add more students as needed
];

let salaryRecords = [
  { month: "August 2025", status: "Paid" },
  { month: "September 2025", status: "Pending" }
];

let leaves = [];

// ---------- Utility Functions ----------
function filterStudents(cls, sec) {
  return students.filter(s => s.class === cls && s.section === sec);
}

// ---------- Render Quick Stats ----------
function renderQuickStats() {
  document.getElementById("statClasses").textContent = teacherClasses.join(", ");
  document.getElementById("assignedClasses").textContent = teacherClasses.join(", ");
  document.getElementById("pendingActions").innerHTML = `Leave approvals: <strong>${leaves.length}</strong>`;
  document.getElementById("todayAttendance").textContent = "Not taken";
  document.getElementById("salaryStatus").textContent = salaryRecords[salaryRecords.length-1]?.status || "Pending";
}
renderQuickStats();

// ---------- Render Classes Dropdown ----------
const classSelect = document.getElementById("classSelect");
const sectionSelect = document.getElementById("sectionSelect");
const marksClass = document.getElementById("marksClass");
const marksSection = document.getElementById("marksSection");

teacherClasses.forEach(c => {
  const opt1 = document.createElement("option"); opt1.value = c; opt1.textContent = c; classSelect.appendChild(opt1);
  const opt2 = document.createElement("option"); opt2.value = c; opt2.textContent = c; marksClass.appendChild(opt2);
});

// ---------- Render Students Table ----------
function renderStudentsTableHTML(studentsList, tableId) {
  const tbody = document.querySelector(`#${tableId} tbody`);
  tbody.innerHTML = "";
  studentsList.forEach((s, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.class}${s.section}</td>
      <td>${s.phone || ""}</td>
      <td><button class="btn small viewStudent" data-id="${s.id}" data-table="${tableId}">View</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".viewStudent").forEach(btn => {
    btn.addEventListener("click", e => {
      const student = students.find(st => st.id === btn.dataset.id);
      openStudentModal(student);
    });
  });
}

// Load class students on button click
document.getElementById("loadStudentsBtn").addEventListener("click", () => {
  const cls = classSelect.value;
  const sec = sectionSelect.value;
  const filtered = filterStudents(cls, sec);
  renderStudentsTableHTML(filtered, "classStudentsTable");
});

// ---------- Attendance Section ----------
function renderAttendanceTable() {
  const tbody = document.querySelector("#takeAttendanceTable tbody");
  tbody.innerHTML = "";
  students.forEach((s, idx) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.autoAttendance ? "<span style='color:gray'>Pending Auto</span>" : `<input type="checkbox" data-id="${s.id}" ${s.attendance ? "checked" : ""}>`}</td>
      <td><button class="btn small viewStudent" data-id="${s.id}">View</button></td>
    `;
    tbody.appendChild(tr);
  });

  // Checkbox listener
  tbody.querySelectorAll("input[type='checkbox']").forEach(chk => {
    chk.addEventListener("change", e => {
      const student = students.find(s => s.id === e.target.dataset.id);
      student.attendance = e.target.checked;
    });
  });

  // View button
  tbody.querySelectorAll(".viewStudent").forEach(btn => {
    btn.addEventListener("click", e => {
      const student = students.find(s => s.id === btn.dataset.id);
      openStudentModal(student);
    });
  });
}
renderAttendanceTable();

// Mark all present button
document.getElementById("markAllPresent").addEventListener("click", () => {
  students.forEach(s => { if(!s.autoAttendance) s.attendance = true; });
  renderAttendanceTable();
});

// Save attendance
document.getElementById("saveAttendanceBtn").addEventListener("click", () => {
  alert("Attendance saved!");
});

// ---------- Marks Section ----------
function renderMarksTable() {
  const cls = marksClass.value;
  const sec = marksSection.value;
  const filtered = filterStudents(cls, sec);
  const tbody = document.querySelector("#marksTable tbody");
  tbody.innerHTML = "";
  filtered.forEach(s => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.class}${s.section}</td>
      <td><input type="number" data-id="${s.id}" value="${s.marks?.Test1||""}" /></td>
      <td><button class="btn small saveMarkBtn" data-id="${s.id}">Save</button></td>
    `;
    tbody.appendChild(tr);
  });

  tbody.querySelectorAll(".saveMarkBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const input = tbody.querySelector(`input[data-id='${btn.dataset.id}']`);
      const student = students.find(s => s.id === btn.dataset.id);
      if(!student.marks) student.marks = {};
      student.marks.Test1 = input.value;
      alert(`Marks saved for ${student.name}`);
    });
  });
}
marksClass.addEventListener("change", renderMarksTable);
marksSection.addEventListener("change", renderMarksTable);
renderMarksTable();

// ---------- All Students Table ----------
function renderAllStudents() {
  renderStudentsTableHTML(students, "allStudentsTable");
}
renderAllStudents();

// ---------- Salary Section ----------
function renderSalary() {
  document.getElementById("teacherSalary").textContent = "৳ 45,000";
  document.getElementById("lastPaid").textContent = "2025-08-30";
  document.getElementById("salaryStat").textContent = salaryRecords[salaryRecords.length-1]?.status || "Pending";
}
renderSalary();

document.getElementById("requestSalaryBtn").addEventListener("click", () => {
  salaryRecords.push({ month: new Date().toLocaleDateString(), status: "Requested" });
  renderSalary();
});

// ---------- Leave Section ----------
document.getElementById("teacherLeaveForm").addEventListener("submit", e => {
  e.preventDefault();
  const type = document.getElementById("teacherLeaveType").value;
  const from = document.getElementById("teacherLeaveFrom").value;
  const to = document.getElementById("teacherLeaveTo").value;
  const reason = document.getElementById("teacherLeaveReason").value;
  leaves.push({ type, from, to, reason, status:"Pending" });
  renderLeavesTable();
  e.target.reset();
});

function renderLeavesTable() {
  const tbody = document.querySelector("#teacherLeaveTable tbody");
  tbody.innerHTML = "";
  leaves.forEach(l => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.status}</td>`;
    tbody.appendChild(tr);
  });
}
renderLeavesTable();

// ---------- Student Modal ----------
const modal = document.getElementById("studentModal");
const modalContent = document.getElementById("studentModalContent");
modal.querySelector(".modal-close").addEventListener("click", ()=> modal.classList.add("hidden"));

function openStudentModal(student) {
  modalContent.innerHTML = `
    <h3>${student.name} (${student.id})</h3>
    <p><b>Class:</b> ${student.class}${student.section}</p>
    <p><b>Attendance:</b> ${student.attendance ? "Present" : "Absent"}</p>
    <hr>
    <label>Marks Test1</label>
    <input type="number" id="modalMarks" value="${student.marks?.Test1||""}" />
    <button class="btn small" id="saveModalMarks">Save</button>
  `;
  modal.classList.remove("hidden");

  document.getElementById("saveModalMarks").addEventListener("click", () => {
    student.marks.Test1 = document.getElementById("modalMarks").value;
    alert(`Marks saved for ${student.name}`);
    modal.classList.add("hidden");
  });
}

// ---------- Profile Section ----------
document.getElementById("saveProfileBtn").addEventListener("click", e=>{
  e.preventDefault();
  document.getElementById("profileMsg").textContent = "Profile updated successfully!";
});

document.getElementById("teacherPhotoUpload").addEventListener("change", e=>{
  const file = e.target.files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = ev => document.getElementById("teacherPhoto").src = ev.target.result;
    reader.readAsDataURL(file);
  }
});
