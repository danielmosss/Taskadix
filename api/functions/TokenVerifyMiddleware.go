package functions

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"os"
	"strings"
)

func TokenVerifyMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		bearerToken := strings.Split(authHeader, " ")

		if len(bearerToken) == 2 {
			token, error := jwt.Parse(bearerToken[1], func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Something went wrong")
				}

				return []byte(os.Getenv("JWT_SECRET")), nil
			})

			if error != nil {
				http.Error(w, error.Error(), http.StatusForbidden)
				return
			}

			if token.Valid {
				next.ServeHTTP(w, r)
			} else {
				http.Error(w, "Invalid Token", http.StatusUnauthorized)
			}
		} else {
			http.Error(w, "Invalid Tokenformat", http.StatusUnauthorized)
		}
	})
}
