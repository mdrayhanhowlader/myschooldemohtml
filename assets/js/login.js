// Demo users
const users = [
  { id: "student01", password: "12345", role: "student" },
  { id: "teacher01", password: "12345", role: "teacher" },
  { id: "admin01", password: "12345", role: "admin" }
];

const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

loginForm.addEventListener("submit", function(e){
  e.preventDefault();
  const userId = document.getElementById("studentId").value.trim();
  const password = document.getElementById("password").value;

  const foundUser = users.find(u => u.id === userId && u.password === password);

  if(foundUser){
    // save to localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(foundUser));
    
    // redirect based on role
    if(foundUser.role === "student"){
      window.location.href = "student.dashboard.html";
    } else if(foundUser.role === "teacher"){
      window.location.href = "teacher.dashboard.html";
    } else if(foundUser.role === "admin"){
      window.location.href = "admin.dashboard.html";
    }
  } else {
    errorMsg.textContent = "Invalid ID or Password!";
    errorMsg.style.color = "red";
  }
});
