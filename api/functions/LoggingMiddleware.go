package functions

import (
	"fmt"
	"net/http"
)

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(res http.ResponseWriter, req *http.Request) {
		fmt.Println("Logging: " + req.URL.Path + ": " + req.Method + "() called!")
		next.ServeHTTP(res, req)
	})
}
