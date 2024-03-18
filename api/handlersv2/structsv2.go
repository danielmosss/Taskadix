package handlersv2

type Category struct {
	ID   int    `json:"id"`
	Term string `json:"term"`
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
