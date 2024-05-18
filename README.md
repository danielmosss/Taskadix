# Taskadix(Tas-ka-dix) - A Todolist(V1) and Agenda(V2) in one.
<ul>
  <li>Webapplication build with Angular, Golang and Mysql.</li>
  <li>Dashboard with a quick overview of your events today and the tasks for the upcoming 7 days.</li>
  <li>3 different agenda views: [day/week/month] </li>
  <li>Select a [day/week/month] with the angular datepicker.</li>
  <br>Funfact:
  <li>Taska means "task" in Spanish</li>
  <li>Taskadix means "Don't give up" in Maltese.</li>
</ul>

<p align="center">
  <img src="angular/src/assets/dashboardTodo.png" width="150">
</p>

<div align=center>
  <h3>
    <a href="#-features">Features</a>
    <span> | </span>
    <a href="https://github.com/danielmosss/dashboardTodo/issues">Issues</a>
  </h3>
</div>

<!-- <p align="center">
  <img src="angular/src/assets/dashboard.png" width="800px">
  <img src="angular/src/assets/account.png" width="800px">
</p> -->
<p align="center">
Screenshots are outdated. I will add new screenshots soon.
</p>

## 🚀 Features
* ✅ Dashboard with quick overview for desktop and mobile.
* ✅ Agenda with 3 different views:<br>
      - Day (Default: today)<br>
      - Week (Default: this week from sunday to saturday) [Landing view]<br>
      - Month (Default: this month)
* ✅ Responsive UI (I did my best 😅 feel free to make a PR with improvements)
* ✅ Standard TODO app features
* ✅ Account settings
* ✅ Color categories for agenda events. 
* ✅ Set webcall url (che.myx.nl supported)
* ✅ Login
* 🟧 Register (Disabled endpoint) 
* 🟧 Upload Json (outdated)
* 🟧 Upload ICS files (outdated)
* ❌ Change username
* ❌ Download backup of events and tasks
* ❌ Import your backups.


## ⌨️ How to use?

### Step 1: Clone the git repository
  
  ```bash
  git clone https://github.com/danielmosss/dashboardTodo.git
  ```

  Or download the lastest release from [here](https://github.com/danielmosss/dashboardTodo/releases/latest)

### Step 2: Install required programs & tools
#### Install [Dev Home](https://aka.ms/devhome) inorder to install all the tools with one click.
With Dev Home you can install all neccesary tools with one click by opening this file: ./dashboardtodo.widget.

### Step 3: Setup database
    
Run the todo-v2.sql and the migrations in the migration-v2 folder.<br>
Run the migrations from lowest to highest number.

### Step 4: Duplicate the .env-template and rename it to: .env
  
  ```bash
  cd api
  cp .env-template .env
  ```

  Fill in the .env file with your own settings.

  ```bash
  databaseConnectionString=root:passwordHere@tcp(localhost:portHere)/nameHere
  JWT_SECRET=secretHere
  ngrokRequest=ngrokRequestApiHere
  ```

  * databaseConnectionString - Fill in your own database settings.
  * JWT_SECRET - Fill in your own secret for the JWT token. This is a random string from anywhere between 32-64 characters.
  * ngrokRequest - Fill in your own ngrok request url. **This is not used when running the app locally.**


### Step 5: Start the go restapi

  ```bash
  cd api
  go run main.go
  ```

### Step 6: Install the angular dependencies

  ```bash
  cd angular/src
  npm install
  ```

### Step 7: Start the angular frontend

  ```bash
  cd angular/src
  ng serve --configuration development
  ```

### Step 8: Visit the dashboard

  For this you need to use a google browser and disable web security. <br>
  Here is a guide on how to do that: [Guide](https://alfilatov.com/posts/run-chrome-without-cors/)<br>
  This is because CORS is not enabled for localhost:4200 in the go restapi.

  ```bash
  http://localhost:4200
  ```
