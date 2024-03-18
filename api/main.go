package main

import (
	"api/functions"
	"api/handlers/DELETE"
	"api/handlers/GET"
	"api/handlers/POST"
	"api/handlers/PUT"
	"api/handlersv2"
	"fmt"
	"log"
	"net/http"
	"os"

	handlers2 "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load()

	fmt.Println("Starting server on port 8000")

	handler := mux.NewRouter()

	// log every request that comes in with middleware.
	handler.Use(functions.LoggingMiddleware)

	handler.HandleFunc("/login", POST.Login).Methods("POST")
	handler.HandleFunc("/register", POST.Register).Methods("POST")

	securedRoutes := handler.PathPrefix("/api").Subrouter()
	securedRoutes.Use(functions.TokenVerifyMiddleware)

	securedRoutes.HandleFunc("/GetWeather", GET.GetWeather).Methods("GET")
	securedRoutes.HandleFunc("/GetTodoTasks", GET.GetTodoTasks).Methods("GET")
	securedRoutes.HandleFunc("/PutTodoTasks", PUT.PutTodoTasks).Methods("PUT")
	securedRoutes.HandleFunc("/PostTodoTask", POST.PostTodoTask).Methods("POST")
	securedRoutes.HandleFunc("/PutTodoTaskInfo", PUT.PutTodoTaskInfo).Methods("PUT")
	securedRoutes.HandleFunc("/DeleteTodoTask", DELETE.DeleteTodoTask).Methods("DELETE")
	securedRoutes.HandleFunc("/PostMarkAsIrrelevant", POST.PostMarkAsIrrelevant).Methods("POST")
	securedRoutes.HandleFunc("/GetTodoTasksByDateRange", GET.GetTodoByDateRange).Methods("GET")
	securedRoutes.HandleFunc("/GetUserData", GET.GetUserData).Methods("GET")
	securedRoutes.HandleFunc("/UploadBulkTodo", POST.UploadBulkTodo).Methods("POST")
	securedRoutes.HandleFunc("/PostCheckTodoTask", POST.PostCheckTodoTask).Methods("POST")
	securedRoutes.HandleFunc("/PostWebcallUrl", POST.PostWebcallUrl).Methods("POST")
	securedRoutes.HandleFunc("/GetWebcallSync", GET.GetWebcallSync).Methods("GET")
	securedRoutes.HandleFunc("/PutBGcolor", PUT.PutBGcolor).Methods("PUT")

	securedRoutes.HandleFunc("/v2/GetCategories", handlersv2.GetCategories).Methods("GET")
	securedRoutes.HandleFunc("/v2/CreateAppointment", handlersv2.CreateAppointment).Methods("POST")
	securedRoutes.HandleFunc("/v2/GetMonthAppointments", handlersv2.GetMonthAppointments).Methods("GET")

	var ngrokAddres = os.Getenv("ngrokRequest")
	corsObj := handlers2.CORS(
		handlers2.AllowedOrigins([]string{"https://todo.mosselmansoftware.nl", ngrokAddres}),
		handlers2.AllowedMethods([]string{"GET", "POST", "PUT", "OPTIONS", "DELETE"}),
		handlers2.AllowedHeaders([]string{"Content-Type", "X-Requested-With", "Authorization", "Ngrok-Skip-Browser-Warning"}),
	)
	log.Fatal(http.ListenAndServe(":8000", corsObj(handler)))
}
