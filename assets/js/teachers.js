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
  { id: "01", name: "Ahsan", class: "5", section: "A", attendance: false },
  { id: "02", name: "Rima", class: "6", section: "B", attendance: true },
  { id: "03", name: "Karim", class: "7", section: "C", attendance: false }
];

// render table
function renderTable() {
  const tbody = document.querySelector("#attendanceTable tbody");
  tbody.innerHTML = "";

  let visibleStudents = loggedInUser.role === "student" ? 
    students.filter(s => s.id === loggedInUser.id) : students;

  visibleStudents.forEach((s, visibleIndex) => {
    const tr = document.createElement("tr");

    // real index in main array for checkbox update
    const realIndex = students.findIndex(st => st.id === s.id);

    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.class}</td>
      <td>${s.section}</td>
      <td>${
        (loggedInUser.role === "admin" || loggedInUser.role === "teacher") ? 
          `<input type="checkbox" data-index="${realIndex}" ${s.attendance ? "checked" : ""}>` :
          (s.attendance ? "Present" : "Absent")
      }</td>
    `;
    tbody.appendChild(tr);
  });

  // attach change events only if teacher/admin
  if(loggedInUser.role === "admin" || loggedInUser.role === "teacher") {
    document.querySelectorAll("input[type='checkbox']").forEach(chk => {
      chk.addEventListener("change", e => {
        const idx = e.target.dataset.index;
        students[idx].attendance = e.target.checked;
      });
    });
  }
}

// save button
document.getElementById("saveAttendance").addEventListener("click", () => {
  if(loggedInUser.role === "admin" || loggedInUser.role === "teacher") {
    alert("Attendance saved!");
    console.log(students); // optional: see updated attendance in console
  } else {
    alert("You cannot edit attendance.");
  }
});

// initial render
renderTable();
