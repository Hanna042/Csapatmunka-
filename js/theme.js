document.addEventListener("DOMContentLoaded", function () {
  const btn = document.getElementById("theme-toggle");

 
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    btn.textContent = "⚪";
  } else {
    btn.textContent = "⚫";
  }

 
  btn.onclick = function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      btn.textContent = "⚪";
    } else {
      localStorage.setItem("theme", "light");
      btn.textContent = "⚫";
    }
  };
});