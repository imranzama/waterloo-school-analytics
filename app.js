/**
 * Waterloo Region EQAO Analytics Hub - Core Engine
 * Coordinates UI states, filter updates, Leaflet mapping, Chart.js displays,
 * side-by-side comparative algorithms, and database storage integrations.
 */

// --- Global Application State ---
let APP_STATE = {
  schools: [],
  selectedSchoolName: "Laurel Heights Secondary School",
  selectedYear: "2024-2025",
  selectedLevel: "Secondary",
  selectedSubject: "Grade 9 Mathematics",
  comparisonList: [],
  dashboardChart: null,
  comparisonChart: null,
  mapInstance: null,
  mapMarkers: []
};

// --- Initializing State and Event Hookups ---
document.addEventListener("DOMContentLoaded", () => {
  initDatabase();
  initNavigation();
  initFilters();
  initAutocomplete();
  initDashboard();
  initCompareHub();
  initDataHub();
  
  // Render initial views
  renderDashboard();
  
  // Lazy-load map on tab toggle to prevent Leaflet container resizing bugs
  document.getElementById("map-tab-btn").addEventListener("click", () => {
    setTimeout(initMap, 150);
  });
});

// --- Database & Storage Operations ---
function initDatabase() {
  const storedData = localStorage.getItem("waterloo_school_db");
  if (storedData) {
    try {
      APP_STATE.schools = JSON.parse(storedData);
    } catch (e) {
      console.error("Failed to parse local storage DB. Resetting to defaults.", e);
      APP_STATE.schools = [...SCHOOLS_DATA];
    }
  } else {
    APP_STATE.schools = [...SCHOOLS_DATA];
    localStorage.setItem("waterloo_school_db", JSON.stringify(SCHOOLS_DATA));
  }
}

// --- Navigation Controller ---
function initNavigation() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const targetContent = document.getElementById(tab.getAttribute("data-tab"));
      if (targetContent) targetContent.classList.add("active");
      
      // Auto refresh comparison charts if switching to compare tab
      if (tab.getAttribute("data-tab") === "compare") {
        renderComparisonWorkspace();
      }
    });
  });
}

// --- Filter Elements Controller ---
function initFilters() {
  const boardFilter = document.getElementById("board-filter");
  const levelFilter = document.getElementById("level-filter");
  const yearFilter = document.getElementById("year-filter");

  // Sync Level with Subject Dropdowns and Stats
  levelFilter.addEventListener("change", (e) => {
    APP_STATE.selectedLevel = e.target.value;
    
    // Set logical default school & subject when switching panel levels
    if (APP_STATE.selectedLevel === "Secondary") {
      APP_STATE.selectedSchoolName = "Laurel Heights Secondary School";
      APP_STATE.selectedSubject = "Grade 9 Mathematics";
    } else {
      APP_STATE.selectedSchoolName = "Laurelwood Public School";
      APP_STATE.selectedSubject = "Grade 3 Mathematics";
    }
    
    document.getElementById("school-search").value = "";
    setupSubjectDropdown();
    renderDashboard();
    
    // If map is loaded, update sidebar list and map pins
    if (APP_STATE.mapInstance) {
      renderMapSidebar();
      renderMapMarkers();
    }
  });

  boardFilter.addEventListener("change", () => {
    renderDashboard();
    if (APP_STATE.mapInstance) {
      renderMapSidebar();
      renderMapMarkers();
    }
  });

  yearFilter.addEventListener("change", (e) => {
    APP_STATE.selectedYear = e.target.value;
    renderDashboard();
  });

  // Setup initial subjects
  setupSubjectDropdown();
}

function setupSubjectDropdown() {
  const container = document.getElementById("subject-selector-wrapper");
  container.innerHTML = "";

  const select = document.createElement("select");
  select.className = "control-select";
  select.id = "dashboard-subject-select";

  const subjects = APP_STATE.selectedLevel === "Secondary" 
    ? ["Grade 9 Mathematics", "OSSLT"]
    : ["Grade 3 Reading", "Grade 3 Writing", "Grade 3 Mathematics", "Grade 6 Reading", "Grade 6 Writing", "Grade 6 Mathematics"];

  subjects.forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    if (sub === APP_STATE.selectedSubject) opt.selected = true;
    select.appendChild(opt);
  });

  select.addEventListener("change", (e) => {
    APP_STATE.selectedSubject = e.target.value;
    renderDashboardCharts();
    renderLeaderboard();
  });

  container.appendChild(select);
}

