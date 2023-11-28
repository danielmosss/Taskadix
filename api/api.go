package main

import (
	"api/functions"
	"api/handlers"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"time"
)

func main() {
	godotenv.Load()

	functions.ProcessCalanderData()

	ticker := time.NewTicker(12 * time.Hour)
	go func() {
		for range ticker.C {
			functions.ProcessCalanderData()
		}
	}()

	fmt.Println("Starting server on port 8000")

	handler := mux.NewRouter()

	handler.HandleFunc("/GetWeather", handlers.GetWeather).Methods("GET")
	handler.HandleFunc("/GetTodoTasks", handlers.GetTodoTasks).Methods("GET")
	handler.HandleFunc("/PutTodoTasks", handlers.PutTodoTasks).Methods("PUT")
	handler.HandleFunc("/PostTodoTask", handlers.PostTodoTask).Methods("POST")
	handler.HandleFunc("/PutTodoTaskInfo", handlers.PutTodoTaskInfo).Methods("PUT")
	handler.HandleFunc("/DeleteTodoTask", handlers.DeleteTodoTask).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":8000", handler))
}
