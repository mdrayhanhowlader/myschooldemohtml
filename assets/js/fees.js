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
  { id: "01", name: "Ahsan", class: "5", section: "A", fees: 1000, paid: true },
  { id: "02", name: "Rima", class: "6", section: "B", fees: 900, paid: false },
  { id: "03", name: "Karim", class: "7", section: "C", fees: 1100, paid: true }
];

// visible students
function getVisibleStudents() {
  return loggedInUser.role === "student" ? 
    students.filter(s => s.id === loggedInUser.id) : students;
}

// render cards
function renderCards() {
  const container = document.getElementById("feeCards");
  container.innerHTML = "";
  getVisibleStudents().forEach(s => {
    const card = document.createElement("div");
    card.className = "card student-card";
    card.innerHTML = `
      <h3>${s.name}</h3>
      <p>Class: ${s.class} | Section: ${s.section}</p>
      <p>Fees: $${s.fees}</p>
      <p>Status: <span class="${s.paid ? 'status-paid' : 'status-unpaid'}">${s.paid ? 'Paid' : 'Unpaid'}</span></p>
    `;
    container.appendChild(card);
  });
}

// render table
function renderTable() {
  const tbody = document.querySelector("#feesTable tbody");
  tbody.innerHTML = "";
  getVisibleStudents().forEach((s, visibleIndex) => {
    const realIndex = students.findIndex(st => st.id === s.id);
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.class}</td>
      <td>${s.section}</td>
      <td>${s.fees}</td>
      <td class="${s.paid ? 'status-paid' : 'status-unpaid'}">${s.paid ? 'Paid' : 'Unpaid'}</td>
      <td>${
        (loggedInUser.role === "admin" || loggedInUser.role === "teacher") ? 
          `<button class="btn-toggle" data-index="${realIndex}">Toggle</button>` : '--'
      }</td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".btn-toggle").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.index;
      students[idx].paid = !students[idx].paid;
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
