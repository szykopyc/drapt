# Drapt

**Drapt** is a modular portfolio analytics platform designed for modern analysts. Built with speed, clarity, and control in mind, 

---

## 🚀 Features

- 📊 Clean, responsive frontend built with React, TailwindCSS, and daisyUI  
- 🧠 Intuitive interface for interpreting portfolios in chaotic market conditions  

---

## 🧱 Tech Stack

- **Frontend**: React + Vite  
- **Styling**: TailwindCSS + daisyUI  
- **Backend**: FastAPI, Pandas, NumPy, statsmodels, requests - coming soon...

---

## 📁 Project Structure

```
src/
┣ assets/
┃ ┗ dummy-data/
┃   ┣ chartData.js
┃   ┗ tableData.js
┣ components/
┃ ┣ adminpanel/
┃ ┃ ┣ UserEngagement.jsx
┃ ┃ ┗ UserManagementPanel.jsx
┃ ┣ adminui/
┃ ┃ ┣ BulkActionsCard.jsx
┃ ┃ ┣ UserCreationCard.jsx
┃ ┃ ┣ UserDeleteCard.jsx
┃ ┃ ┣ UserShowAllCard.jsx
┃ ┃ ┗ UserUpdateCard.jsx
┃ ┣ analysepanels/
┃ ┃ ┣ PerformancePanel.jsx
┃ ┃ ┗ RiskPanel.jsx
┃ ┣ analyseui/
┃ ┃ ┣ ChartCard.jsx
┃ ┃ ┣ ColouredText.jsx
┃ ┃ ┣ GlobalAnalysisCard.jsx
┃ ┃ ┣ MetricCard.jsx
┃ ┃ ┗ NewsCard.jsx
┃ ┣ authcomponents/
┃ ┃ ┣ PortfolioProtectedRoute.jsx
┃ ┃ ┗ ProtectedRoute.jsx
┃ ┣ baseui/
┃ ┃ ┣ BeginText.jsx
┃ ┃ ┣ CustomButton.jsx
┃ ┃ ┣ CustomCard.jsx
┃ ┃ ┣ CustomFigures.jsx
┃ ┃ ┣ CustomList.jsx
┃ ┃ ┣ CustomTable.jsx
┃ ┃ ┣ InlineCodeBlock.jsx
┃ ┃ ┣ LargeCodeBlock.jsx
┃ ┃ ┣ MainBlock.jsx
┃ ┃ ┣ SectionMaintenanceWarning.jsx
┃ ┃ ┗ TabNav.jsx
┃ ┣ helperui/
┃ ┃ ┣ DivHelper.jsx
┃ ┃ ┣ FormErrorHelper.jsx
┃ ┃ ┣ FormFieldHelper.jsx
┃ ┃ ┣ FullscreenItemHelper.jsx
┃ ┃ ┣ LargeSubmitHelper.jsx
┃ ┃ ┣ LoadingSpinnerHelper.jsx
┃ ┃ ┣ ModalHelper.jsx
┃ ┃ ┗ ResetFormHelper.jsx
┃ ┣ layout/
┃ ┃ ┣ Footer.jsx
┃ ┃ ┣ MasterLayout.jsx
┃ ┃ ┗ Navbar.jsx
┃ ┣ portfoliopanels/
┃ ┃ ┣ OverviewPanel.jsx
┃ ┃ ┣ PortfolioAdminPanel.jsx
┃ ┃ ┗ TradeBookerPanel.jsx
┃ ┣ portfolioui/
┃ ┃ ┣ BookTradeCard.jsx
┃ ┃ ┣ BuySellToggle.jsx
┃ ┃ ┣ GlobalPortfolioCard.jsx
┃ ┃ ┗ TradeHistoryCard.jsx
┃ ┣ userui/
┃ ┃ ┣ ChangePassword.jsx
┃ ┃ ┣ CurrencySwitcher.jsx
┃ ┃ ┣ LogoutCard.jsx
┃ ┃ ┣ ProfileCard.jsx
┃ ┃ ┗ ThemeSwitcher.jsx
┃ ┗ validators/
┃   ┣ EmailValidator.jsx
┃   ┗ PasswordValidator.jsx
┣ errorpages/
┃ ┣ 401Unauthorised.jsx
┃ ┣ 403Forbidden.jsx
┃ ┣ 404NotFound.jsx
┃ ┣ 500InternalServerError.jsx
┃ ┣ ErrorBoundary.jsx
┃ ┣ MaintenanceError.jsx
┃ ┗ MaintenanceGuard.jsx
┣ pages/
┃ ┣ About.jsx
┃ ┣ AdminWrapper.jsx
┃ ┣ AnalyseIndex.jsx
┃ ┣ AnalyseWrapper.jsx
┃ ┣ Contact.jsx
┃ ┣ ForgotPassword.jsx
┃ ┣ Index.jsx
┃ ┣ Landing.jsx
┃ ┣ Login.jsx
┃ ┣ PortfolioIndex.jsx
┃ ┣ PortfolioWrapper.jsx
┃ ┗ Profile.jsx
┣ App.jsx
┣ index.css
┗ main.jsx
```

---

## 📌 Status

Drapt is currently under active solo development by [Szymon Kopyciński](https://linkedin.com/in/szymonkopycinski). He originally founded Drapt in November 2024, and has been working on it since, with 2 stings: November - February, May - Present.
The UI is nearing feature completion; work on the backend will begin soon.

---

## 📄 License

© 2025 Szymon Kopyciński. All rights reserved.  
This project is proprietary. You may view the code for educational or demonstration purposes only.  
Cloning, modifying, or redistributing the project without permission is prohibited.