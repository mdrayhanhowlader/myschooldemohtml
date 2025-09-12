// demo users
const users = [
  { id: "student01", password: "12345", role: "student" },
  { id: "teacher01", password: "12345", role: "teacher" },
  { id: "admin01", password: "12345", role: "admin" }
];

// login form handle
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const userId = document.getElementById("studentId").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  // find user
  const user = users.find(u => u.id === userId && u.password === password);

  if (user) {
    // save to localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // redirect based on role
    if (user.role === "student") {
      window.location.href = "student.dashboard.html";
    } else if (user.role === "teacher") {
      window.location.href = "teacher.dashboard.html";
    } else if (user.role === "admin") {
      window.location.href = "admin.dashboard.html";
    }
  } else {
    errorMsg.textContent = "❌ Invalid ID or Password. Please try again.";
  }
});
