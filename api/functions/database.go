package functions

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func GetDatabaseConnection() (*sql.DB, error) {
	// Establish database connection and return it to be used in the handlers.
	var databaseConnectionString string = os.Getenv("databaseConnectionString")
	db, err := sql.Open("mysql", databaseConnectionString)
	if err != nil {
		fmt.Println(err.Error())
		panic(err.Error())
	}

	// Check if the database is still alive.
	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	return db, nil
}
