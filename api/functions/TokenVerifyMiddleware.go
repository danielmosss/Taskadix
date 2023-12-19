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
		bearerAuthToken := strings.Split(authHeader, " ")

		if len(bearerAuthToken) == 2 {
			token, error := jwt.Parse(bearerAuthToken[1], func(token *jwt.Token) (interface{}, error) {
				if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
					return nil, fmt.Errorf("Something went wrong")
				}

				return []byte(os.Getenv("JWT_SECRET")), nil
			})

			if error != nil {
				fmt.Println(error.Error())
				http.Error(w, "Invalid token", http.StatusForbidden)
				return
			}

			if token.Valid {
				// check is user is still in database. might be deleted
				dbConnection, err := GetDatabaseConnection()
				if err != nil {
					//fmt.Println(err.Error())
					http.Error(w, "Database Connection Error", http.StatusInternalServerError)
					return
				}

				query := "SELECT id FROM users WHERE id = ?;"
				result, err := dbConnection.Query(query, token.Claims.(jwt.MapClaims)["user_id"])
				if err != nil {
					///fmt.Println(err.Error())
					http.Error(w, "Database Query Execution Error", http.StatusInternalServerError)
					return
				}

				defer result.Close()
				defer dbConnection.Close()

				var id int
				for result.Next() {
					err := result.Scan(&id)
					if err != nil {
						//fmt.Println(err.Error())
						http.Error(w, "Database Query Result Error", http.StatusInternalServerError)
						return
					}
				}

				if id == 0 {
					http.Error(w, "User not found", http.StatusForbidden)
					return
				}

				next.ServeHTTP(w, r)
			} else {
				http.Error(w, "Invalid Token", http.StatusForbidden)
			}
		} else {
			http.Error(w, "Invalid Token", http.StatusForbidden)
		}
	})
}
