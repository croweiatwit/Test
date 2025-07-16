//JavaScript 

    document.addEventListener("DOMContentLoaded", function () {
      const menuToggle = document.getElementById("menuToggle");
      const menu = document.querySelector(".Menu");
      const body = document.body;

      menuToggle.addEventListener("change", function () {
        if (menuToggle.checked) {
          menu.style.transform = "translateX(0)";
          body.classList.add("menu-open");
        } else {
          menu.style.transform = "translateX(-300px)";
          body.classList.remove("menu-open");
        }
      });

      const userData = localStorage.getItem("user");
      if (userData) {
        const user = JSON.parse(userData);
        if (user.fullName) document.getElementById("profileName").textContent = user.fullName;
        if (user.email) document.getElementById("profileEmail").textContent = user.email;
      }
    });

    const toggle = document.getElementById("profileToggle");
    const profileMenu = document.getElementById("profileMenu");

    toggle.addEventListener("click", () => {
      profileMenu.style.display = profileMenu.style.display === "block" ? "none" : "block";
    });

    window.addEventListener("click", (e) => {
      if (!toggle.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.style.display = "none";
      }
    });

    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach((btn, index) => {
      btn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode', index === 1);
        themeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

