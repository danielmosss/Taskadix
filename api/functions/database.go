package functions

import (
	"database/sql"
	"fmt"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

func GetDatabaseConnection() (*sql.DB, error) {
	var databasePassword string = os.Getenv("databasePassword")
	var databasePort string = os.Getenv("databasePort")
	var databaseName string = os.Getenv("databaseName")
	db, err := sql.Open("mysql", "root:"+databasePassword+"@tcp(localhost:"+databasePort+")/"+databaseName+"")
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
