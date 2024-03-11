package handlers

type TodoCard struct {
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
	Tasks []TodoCard `json:"tasks"`
}

type NewTask struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Date        string `json:"date"`
}

type RegisterRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type BackgroundColor struct {
	BackgroundColor string `json:"backgroundColor"`
}

type Url struct {
	Url string `json:"url"`
}

type LoginResponse struct {
	JsonWebToken string `json:"jsonwebtoken"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type UserData struct {
	Username          string `json:"username"`
	Email             string `json:"email"`
	Webcallurl        string `json:"webcallurl"`
	Webcalllastsynced string `json:"webcalllastsynced"`
	BackgroundColor   string `json:"backgroundcolor"`
}

type DateRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
}
