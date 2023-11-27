package main

import (
	"api/handlers"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"log"
	"net/http"
)

func main() {
	godotenv.Load()
	fmt.Println("Starting server on port 8000")

	handler := mux.NewRouter()

	handler.HandleFunc("/GetWeather", handlers.GetWeather).Methods("GET")
	handler.HandleFunc("/GetTodoTasks", handlers.GetTodoTasks).Methods("GET")
	handler.HandleFunc("/PutTodoTasks", handlers.PutTodoTasks).Methods("PUT")
	handler.HandleFunc("/PostTodoTask", handlers.PostTodoTask).Methods("POST")

	log.Fatal(http.ListenAndServe(":8000", handler))
}