// --- Autocomplete Control ---
function initAutocomplete() {
  const searchInput = document.getElementById("school-search");
  const suggestionsBox = document.getElementById("search-suggestions");

  searchInput.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase().trim();
    suggestionsBox.innerHTML = "";

    if (!value) {
      suggestionsBox.style.display = "none";
      return;
    }

    const filtered = APP_STATE.schools.filter(school => {
      const matchesBoard = getBoardFilter() === "ALL" || school.board === getBoardFilter();
      const matchesLevel = school.level === APP_STATE.selectedLevel;
      const matchesName = school.name.toLowerCase().includes(value);
      return matchesBoard && matchesLevel && matchesName;
    });

    if (filtered.length === 0) {
      suggestionsBox.style.display = "none";
      return;
    }

    filtered.forEach(school => {
      const item = document.createElement("div");
      item.style.padding = "0.6rem 1rem";
      item.style.cursor = "pointer";
      item.style.borderBottom = "1px solid rgba(255,255,255,0.03)";
      item.style.fontSize = "0.85rem";
      item.className = "suggestion-item";
      item.innerHTML = `
        <div style="font-weight:600;">${school.name}</div>
        <div style="font-size:0.75rem; color:var(--text-secondary);">${school.board} • ${school.address}</div>
      `;

      // Apply Hover Effects
      item.addEventListener("mouseenter", () => {
        item.style.background = "rgba(99, 102, 241, 0.15)";
      });
      item.addEventListener("mouseleave", () => {
        item.style.background = "transparent";
      });

      item.addEventListener("click", () => {
        APP_STATE.selectedSchoolName = school.name;
        searchInput.value = school.name;
        suggestionsBox.style.display = "none";
        renderDashboard();
      });

      suggestionsBox.appendChild(item);
    });

    suggestionsBox.style.display = "block";
  });

  // Close suggestions box if clicked outside
  document.addEventListener("click", (e) => {
    if (e.target !== searchInput && e.target !== suggestionsBox) {
      suggestionsBox.style.display = "none";
    }
  });
}

function getBoardFilter() {
  return document.getElementById("board-filter").value;
}

// --- Dashboard Visualizing Engine ---
function initDashboard() {
  // Setup empty hooks
}

function renderDashboard() {
  const currentSchool = APP_STATE.schools.find(s => s.name === APP_STATE.selectedSchoolName);
  
  if (!currentSchool) {
    // Graceful fallback to first school in current level
    const firstLevelSchool = APP_STATE.schools.find(s => s.level === APP_STATE.selectedLevel);
    if (firstLevelSchool) {
      APP_STATE.selectedSchoolName = firstLevelSchool.name;
      renderDashboard();
    }
    return;
  }

  // 1. Render Banner Information
  document.getElementById("current-school-title").textContent = currentSchool.name;
  document.getElementById("current-school-address").innerHTML = `<i class="fa-solid fa-location-dot"></i> ${currentSchool.address}`;
  document.getElementById("current-school-enrolment").textContent = `${currentSchool.enrollment.toLocaleString()} Students`;
  
  const boardBadge = document.getElementById("school-board-badge");
  boardBadge.textContent = currentSchool.board;
  if (currentSchool.board === "WRDSB") {
    boardBadge.style.background = "rgba(99, 102, 241, 0.12)";
    boardBadge.style.color = "var(--accent-indigo)";
    boardBadge.style.border = "1px solid rgba(99, 102, 241, 0.25)";
  } else {
    boardBadge.style.background = "rgba(6, 182, 212, 0.12)";
    boardBadge.style.color = "var(--accent-cyan)";
    boardBadge.style.border = "1px solid rgba(6, 182, 212, 0.25)";
  }

  // 2. Render Metric Summary Cards
  renderMetricSummaryCards(currentSchool);

  // 3. Draw Charts
  renderDashboardCharts();

  // 4. Update Leaderboard
  renderLeaderboard();
}

