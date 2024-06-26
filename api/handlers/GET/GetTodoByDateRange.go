package GET

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"net/http"
	"time"
)

func GetTodoByDateRange(res http.ResponseWriter, req *http.Request) {
	//GetTodoTasksByDateRange?start=${dateRange.start}&end=${dateRange.end}
	var dateRange handlers.DateRange
	dateRange.Start = req.URL.Query().Get("start")
	dateRange.End = req.URL.Query().Get("end")

	if dateRange.Start == "" || dateRange.End == "" {
		http.Error(res, "Invalid date range1", http.StatusBadRequest)
		return
	}

	if dateRange.Start > dateRange.End {
		http.Error(res, "Invalid date range2", http.StatusBadRequest)
		return
	}

	if !dateRange7DaysApartCheck(dateRange) {
		http.Error(res, "Invalid date range3", http.StatusBadRequest)
		return
	}

	userId, err := functions.GetUserID(req)

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dbConnection.Close()

	query := `SELECT id, title, description, date, todoOrder, checked, isCHEagenda 
			  FROM todos 
			  WHERE userId = ? 
			    AND date >= ? AND date <= ?
			  ORDER BY date ASC, todoOrder ASC;`
	result, err := dbConnection.Query(query, userId, dateRange.Start, dateRange.End)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	tasksMap := make(map[string][]handlers.TodoCard)
	for result.Next() {
		var task handlers.TodoCard
		err := result.Scan(&task.Id, &task.Title, &task.Description, &task.Date, &task.TodoOrder, &task.Checked, &task.IsCHE)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		tasksMap[task.Date] = append(tasksMap[task.Date], task)
	}

	// update weekTasks to make an array of DayTodos with the date range instead of the first row of the database and the next 6 days
	var weekTasks []handlers.DayTodos
	startDate, err := time.Parse(time.DateOnly, dateRange.Start)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	for i := 0; i < 7; i++ {
		date := startDate.AddDate(0, 0, i).Format(time.DateOnly)
		dayName := startDate.AddDate(0, 0, i).Format("Monday")
		dayTasks, exists := tasksMap[date]
		if !exists {
			dayTasks = []handlers.TodoCard{} // If no todos for this day, set to empty slice
		}
		weekTasks = append(weekTasks, handlers.DayTodos{Day: dayName, Date: date, Tasks: dayTasks})
	}

	tasksJSON, err := json.Marshal(weekTasks)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.WriteHeader(http.StatusOK)
	res.Write(tasksJSON)
}

func dateRange7DaysApartCheck(dateRange handlers.DateRange) bool {
	startTime, err := time.Parse(time.DateOnly, dateRange.Start)
	if err != nil {
		return false
	}
	endTime, err := time.Parse(time.DateOnly, dateRange.End)
	if err != nil {
		panic(err)
		return false
	}

	var endtimeHours = endTime.Sub(startTime).Hours()

	if endtimeHours > 7*24 {
		return false
	}
	return true
}
