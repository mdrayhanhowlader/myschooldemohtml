// demo user list
const users = [
    { id: "student01", password: "1234", role: "student" },
    { id: "teacher01", password: "abcd", role: "teacher" },
    { id: "admin01", password: "admin", role: "admin" }
  ];
  
  // login form handle
  document.getElementById("loginForm").addEventListener("submit", function(e) {
    e.preventDefault();
  
    const userId = document.getElementById("userid").value.trim();
    const password = document.getElementById("password").value.trim();
  
    // check user exist
    const user = users.find(u => u.id === userId && u.password === password);
  
    if (user) {
      alert(`Welcome ${user.role.toUpperCase()}!`);
      // user info store in localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      // redirect to dashboard
      window.location.href = "dashboard.html";
    } else {
      alert("Invalid User ID or Password ❌");
    }
  });
  