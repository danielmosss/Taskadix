# dashboardTodo


<p align="center">
  <img src="angular/src/assets/dashboardTodo.png" width="350">
</p>

<h3 align="center">A dashbaord with clean overview of all your tasks for the upcomming 7 days.</h3>

<div align="center">
  <h3>
    <a href="#-features">Features</a>
    <span> | </span>
    <a href="https://github.com/danielmosss/dashboardTodo/issues">Issues</a>
  </h3>
</div>

<p align="center">
  <img src="angular/src/assets/download.png" width="800px">
</p>

## 🚀 Features

* ✅ Dashboard with clean overview.
* ✅ View weather in instance. 
* ✅ Overview for your week and your todos.
* ✅ Ability to select a week to view.
* ✅ Login
* ❌ Get location from browser for custom weather (Future)
* ❌ Nice Responsive UI - I'm very bad at making clean and responsive UI's

## ⌨️ How to use?

### Step 1: Clone the repo
  
  ```bash
  git clone https://github.com/danielmosss/dashboardTodo.git
  ```

### Step 2: Install NodeJS(v18.17.1) & Golang(v1.12.4) & Mysql
  
  * [NodeJS](https://nodejs.org/en/download/)
  * [Golang](https://golang.org/dl/)
  * [Mysql](https://dev.mysql.com/downloads/installer/)

### Step 3: Setup database
    
  ```bash
  cd database
  mysql -u root -p
  source todo.sql
  ```

### Step 4: Start the go restapi

  ```bash
  cd api
  go run main.go
  ```

### Step 5: Start the angular frontend

  ```bash
  cd angular/src
  ng serve --configuration development
  ```

### Step 6: Visit the dashboard

  ```bash
  http://localhost:4200
  ```