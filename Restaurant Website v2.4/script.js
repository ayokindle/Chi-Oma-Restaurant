document.addEventListener("DOMContentLoaded", function () {
  setupHeader();
  setupHamburger();
  setupFooterYear();
  loadData();
  if (document.getElementById("reserve-form")) setupForm();
  setupMenuTabs();
});

function setupHeader() {
  var header = document.getElementById("header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 50);
  });
}

function setupHamburger() {
  var hamburger = document.getElementById("hamburger");
  var navList = document.getElementById("nav-list");
  hamburger.addEventListener("click", function () {
    navList.classList.toggle("open");
  });
  navList.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navList.classList.remove("open");
    });
  });
}

function setupFooterYear() {
  var yearSpan = document.getElementById("year");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function loadData() {
  fetch("data.json")
    .then(function (response) { return response.json(); })
    .then(function (data) {
      if (document.getElementById("top-picks-grid")) buildTopPicks(data.topPicks);
      if (document.getElementById("gallery-col-0")) buildGallery(data.gallery);
      if (document.getElementById("time-slots")) buildTimeSlots(data.times);
      if (document.getElementById("menu-cards-food")) buildMenu(data.menu);
    })
    .catch(function (error) {
      console.error("Could not load data.json:", error);
    });
}

function buildTopPicks(picks) {
  var grid = document.getElementById("top-picks-grid");
  picks.forEach(function (pick) {
    var card = document.createElement("div");
    card.className = "pick-card";
    card.innerHTML =
      '<div class="pick-img-wrap">' +
        '<img src="' + pick.img + '" alt="' + pick.alt + '" loading="lazy" />' +
        '<span class="pick-price">' + pick.price + '</span>' +
      '</div>' +
      '<div class="pick-body">' +
        '<h3>' + pick.name + '</h3>' +
        '<p>' + pick.desc + '</p>' +
      '</div>';
    grid.appendChild(card);
  });
}

function buildMenu(menu) {
  renderMenuCards("menu-cards-food", menu.meals);
  renderMenuCards("menu-cards-soups", menu.soups);
  renderMenuCards("menu-cards-drinks", menu.drinks);
}

function renderMenuCards(containerId, items) {
  var container = document.getElementById(containerId);
  if (!container) return;
  items.forEach(function (item) {
    var card = document.createElement("div");
    card.className = "menu-card";
    card.innerHTML =
      '<img src="' + item.img + '" alt="' + item.alt + '" loading="lazy" />' +
      '<div class="menu-card-body">' +
        '<div class="menu-card-top">' +
          '<h3>' + item.name + '</h3>' +
          '<span class="menu-card-price">' + item.price + '</span>' +
        '</div>' +
        '<p>' + item.desc + '</p>' +
      '</div>';
    container.appendChild(card);
  });
}

function setupMenuTabs() {
  var tabs = document.querySelectorAll(".menu-tab");
  if (!tabs.length) return;
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (t) { t.classList.remove("active"); });
      document.querySelectorAll(".menu-category").forEach(function (c) {
        c.classList.remove("active");
      });
      tab.classList.add("active");
      document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
    });
  });
}

function buildGallery(photos) {
  var cols = [
    document.getElementById("gallery-col-0"),
    document.getElementById("gallery-col-1"),
    document.getElementById("gallery-col-2")
  ];

  photos.forEach(function (photo, i) {
    var img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt;
    img.loading = "lazy";
    cols[i % 3].appendChild(img);
  });

  cols.forEach(function (col) {
    col.querySelectorAll("img").forEach(function (img) {
      col.appendChild(img.cloneNode());
    });
  });

  var speeds = [0.4, 0.28, 0.35];
  var positions = [0, 0, 0];

  cols.forEach(function (col, i) {
    var halfHeight = col.scrollHeight / 2;
    positions[i] = i === 1 ? -halfHeight * 0.3 : 0;
    function animate() {
      positions[i] -= speeds[i];
      if (Math.abs(positions[i]) >= halfHeight) positions[i] = 0;
      col.style.transform = "translateY(" + positions[i] + "px)";
      requestAnimationFrame(animate);
    }
    animate();
  });
}

function buildTimeSlots(times) {
  var container = document.getElementById("time-slots");
  var hiddenInput = document.getElementById("chosen-time");
  times.forEach(function (time) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "time-btn";
    btn.textContent = time;
    btn.addEventListener("click", function () {
      container.querySelectorAll(".time-btn").forEach(function (b) {
        b.classList.remove("selected");
      });
      btn.classList.add("selected");
      hiddenInput.value = time;
    });
    container.appendChild(btn);
  });
}

function setupForm() {
  var form = document.getElementById("reserve-form");
  var successBox = document.getElementById("success-box");
  var successMsg = document.getElementById("success-message");
  var bookAgain = document.getElementById("book-again");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var firstName = document.getElementById("fname").value.trim();
    var lastName = document.getElementById("lname").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var date = document.getElementById("date").value;
    var guests = document.getElementById("guests").value;
    var chosenTime = document.getElementById("chosen-time").value;

    if (!firstName || !lastName) { alert("Please enter your full name."); return; }
    if (!email || email.indexOf("@") === -1) { alert("Please enter a valid email address."); return; }
    if (!phone) { alert("Please enter your phone number."); return; }
    if (!date) { alert("Please choose a date."); return; }
    if (!guests) { alert("Please choose the number of guests."); return; }
    if (!chosenTime) { alert("Please choose a time."); return; }

    var ref = "CHI-" + Math.floor(Math.random() * 90000 + 10000);
    var niceDate = new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    });

    successMsg.innerHTML =
      "Thank you, <strong>" + firstName + " " + lastName + "</strong>!<br><br>" +
      "Table for <strong>" + guests + " guest(s)</strong><br>" +
      "Date: <strong>" + niceDate + "</strong><br>" +
      "Time: <strong>" + chosenTime + "</strong><br><br>" +
      "Confirmation sent to: <strong>" + email + "</strong><br>" +
      "Booking Reference: <strong>" + ref + "</strong>";

    form.style.display = "none";
    successBox.style.display = "block";
  });

  bookAgain.addEventListener("click", function () {
    form.reset();
    document.querySelectorAll(".time-btn").forEach(function (b) {
      b.classList.remove("selected");
    });
    document.getElementById("chosen-time").value = "";
    form.style.display = "block";
    successBox.style.display = "none";
  });
}
