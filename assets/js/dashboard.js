// Login check
const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
if (!loggedInUser) {
  window.location.href = "login.html";
} else {
  document.getElementById("welcomeUser").innerText =
    `Welcome, ${loggedInUser.id} (${loggedInUser.role})`;
}

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "login.html";
});