function renderMetricSummaryCards(school) {
  const container = document.getElementById("stats-container");
  container.innerHTML = "";
  
  const scores = school.eqao[APP_STATE.selectedYear] || {};
  const boardKey = school.board === "WRDSB" ? "WRDSB Average" : "WCDSB Average";
  
  const subjects = school.level === "Secondary"
    ? ["Grade 9 Mathematics", "OSSLT"]
    : ["Grade 3 Reading", "Grade 3 Mathematics", "Grade 6 Reading", "Grade 6 Mathematics"];

  subjects.forEach(subject => {
    const score = scores[subject];
    if (score === undefined) return;

    // Benchmarking
    const provAvg = BENCHMARKS["Ontario Provincial Average"][APP_STATE.selectedYear]?.[subject] || 0;
    const boardAvg = BENCHMARKS[boardKey][APP_STATE.selectedYear]?.[subject] || 0;
    
    const provGap = score - provAvg;
    const boardGap = score - boardAvg;

    const provGapClass = provGap >= 0 ? "plus" : "minus";
    const provGapSymbol = provGap >= 0 ? "+" : "";
    const boardGapClass = boardGap >= 0 ? "plus" : "minus";
    const boardGapSymbol = boardGap >= 0 ? "+" : "";

    const card = document.createElement("div");
    
    // Choose border glow class based on metric category
    let colorClass = "indigo";
    if (subject.includes("Math")) colorClass = "cyan";
    if (subject.includes("OSSLT")) colorClass = "amber";
    if (subject.includes("Reading")) colorClass = "emerald";

    card.className = `stat-card ${colorClass}`;
    card.innerHTML = `
      <div class="stat-title">${subject}</div>
      <div class="stat-value">${score}<span class="stat-unit">%</span></div>
      <div style="display:flex; flex-direction:column; gap:0.2rem; margin-top:0.4rem;">
        <div class="stat-desc">
          vs Province (${provAvg}%): 
          <span class="gap-tag ${provGapClass}">${provGapSymbol}${provGap}%</span>
        </div>
        <div class="stat-desc">
          vs Board (${boardAvg}%): 
          <span class="gap-tag ${boardGapClass}">${boardGapSymbol}${boardGap}%</span>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function renderDashboardCharts() {
  const currentSchool = APP_STATE.schools.find(s => s.name === APP_STATE.selectedSchoolName);
  if (!currentSchool) return;

  const subject = APP_STATE.selectedSubject;
  document.getElementById("main-chart-title").textContent = `${currentSchool.name} - Historical Trend (${subject})`;

  const years = ["2022-2023", "2023-2024", "2024-2025"];
  
  // Extract values
  const schoolScores = years.map(yr => currentSchool.eqao[yr]?.[subject] || null);
  const provScores = years.map(yr => BENCHMARKS["Ontario Provincial Average"][yr]?.[subject] || null);
  
  const boardKey = currentSchool.board === "WRDSB" ? "WRDSB Average" : "WCDSB Average";
  const boardScores = years.map(yr => BENCHMARKS[boardKey][yr]?.[subject] || null);

  const ctx = document.getElementById("dashboardChart").getContext("2d");

  if (APP_STATE.dashboardChart) {
    APP_STATE.dashboardChart.destroy();
  }

  // Create smooth gradients for dark canvas styling
  const schoolGradient = ctx.createLinearGradient(0, 0, 0, 300);
  schoolGradient.addColorStop(0, "rgba(99, 102, 241, 0.4)");
  schoolGradient.addColorStop(1, "rgba(99, 102, 241, 0.0)");

  APP_STATE.dashboardChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: [
        {
          label: `${currentSchool.name}`,
          data: schoolScores,
          borderColor: "#6366f1",
          backgroundColor: schoolGradient,
          borderWidth: 3.5,
          tension: 0.35,
          fill: true,
          pointBackgroundColor: "#6366f1",
          pointBorderColor: "#ffffff",
          pointRadius: 6,
          pointHoverRadius: 8
        },
        {
          label: `${currentSchool.board} Average`,
          data: boardScores,
          borderColor: "#06b6d4",
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.1,
          fill: false,
          pointRadius: 3,
          pointBackgroundColor: "#06b6d4"
        },
        {
          label: "Ontario Provincial Average",
          data: provScores,
          borderColor: "#f59e0b",
          borderWidth: 2,
          tension: 0.1,
          fill: false,
          pointRadius: 3,
          pointBackgroundColor: "#f59e0b"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#94a3b8",
            font: { family: "'Outfit', sans-serif", size: 12 }
          }
        },
        tooltip: {
          backgroundColor: "#1e293b",
          titleColor: "#ffffff",
          bodyColor: "#f8fafc",
          borderColor: "rgba(255,255,255,0.08)",
          borderWidth: 1,
          padding: 10,
          displayColors: true
        }
      },
      scales: {
        y: {
          min: 40,
          max: 100,
          grid: { color: "rgba(255,255,255,0.03)" },
          ticks: {
            color: "#64748b",
            font: { family: "'Inter', sans-serif" },
            callback: value => value + "%"
          }
        },
        x: {
          grid: { display: false },
          ticks: {
            color: "#64748b",
            font: { family: "'Inter', sans-serif" }
          }
        }
      }
    }
  });
}

function renderLeaderboard() {
  const leaderboardMetricLabel = document.getElementById("leaderboard-metric-label");
  const container = document.getElementById("leaderboard-container");
  
  const subject = APP_STATE.selectedSubject;
  leaderboardMetricLabel.textContent = `${subject} (${APP_STATE.selectedYear})`;
  container.innerHTML = "";

  // Filter and sort schools
  let filtered = APP_STATE.schools.filter(school => {
    const matchesLevel = school.level === APP_STATE.selectedLevel;
    const matchesBoard = getBoardFilter() === "ALL" || school.board === getBoardFilter();
    const hasScore = school.eqao[APP_STATE.selectedYear]?.[subject] !== undefined;
    return matchesLevel && matchesBoard && hasScore;
  });

  filtered.sort((a, b) => {
    const scoreA = a.eqao[APP_STATE.selectedYear][subject];
    const scoreB = b.eqao[APP_STATE.selectedYear][subject];
    return scoreB - scoreA;
  });

  // Take top 5
  const topSchools = filtered.slice(0, 5);

  if (topSchools.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:var(--text-muted); padding:1rem;">No data matches active filters.</div>`;
    return;
  }

  topSchools.forEach((school, index) => {
    const score = school.eqao[APP_STATE.selectedYear][subject];
    const provAvg = BENCHMARKS["Ontario Provincial Average"][APP_STATE.selectedYear]?.[subject] || 0;
    
    let comparisonClass = "neutral";
    if (score > provAvg) comparisonClass = "up";

    const item = document.createElement("div");
    item.className = "leaderboard-item";
    item.innerHTML = `
      <div class="school-rank-info">
        <div class="rank-badge">${index + 1}</div>
        <div>
          <div class="school-name-text" title="${school.name}">${school.name}</div>
          <span class="school-board-tag" style="font-size:0.65rem; padding:0.1rem 0.3rem;">${school.board}</span>
        </div>
      </div>
      <div class="school-score-value ${comparisonClass}">${score}%</div>
    `;

    // Make leaderboard items clickable to focus school
    item.style.cursor = "pointer";
    item.addEventListener("click", () => {
      APP_STATE.selectedSchoolName = school.name;
      document.getElementById("school-search").value = school.name;
      renderDashboard();
    });

    container.appendChild(item);
  });
}

// --- Leaflet Interactive Map Module ---
function initMap() {
  if (APP_STATE.mapInstance) return; // Prevent double-initialization

  // Center map on Waterloo Region (Kitchener/Waterloo coordinate node)
  APP_STATE.mapInstance = L.map("map-canvas").setView([43.4643, -80.5204], 12);

  // Apply dark mode theme basemap tiles
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: '© <a href="https://carto.com/">CARTO</a> • Data: EQAO, WRDSB',
    maxZoom: 19
  }).addTo(APP_STATE.mapInstance);

  renderMapSidebar();
  renderMapMarkers();
}

