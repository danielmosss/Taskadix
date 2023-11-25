package functions

import "time"

func GetTodayDate() string {
	todayDate := time.Now().Format(time.DateOnly)
	return todayDate
}
