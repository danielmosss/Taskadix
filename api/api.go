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

	handler.HandleFunc("/login", handlers.Login).Methods("POST")

	securedRoutes := handler.PathPrefix("/api").Subrouter()
	securedRoutes.Use(functions.TokenVerifyMiddleware)

	securedRoutes.HandleFunc("/GetWeather", handlers.GetWeather).Methods("GET")
	securedRoutes.HandleFunc("/GetTodoTasks", handlers.GetTodoTasks).Methods("GET")
	securedRoutes.HandleFunc("/PutTodoTasks", handlers.PutTodoTasks).Methods("PUT")
	securedRoutes.HandleFunc("/PostTodoTask", handlers.PostTodoTask).Methods("POST")
	securedRoutes.HandleFunc("/PutTodoTaskInfo", handlers.PutTodoTaskInfo).Methods("PUT")
	securedRoutes.HandleFunc("/DeleteTodoTask", handlers.DeleteTodoTask).Methods("DELETE")
	securedRoutes.HandleFunc("/PostMarkAsIrrelevant", handlers.PostMarkAsIrrelevant).Methods("POST")
	securedRoutes.HandleFunc("/GetTodoTasksByDateRange", handlers.GetTodoByDateRange).Methods("GET")
	securedRoutes.HandleFunc("/GetUserData", handlers.GetUserData).Methods("GET")

	log.Fatal(http.ListenAndServe(":8000", handler))
}
