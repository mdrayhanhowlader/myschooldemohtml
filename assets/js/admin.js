// Admin Login Validation
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("adminLoginForm");
    const errorMsg = document.getElementById("errorMsg");
  
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
  
        const adminId = document.getElementById("adminid").value.trim();
        const adminPass = document.getElementById("adminpass").value.trim();
  
        if (adminId === "admin01" && adminPass === "admin123") {
          // Save login session
          localStorage.setItem("isAdminLoggedIn", "true");
          window.location.href = "admin.dashboard.html";
        } else {
          errorMsg.textContent = "❌ Invalid ID or Password!";
        }
      });
    }
  
    // Logout functionality
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("isAdminLoggedIn");
        window.location.href = "admin-login.html";
      });
    }
  
    // Protect Dashboard Page
    if (window.location.pathname.includes("admin.dashboard.html")) { // ✅ dot file check
      const isLoggedIn = localStorage.getItem("isAdminLoggedIn");
      if (isLoggedIn !== "true") {
        window.location.href = "admin-login.html";
      }
    }
  });


  document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll(".section");
    const menuLinks = document.querySelectorAll(".sidebar ul li a");
  
    // Navigation
    menuLinks.forEach(link => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const target = this.dataset.section;
  
        sections.forEach(sec => sec.classList.remove("active"));
        document.getElementById(target).classList.add("active");
      });
    });
  
    // Students
    const studentForm = document.getElementById("addStudentForm");
    const studentList = document.getElementById("studentList");
  
    studentForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("studentName").value;
      const id = document.getElementById("studentId").value;
      const pass = document.getElementById("studentPass").value;
  
      const row = `<tr><td>${name}</td><td>${id}</td><td>${pass}</td></tr>`;
      studentList.insertAdjacentHTML("beforeend", row);
  
      studentForm.reset();
    });
  
    // Teachers
    const teacherForm = document.getElementById("addTeacherForm");
    const teacherList = document.getElementById("teacherList");
  
    teacherForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("teacherName").value;
      const id = document.getElementById("teacherId").value;
      const pass = document.getElementById("teacherPass").value;
  
      const row = `<tr><td>${name}</td><td>${id}</td><td>${pass}</td></tr>`;
      teacherList.insertAdjacentHTML("beforeend", row);
  
      teacherForm.reset();
    });
  
    // Admission Notices
    const admissionBtn = document.getElementById("saveAdmission");
    const admissionList = document.getElementById("admissionList");
  
    admissionBtn.addEventListener("click", function () {
      const notice = document.getElementById("admissionNotice").value;
      if (notice.trim() !== "") {
        admissionList.insertAdjacentHTML("beforeend", `<p>📢 ${notice}</p>`);
        document.getElementById("admissionNotice").value = "";
      }
    });
  
    // Fees
    const feeForm = document.getElementById("feeForm");
    const feeList = document.getElementById("feeList");
  
    feeForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const id = document.getElementById("feeStudentId").value;
      const amount = document.getElementById("feeAmount").value;
  
      feeList.insertAdjacentHTML("beforeend", `<li>Student ${id} paid ${amount}৳</li>`);
      feeForm.reset();
    });
  
    // Salary
    const salaryForm = document.getElementById("salaryForm");
    const salaryList = document.getElementById("salaryList");
  
    salaryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const id = document.getElementById("salaryTeacherId").value;
      const amount = document.getElementById("salaryAmount").value;
  
      salaryList.insertAdjacentHTML("beforeend", `<li>Teacher ${id} salary: ${amount}৳</li>`);
      salaryForm.reset();
    });
  
    // Results
    const resultForm = document.getElementById("resultForm");
    const resultList = document.getElementById("resultList");
  
    resultForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const id = document.getElementById("resultStudentId").value;
      const subject = document.getElementById("resultSubject").value;
      const marks = document.getElementById("resultMarks").value;
  
      resultList.insertAdjacentHTML("beforeend", `<li>${id} - ${subject}: ${marks} marks</li>`);
      resultForm.reset();
    });
  
    // Logout
    document.getElementById("logoutBtn").addEventListener("click", function () {
      localStorage.removeItem("isAdminLoggedIn");
      window.location.href = "admin-login.html";
    });
  });
  
  