function renderMapSidebar() {
  const container = document.getElementById("map-schools-list");
  container.innerHTML = "";

  const filtered = APP_STATE.schools.filter(school => {
    const matchesLevel = school.level === APP_STATE.selectedLevel;
    const matchesBoard = getBoardFilter() === "ALL" || school.board === getBoardFilter();
    return matchesLevel && matchesBoard;
  });

  filtered.forEach(school => {
    const card = document.createElement("div");
    card.className = "school-mini-card";
    if (school.name === APP_STATE.selectedSchoolName) card.classList.add("selected");

    const scores = school.eqao["2024-2025"] || {};
    const keyMetric = school.level === "Secondary" ? "Grade 9 Mathematics" : "Grade 3 Mathematics";
    const scoreVal = scores[keyMetric] ? `${scores[keyMetric]}%` : "N/A";

    card.innerHTML = `
      <h4>${school.name}</h4>
      <p><i class="fa-solid fa-location-dot"></i> ${school.address}</p>
      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.4rem;">
        <span class="school-board-tag">${school.board}</span>
        <span style="font-size:0.75rem; font-weight:700; color:var(--accent-cyan);">${keyMetric}: ${scoreVal}</span>
      </div>
    `;

    card.addEventListener("click", () => {
      document.querySelectorAll(".school-mini-card").forEach(c => c.classList.remove("selected"));
      card.classList.add("selected");
      
      // Center map on clicked school
      APP_STATE.selectedSchoolName = school.name;
      APP_STATE.mapInstance.flyTo(school.coordinates, 14, { duration: 1 });
      
      // Auto open leaflet popup
      const marker = APP_STATE.mapMarkers.find(m => m.schoolName === school.name);
      if (marker) marker.openPopup();
    });

    container.appendChild(card);
  });

  // Connect sidebar quick search box
  const searchBar = document.getElementById("map-search");
  searchBar.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase();
    const cards = container.querySelectorAll(".school-mini-card");
    
    cards.forEach(card => {
      const name = card.querySelector("h4").textContent.toLowerCase();
      if (name.includes(val)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
}

function renderMapMarkers() {
  // Clear existing pins
  APP_STATE.mapMarkers.forEach(m => APP_STATE.mapInstance.removeLayer(m));
  APP_STATE.mapMarkers = [];

  const filtered = APP_STATE.schools.filter(school => {
    const matchesLevel = school.level === APP_STATE.selectedLevel;
    const matchesBoard = getBoardFilter() === "ALL" || school.board === getBoardFilter();
    return matchesLevel && matchesBoard;
  });

  // Calculate coordinates average to adjust bounds if needed
  filtered.forEach(school => {
    // Compare key metrics to decide marker color
    const scores = school.eqao[APP_STATE.selectedYear] || {};
    const keyMetric = school.level === "Secondary" ? "Grade 9 Mathematics" : "Grade 3 Mathematics";
    const score = scores[keyMetric] || 0;
    const provAvg = BENCHMARKS["Ontario Provincial Average"][APP_STATE.selectedYear]?.[keyMetric] || 0;

    let markerColor = "#6366f1"; // Indigo
    if (score > provAvg + 3) markerColor = "#10b981"; // Green (High performing)
    if (score < provAvg - 3) markerColor = "#f59e0b"; // Yellow/Orange (Needs improvement)

    // Build custom HTML pin marker to give dynamic glow representation on Leaflet
    const customIcon = L.divIcon({
      html: `<div style="background:${markerColor}; width:16px; height:16px; border-radius:50%; border:2px solid #ffffff; box-shadow:0 0 10px ${markerColor};"></div>`,
      className: "custom-map-pin",
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    const marker = L.marker(school.coordinates, { icon: customIcon }).addTo(APP_STATE.mapInstance);
    marker.schoolName = school.name;

    // Create interactive hover content popup
    const popupContent = `
      <div style="font-family:'Inter', sans-serif; padding:0.25rem;">
        <h3>${school.name}</h3>
        <p style="font-size:0.75rem; color:#94a3b8; margin-bottom:0.5rem;"><i class="fa-solid fa-graduation-cap"></i> ${school.board} • Enrollment ~${school.enrollment}</p>
        <div style="border-top:1px solid rgba(255,255,255,0.08); padding-top:0.4rem;">
          <strong style="font-size:0.8rem; color:#f8fafc;">${keyMetric}: ${score}%</strong>
          <p style="font-size:0.7rem; color:#64748b; margin-top:0.1rem;">Ontario Prov. Standard average is ${provAvg}%</p>
        </div>
        <button onclick="focusSchoolFromMap('${school.name}')" style="margin-top:0.75rem; background:#6366f1; border:none; color:white; width:100%; padding:0.35rem 0.5rem; border-radius:6px; font-size:0.75rem; font-family:'Outfit',sans-serif; font-weight:600; cursor:pointer;">Load School Profile</button>
      </div>
    `;

    marker.bindPopup(popupContent);
    APP_STATE.mapMarkers.push(marker);
  });
}

// Global hook called by Leaflet popup button
window.focusSchoolFromMap = function(schoolName) {
  APP_STATE.selectedSchoolName = schoolName;
  document.getElementById("school-search").value = schoolName;
  
  // Toggle tab view back to dashboard
  const dashTab = document.querySelector('[data-tab="dashboard"]');
  if (dashTab) dashTab.click();
  
  renderDashboard();
};

// --- Multi-School Comparison Engine ---
function initCompareHub() {
  const levelSelect = document.getElementById("compare-level-filter");
  const subjectSelect = document.getElementById("compare-subject-select");
  const searchInput = document.getElementById("compare-search");

  levelSelect.addEventListener("change", (e) => {
    APP_STATE.comparisonList = []; // Clear active slots on level switch
    if (searchInput) searchInput.value = ""; // Clear search query
    renderCompareSelectionPool(e.target.value);
    setupCompareSubjectDropdown(e.target.value);
    renderComparisonWorkspace();
  });

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      renderCompareSelectionPool(levelSelect.value);
    });
  }

  subjectSelect.addEventListener("change", () => {
    renderComparisonWorkspace();
  });

  // Initial renders
  renderCompareSelectionPool("Secondary");
  setupCompareSubjectDropdown("Secondary");
}

function setupCompareSubjectDropdown(level) {
  const select = document.getElementById("compare-subject-select");
  select.innerHTML = "";

  const subjects = level === "Secondary"
    ? ["Grade 9 Mathematics", "OSSLT"]
    : ["Grade 3 Reading", "Grade 3 Writing", "Grade 3 Mathematics", "Grade 6 Reading", "Grade 6 Writing", "Grade 6 Mathematics"];

  subjects.forEach(sub => {
    const opt = document.createElement("option");
    opt.value = sub;
    opt.textContent = sub;
    select.appendChild(opt);
  });
}

function renderCompareSelectionPool(level) {
  const container = document.getElementById("compare-selection-pool");
  container.innerHTML = "";

  const searchInput = document.getElementById("compare-search");
  const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : "";

  const filtered = APP_STATE.schools.filter(school => {
    const matchesLevel = school.level === level;
    const matchesSearch = searchQuery === "" || school.name.toLowerCase().includes(searchQuery);
    return matchesLevel && matchesSearch;
  });

  filtered.forEach(school => {
    const item = document.createElement("div");
    item.className = "pool-item";
    item.innerHTML = `
      <div>
        <div style="font-weight:600; font-size:0.85rem;">${school.name}</div>
        <span class="school-board-tag" style="font-size:0.65rem;">${school.board}</span>
      </div>
      <button class="compare-add-btn" id="add-to-comp-${school.name.replace(/\s+/g, '-')}">Add to Compare</button>
    `;

    const addBtn = item.querySelector(".compare-add-btn");
    
    // Disable if already added or limit exceeded
    if (APP_STATE.comparisonList.includes(school.name)) {
      addBtn.disabled = true;
      addBtn.textContent = "Added";
      addBtn.style.borderColor = "rgba(255,255,255,0.05)";
      addBtn.style.color = "var(--text-muted)";
    }

    addBtn.addEventListener("click", () => {
      if (APP_STATE.comparisonList.length >= 3) {
        alert("You can compare a maximum of 3 schools at once.");
        return;
      }
      APP_STATE.comparisonList.push(school.name);
      renderCompareSelectionPool(level);
      renderComparisonWorkspace();
    });

    container.appendChild(item);
  });
}

function renderComparisonWorkspace() {
  const cardsContainer = document.getElementById("active-comparison-cards");
  const emptyState = document.getElementById("compare-empty-state");
  const chartCard = document.getElementById("comparison-chart-card");
  
  const levelSelect = document.getElementById("compare-level-filter").value;
  const subject = document.getElementById("compare-subject-select").value;

  if (APP_STATE.comparisonList.length === 0) {
    emptyState.style.display = "flex";
    chartCard.style.display = "none";
    
    // Clean old card elements
    const oldCards = cardsContainer.querySelectorAll(".comparison-card");
    oldCards.forEach(c => c.remove());
    return;
  }

  emptyState.style.display = "none";
  chartCard.style.display = "block";

  // Re-render comparison cards
  const oldCards = cardsContainer.querySelectorAll(".comparison-card");
  oldCards.forEach(c => c.remove());

  APP_STATE.comparisonList.forEach(schoolName => {
    const school = APP_STATE.schools.find(s => s.name === schoolName);
    if (!school) return;

    const scores = school.eqao[APP_STATE.selectedYear] || {};
    const scoreVal = scores[subject] !== undefined ? `${scores[subject]}%` : "N/A";

    const provAvg = BENCHMARKS["Ontario Provincial Average"][APP_STATE.selectedYear]?.[subject] || 0;
    const boardKey = school.board === "WRDSB" ? "WRDSB Average" : "WCDSB Average";
    const boardAvg = BENCHMARKS[boardKey][APP_STATE.selectedYear]?.[subject] || 0;

    const provGap = scores[subject] !== undefined ? scores[subject] - provAvg : null;
    const boardGap = scores[subject] !== undefined ? scores[subject] - boardAvg : null;

    const provGapHTML = provGap !== null 
      ? `<span class="gap-tag ${provGap >= 0 ? 'plus' : 'minus'}">${provGap >= 0 ? '+' : ''}${provGap}%</span>`
      : "N/A";
    
    const boardGapHTML = boardGap !== null 
      ? `<span class="gap-tag ${boardGap >= 0 ? 'plus' : 'minus'}">${boardGap >= 0 ? '+' : ''}${boardGap}%</span>`
      : "N/A";

    const card = document.createElement("div");
    card.className = "comparison-card";
    card.innerHTML = `
      <button class="remove-compare-btn"><i class="fa-solid fa-circle-xmark"></i></button>
      <h4>${school.name}</h4>
      <div class="comparison-card-meta">${school.board} • Enrolment ~${school.enrollment}</div>
      <div class="comparison-card-metrics">
        <div class="compare-metric-row">
          <span class="compare-metric-label">Selected Score:</span>
          <span class="compare-metric-val" style="color:var(--accent-cyan); font-size:1.15rem;">${scoreVal}</span>
        </div>
        <div class="compare-metric-row">
          <span class="compare-metric-label">vs Province (${provAvg}%):</span>
          <span>${provGapHTML}</span>
        </div>
        <div class="compare-metric-row">
          <span class="compare-metric-label">vs Board (${boardAvg}%):</span>
          <span>${boardGapHTML}</span>
        </div>
      </div>
    `;

    card.querySelector(".remove-compare-btn").addEventListener("click", () => {
      APP_STATE.comparisonList = APP_STATE.comparisonList.filter(name => name !== schoolName);
      renderCompareSelectionPool(levelSelect);
      renderComparisonWorkspace();
    });

    cardsContainer.appendChild(card);
  });

  // Render multi-school comparison growth line charts
  renderComparisonCharts(subject);
}

function renderComparisonCharts(subject) {
  const years = ["2022-2023", "2023-2024", "2024-2025"];
  const colorMap = ["#6366f1", "#06b6d4", "#10b981"]; // Indigo, Cyan, Emerald

  const datasets = APP_STATE.comparisonList.map((schoolName, index) => {
    const school = APP_STATE.schools.find(s => s.name === schoolName);
    const scores = years.map(yr => school.eqao[yr]?.[subject] || null);

    return {
      label: school.name,
      data: scores,
      borderColor: colorMap[index % colorMap.length],
      backgroundColor: "transparent",
      borderWidth: 3,
      tension: 0.25,
      pointRadius: 5,
      pointBackgroundColor: colorMap[index % colorMap.length]
    };
  });

  // Add Provincial Benchmark for context comparison
  const provScores = years.map(yr => BENCHMARKS["Ontario Provincial Average"][yr]?.[subject] || null);
  datasets.push({
    label: "Ontario Provincial Avg",
    data: provScores,
    borderColor: "#f59e0b",
    borderWidth: 1.5,
    borderDash: [6, 6],
    tension: 0.1,
    fill: false,
    pointRadius: 2,
    pointBackgroundColor: "#f59e0b"
  });

  const ctx = document.getElementById("comparisonChart").getContext("2d");

  if (APP_STATE.comparisonChart) {
    APP_STATE.comparisonChart.destroy();
  }

  APP_STATE.comparisonChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: years,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#94a3b8",
            font: { family: "'Outfit', sans-serif" }
          }
        },
        tooltip: {
          backgroundColor: "#1e293b",
          padding: 8
        }
      },
      scales: {
        y: {
          min: 40,
          max: 100,
          grid: { color: "rgba(255,255,255,0.03)" },
          ticks: {
            color: "#64748b",
            callback: val => val + "%"
          }
        },
        x: {
          grid: { display: false },
          ticks: { color: "#64748b" }
        }
      }
    }
  });
}

