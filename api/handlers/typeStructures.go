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

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type backgroundColor struct {
	BackgroundColor string `json:"backgroundColor"`
}

type url struct {
	Url string `json:"url"`
}

type LoginResponse struct {
	JsonWebToken string `json:"jsonwebtoken"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type userData struct {
	Username          string `json:"username"`
	Email             string `json:"email"`
	Webcallurl        string `json:"webcallurl"`
	Webcalllastsynced string `json:"webcalllastsynced"`
	BackgroundColor   string `json:"backgroundcolor"`
}

type dateRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
}
