package functions

import (
	"fmt"
	ics "github.com/arran4/golang-ical"
	"net/http"
	"os"
	"strings"
	"time"
)

type Task struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Date        string `json:"date"`
}

func ProcessCalanderData() {
	tasks, err := fetchCalendarData()
	if err != nil {
		// Behandel fout
		return
	}

	for _, task := range tasks {
		fmt.Println(task)
		//if !taskExistsInDB(task) {
		//	insertTaskIntoDB(task)
		//}
	}
}

func fetchCalendarData() ([]Task, error) {
	url := os.Getenv("webcallCHEagenda")
	url = strings.Replace(url, "webcal", "https", 1)

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Parseren van ICS-bestand
	calendar, err := ics.ParseCalendar(resp.Body)
	if err != nil {
		return nil, err
	}

	var tasks []Task
	loc, _ := time.LoadLocation("Europe/Amsterdam")
	for _, event := range calendar.Events() {
		start, _ := time.ParseInLocation("20060102T150405", event.GetProperty(ics.ComponentPropertyDtStart).Value, loc)
		end, _ := time.ParseInLocation("20060102T150405", event.GetProperty(ics.ComponentPropertyDtEnd).Value, loc)

		description := start.Format("15:04") + " - " + end.Format("15:04")

		tasks = append(tasks, Task{
			Title:       event.GetProperty(ics.ComponentPropertySummary).Value,
			Description: description,
			Date:        start.Format("2006-01-02"),
		})
	}

	return tasks, nil
}

//func taskExistsInDB(task Task) bool {
//	// Implementeer de logica om te controleren of de taak al in de DB staat
//	// Gebruik bijvoorbeeld een SELECT-query
//}
//
//func insertTaskIntoDB(task Task) {
//	// Implementeer de logica om de taak in de DB te inserten
//	// Gebruik de INSERT-query zoals je eerder deed
//}