// --- Data Management Hub (JSON Editor CRUD) ---
function initDataHub() {
  const jsonTextArea = document.getElementById("raw-json-editor");
  const importBtn = document.getElementById("btn-import-json");
  const resetBtn = document.getElementById("btn-reset-json");
  const feedbackMsg = document.getElementById("json-feedback");

  // Load active DB
  jsonTextArea.value = JSON.stringify(APP_STATE.schools, null, 2);

  importBtn.addEventListener("click", () => {
    const rawVal = jsonTextArea.value;
    try {
      const parsed = JSON.parse(rawVal);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be a root array containing school data records.");
      }

      // Quick validate records
      parsed.forEach(school => {
        if (!school.name || !school.board || !school.level || !school.coordinates || !school.eqao) {
          throw new Error(`School record missing critical fields: ${JSON.stringify(school)}`);
        }
      });

      // Save
      APP_STATE.schools = parsed;
      localStorage.setItem("waterloo_school_db", JSON.stringify(parsed));
      
      // UI Success feedback
      feedbackMsg.textContent = "✓ Database updated successfully! Reloading views...";
      feedbackMsg.style.color = "var(--accent-emerald)";
      
      setTimeout(() => {
        feedbackMsg.textContent = "";
        renderDashboard();
        if (APP_STATE.mapInstance) {
          renderMapSidebar();
          renderMapMarkers();
        }
      }, 1500);

    } catch (e) {
      feedbackMsg.textContent = `✗ Validation Failed: ${e.message}`;
      feedbackMsg.style.color = "var(--accent-rose)";
    }
  });

  resetBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to discard your edits and restore the default EQAO database?")) {
      APP_STATE.schools = [...SCHOOLS_DATA];
      localStorage.setItem("waterloo_school_db", JSON.stringify(SCHOOLS_DATA));
      jsonTextArea.value = JSON.stringify(SCHOOLS_DATA, null, 2);
      
      feedbackMsg.textContent = "✓ Database reset to defaults.";
      feedbackMsg.style.color = "var(--accent-cyan)";
      
      setTimeout(() => {
        feedbackMsg.textContent = "";
        renderDashboard();
        if (APP_STATE.mapInstance) {
          renderMapSidebar();
          renderMapMarkers();
        }
      }, 1500);
    }
  });
}
