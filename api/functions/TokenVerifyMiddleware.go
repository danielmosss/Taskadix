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
		fmt.Println(authHeader)
		bearerToken := strings.Split(authHeader, " ")
		fmt.Println(bearerToken)

		if len(bearerToken) == 2 {
			token, error := jwt.Parse(bearerToken[1], func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Er was een fout")
				}
				// Gebruik dezelfde geheime sleutel als die je gebruikte om de token te maken
				return []byte(os.Getenv("JWT_SECRET")), nil
			})

			if error != nil {
				http.Error(w, error.Error(), http.StatusForbidden)
				return
			}

			if token.Valid {
				next.ServeHTTP(w, r)
			} else {
				http.Error(w, "Ongeldig token", http.StatusUnauthorized)
			}
		} else {
			http.Error(w, "Ongeldige tokenformat", http.StatusUnauthorized)
		}
	})
}
