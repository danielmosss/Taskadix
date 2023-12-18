package main

import (
	"api/functions"
	"api/handlers"
	"fmt"
	handlers2 "github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"net/http"
	"time"
)

func main() {
	godotenv.Load()

	//port := os.Getenv("PORT")
	//if port == "8080" {
	//	rootCertPool := x509.NewCertPool()
	//	// file is in the current directory with name DigiCertGlobalRootCA.crt.pem
	//	pem, err := ioutil.ReadFile("/home/site/wwwroot/DigiCertGlobalRootCA.crt.pem")
	//	if err != nil {
	//		log.Fatalf("Failed to read the SSL certificate file: %v", err)
	//	}
	//	if ok := rootCertPool.AppendCertsFromPEM(pem); !ok {
	//		log.Fatal("Failed to append PEM.")
	//	}
	//
	//	// Configure TLS
	//	mysql.RegisterTLSConfig("custom", &tls.Config{
	//		RootCAs: rootCertPool,
	//	})
	//
	//	port = ":443"
	//} else {
	//	port = ":8000"
	//}

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
	handler.HandleFunc("/register", handlers.Register).Methods("POST")

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

	//log.Fatal(http.ListenAndServe(":8000", handler))

	corsObj := handlers2.CORS(
		handlers2.AllowedOrigins([]string{"https://todo.mosselmansoftware.nl", "https://30e2-137-117-175-76.ngrok-free.app"}),
		handlers2.AllowedMethods([]string{"GET", "POST", "PUT", "OPTIONS", "DELETE"}),
		handlers2.AllowedHeaders([]string{"Content-Type", "X-Requested-With", "Authorization", "Ngrok-Skip-Browser-Warning"}),
	)
	http.ListenAndServe(":8000", corsObj(handler))
}
