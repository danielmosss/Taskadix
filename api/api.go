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
	fmt.Println("Starting server on port 8080")

	handler := mux.NewRouter()

	handler.HandleFunc("/weather", handlers.GetWeather).Methods("GET")

	log.Fatal(http.ListenAndServe(":8000", handler))
}
