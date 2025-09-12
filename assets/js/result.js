// login check
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) window.location.href = "login.html";

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
});

// demo data
let students = [
  { id: "01", name: "Ahsan", class: "5", section: "A", result: "A+" },
  { id: "02", name: "Rima", class: "6", section: "B", result: "A" },
  { id: "03", name: "Karim", class: "7", section: "C", result: "B+" }
];

// visible students
function getVisibleStudents() {
  return loggedInUser.role === "student" ? 
    students.filter(s => s.id === loggedInUser.id) : students;
}

// render cards
function renderCards() {
  const container = document.getElementById("resultCards");
  container.innerHTML = "";
  getVisibleStudents().forEach(s => {
    const card = document.createElement("div");
    card.className = "card student-card";
    card.innerHTML = `
      <h3>${s.name}</h3>
      <p>Class: ${s.class} | Section: ${s.section}</p>
      <p>Result: <span class="result-grade">${s.result}</span></p>
    `;
    container.appendChild(card);
  });
}

// render table
function renderTable() {
  const tbody = document.querySelector("#resultsTable tbody");
  tbody.innerHTML = "";
  getVisibleStudents().forEach((s, visibleIndex) => {
    const realIndex = students.findIndex(st => st.id === s.id);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.class}</td>
      <td>${s.section}</td>
      <td>${s.result}</td>
      <td>${
        (loggedInUser.role === "admin" || loggedInUser.role === "teacher") ? 
          `<button class="btn-edit" data-index="${realIndex}">Edit</button>` : '--'
      }</td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btn-edit").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.index;
      const s = students[idx];
      const newResult = prompt("Edit Result", s.result);
      if (newResult) s.result = newResult;
      renderAll();
    });
  });
}

// render all
function renderAll() {
  renderCards();
  renderTable();
}

renderAll();
