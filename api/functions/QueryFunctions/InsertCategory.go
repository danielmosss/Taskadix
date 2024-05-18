package QueryFunctions

import (
	"api/functions"
)

func InsertCategory(term string, color string, userId int) (lastInsertedId int64, error error) {
	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		return 0, err
	}

	query := "INSERT INTO appointment_category (term, color, userid) VALUES (?, ?, ?);"
	res, err := dbConnection.Exec(query, term, color, userId)
	if err != nil {
		return 0, err
	}

	lastInsertedId, err = res.LastInsertId()
	if err != nil {
		return 0, err
	}
	return lastInsertedId, nil
}
