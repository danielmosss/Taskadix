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
	Id  int    `json:"id"`
}

type LoginResponse struct {
	JsonWebToken string `json:"jsonwebtoken"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type ICS_import struct {
	Id              int    `json:"id"`
	IcsUrl          string `json:"ics_url"`
	IcsLastSyncedAt string `json:"ics_last_synced_at"`
}

type UserData struct {
	Username    string       `json:"username"`
	Email       string       `json:"email"`
	ICS_imports []ICS_import `json:"ics_imports"`
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
	IsWebCall   bool     `json:"iswebcall"`
}

type ResponseAppointment struct {
	Date         string        `json:"date"`
	Appointments []Appointment `json:"appointments"`
}

type BackupTemplate struct {
	UserId       int           `json:"userid"`
	Username     string        `json:"username"`
	Email        string        `json:"email"`
	TimeCreated  string        `json:"timeCreated"`
	TemplateV    int           `json:"templateV"`
	Todos        []TodoCard    `json:"todos"`
	Appointments []Appointment `json:"appointments"`
	Categories   []Category    `json:"categories"`
}
