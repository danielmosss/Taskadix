package handlers

import (
	"fmt"
	"net/http"
)

func PostTodoTask(res http.ResponseWriter, req *http.Request) {
	fmt.Println("PostTodoTask called")
}
