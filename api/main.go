package main

import (
	"api/functions"
	"api/handlers/DELETE"
	"api/handlers/GET"
	"api/handlers/POST"
	"api/handlers/PUT"
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

	var ngrokAddres = os.Getenv("ngrokRequest")
	corsObj := handlers2.CORS(
		handlers2.AllowedOrigins([]string{"https://todo.mosselmansoftware.nl", ngrokAddres}),
		handlers2.AllowedMethods([]string{"GET", "POST", "PUT", "OPTIONS", "DELETE"}),
		handlers2.AllowedHeaders([]string{"Content-Type", "X-Requested-With", "Authorization", "Ngrok-Skip-Browser-Warning"}),
	)
	log.Fatal(http.ListenAndServe(":8000", corsObj(handler)))
}
