package handlers

type todoCard struct {
	Id          int    `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Date        string `json:"date"`
	TodoOrder   int    `json:"todoOrder"`
	Checked     bool   `json:"checked"`
	IsCHE       bool   `json:"IsCHE"`
}

type DayTodos struct {
	Day   string     `json:"day"`
	Date  string     `json:"date"`
	Tasks []todoCard `json:"tasks"`
}

type newTask struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Date        string `json:"date"`
}
