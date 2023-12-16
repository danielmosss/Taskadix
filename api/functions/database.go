package functions

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func GetDatabaseConnection() (*sql.DB, error) {
	var databaseConnectionString string = os.Getenv("databaseConnectionString")
	db, err := sql.Open("mysql", databaseConnectionString)
	if err != nil {
		fmt.Println(err.Error())
		panic(err.Error())
	}

	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error())
		return nil, err
	}

	return db, nil
}
