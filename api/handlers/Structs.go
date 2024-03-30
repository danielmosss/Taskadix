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
}

type DateRange struct {
	Start string `json:"start"`
	End   string `json:"end"`
}

type Category struct {
	ID        int    `json:"id"`
	Term      string `json:"term"`
	Color     string `json:"color"`
	UserId    int    `json:"userid"`
	IsDefault bool   `json:"isdefault"`
}

type NewAppointment struct {
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Date        string   `json:"date"`
	IsAllDay    bool     `json:"isAllDay"`
	StartTime   string   `json:"starttime"`
	EndTime     string   `json:"endtime"`
	Location    string   `json:"location"`
	Category    Category `json:"category"`
}

type Appointment struct {
	Id          int      `json:"id"`
	Userid      int      `json:"userid"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Date        string   `json:"date"`
	IsAllDay    bool     `json:"isAllDay"`
	StartTime   string   `json:"starttime"`
	EndTime     string   `json:"endtime"`
	Location    string   `json:"location"`
	Category    Category `json:"category"`
}
