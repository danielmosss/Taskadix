package functions

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"os"
)

func GetDatabaseConnection() (*sql.DB, error) {
	var databasePassword string = os.Getenv("databasePassword")
	db, err := sql.Open("mysql", "root:"+databasePassword+"@tcp(localhost:3307)/tododashboard")
	if err != nil {
		fmt.Println(err.Error())
		panic(err.Error())
	}

	err = db.Ping()
	if err != nil {
		fmt.Println(err.Error()) // You can log the error instead of just printing it
		return nil, err
	}

	return db, nil
}
