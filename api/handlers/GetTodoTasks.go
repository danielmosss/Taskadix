package handlers

import (
	"api/functions"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

func GetTodoTasks(res http.ResponseWriter, req *http.Request) {
	fmt.Println("GetTodoTasks called")

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer dbConnection.Close()

	todayDate := time.Now().Format(time.DateOnly)
	endDate := time.Now().Add(7 * 24 * time.Hour).Format(time.DateOnly)

	query := "SELECT id, title, description, date, todoOrder, isCHEagenda FROM todos WHERE date >= ? AND date < ? AND id NOT IN (SELECT todoId FROM irrelevantagendatodos) ORDER BY date ASC, todoOrder ASC;"
	result, err := dbConnection.Query(query, todayDate, endDate)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()

	tasksMap := make(map[string][]todoCard)
	for result.Next() {
		var task todoCard
		err := result.Scan(&task.Id, &task.Title, &task.Description, &task.Date, &task.TodoOrder, &task.IsCHE)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
		tasksMap[task.Date] = append(tasksMap[task.Date], task)
	}

	var weekTasks []DayTodos
	for i := 0; i < 7; i++ {
		date := time.Now().Add(time.Duration(i) * 24 * time.Hour).Format(time.DateOnly)
		dayName := time.Now().Add(time.Duration(i) * 24 * time.Hour).Format("Monday")
		dayTasks, exists := tasksMap[date]
		if !exists {
			dayTasks = []todoCard{} // Empty slice
		}
		weekTasks = append(weekTasks, DayTodos{Day: dayName, Date: date, Tasks: dayTasks})
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
