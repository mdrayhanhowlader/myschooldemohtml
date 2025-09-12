// should run early — if not logged in or wrong role, redirect back to index.html
(function () {
  try {
    const userStr = localStorage.getItem("loggedInUser");
    if (!userStr) { window.location.href = "index.html"; return; }
    const user = JSON.parse(userStr);
    const path = window.location.pathname.toLowerCase();
    // student dashboard path expected to include 'student.dashboard'
    if (path.includes("student.dashboard") && user.role !== "student") {
      window.location.href = "index.html";
      return;
    }
    // otherwise OK
  } catch (err) {
    console.error(err);
    window.location.href = "index.html";
  }
})();
