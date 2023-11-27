package handlers

import (
	"api/functions"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type TodoTask struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Date        string `json:"date"` // Assuming this is a date in YYYY-MM-DD format
	TodoOrder   int    `json:"todoOrder"`
}

type DayTasks struct {
	Day   string     `json:"day"`
	Date  string     `json:"date"`
	Tasks []TodoTask `json:"tasks"`
}

func GetTodoTasks(res http.ResponseWriter, req *http.Request) {
	fmt.Println("GetTodoTasks called")

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dbConnection.Close()

	todayDate := functions.GetTodayDate()
	endDate := time.Now().Add(7 * 24 * time.Hour).Format(time.DateOnly)

	query := "SELECT id, title, description, date, todoOrder FROM todos WHERE date >= ? AND date < ? ORDER BY date ASC, todoOrder ASC;"
	result, err := dbConnection.Query(query, todayDate, endDate)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	tasksMap := make(map[string][]TodoTask)
	for result.Next() {
		var task TodoTask
		err := result.Scan(&task.Id, &task.Title, &task.Description, &task.Date, &task.TodoOrder)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		tasksMap[task.Date] = append(tasksMap[task.Date], task)
	}

	var weekTasks []DayTasks
	for i := 0; i < 7; i++ {
		date := time.Now().Add(time.Duration(i) * 24 * time.Hour).Format(time.DateOnly)
		dayName := time.Now().Add(time.Duration(i) * 24 * time.Hour).Format("Monday")
		dayTasks, exists := tasksMap[date]
		if !exists {
			dayTasks = []TodoTask{} // Empty slice
		}
		weekTasks = append(weekTasks, DayTasks{Day: dayName, Date: date, Tasks: dayTasks})
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
