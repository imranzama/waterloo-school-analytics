# Waterloo Region EQAO Analytics Hub

An interactive, high-fidelity web portal for parents, educators, and community members to explore, analyze, and compare EQAO student performance results in the Waterloo Region (representing both the WRDSB and WCDSB).

This platform acts as an open-source, serverless web application. It integrates dynamic charts, interactive geographical mapping, and side-by-side comparison workspaces to deliver an editorial, premium user experience—hosted for free on **GitHub Pages**.

---

## ✨ Features & Architecture

*   **📈 Dashboard View:** Real-time metrics dashboard highlighting school scores, board averages, and provincial standards. Tracks three years of historical EQAO indicators (2022-2025) via interactive **Chart.js** canvas widgets.
*   **🗺️ Interactive School Finder Map:** Centers on the Waterloo Region using a custom dark theme **Leaflet.js** map. Employs glowing achievement pins color-coded by performance thresholds. Clicking a marker instantly loads the school's complete profile.
*   **⚖️ Side-by-Side School Comparer:** Empowers parents to add up to 3 elementary or secondary schools. Directly compares subject ratings, calculates performance gaps against standards, and charts comparative growth lines.
*   **🔍 Autocomplete Search bars:** Quick, interactive fuzzy searches in the dashboard tab and comparison pool sidebar allow users to find specific schools instantly.
*   **🛠️ Local Storage JSON Hub:** Built-in CRUD module. Users can directly copy out the underlying JSON database, apply manual adjustments, or import new data directly from the web browser.

---

## 📂 Codebase File Layout

The project runs 100% client-side with zero compilation dependencies:

```text
Waterloo Region DSB School Ranking Analytics Project/
├── index.html        # Main layout, HTML semantic blocks, control hubs & scripts
├── style.css         # Custom dark glassmorphic styling, variables, hovers, leaflet style overrides
├── data.js           # Substantive, verified 2022-2025 EQAO database & spatial coordinate metrics
├── app.js            # Leaflet layer maps, dual Chart.js loops, input autocomplete, filter binders
└── README.md         # Repository documentation
```

---

## 🚀 Getting Started

### 1. Launching Locally
Since the site uses pure serverless web components, there is no database server to boot or node dependencies to compile:
1. Double-click the `index.html` file in this folder.
2. The interactive EQAO analytics portal will open immediately in your web browser.

### 2. Deploying for Free to GitHub Pages
To share the dashboard publicly with parents in Waterloo Region:
1. Initialize a git repository in this folder:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of EQAO Waterloo School Analytics Hub"
   ```
2. Create a public repository on GitHub named `waterloo-school-analytics`.
3. Link the remote and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/waterloo-school-analytics.git
   git branch -M main
   git push -u origin main
   ```
4. On GitHub, go to your repository's **Settings** → **Pages**.
5. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/root`, and click **Save**.
6. The dashboard will be instantly live at:
   `https://YOUR_USERNAME.github.io/waterloo-school-analytics/`

---

## 📊 Data Sources & Disclaimers
*   **EQAO Student Standard percentages:** Sourced from the Education Quality and Accountability Office ([eqao.com](https://www.eqao.com)).
*   **School boundaries & enrollments:** Ontario School Information System (OnSIS).
*   **Location data & parameters:** Waterloo Region District School Board ([wrdsb.ca](https://www.wrdsb.ca)) Open Data catalogue.
