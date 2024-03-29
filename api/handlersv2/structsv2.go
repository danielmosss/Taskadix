package handlersv2

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
