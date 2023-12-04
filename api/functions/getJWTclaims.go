package functions

import (
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"os"
	"strings"
)

// ExtractClaims haalt de JWT-claims uit de gegeven HTTP-request
func GetJWTClaims(r *http.Request) (jwt.MapClaims, error) {
	authHeader := r.Header.Get("Authorization")
	bearerToken := strings.Split(authHeader, " ")

	if len(bearerToken) != 2 {
		return nil, fmt.Errorf("Ongeldige of ontbrekende Authorization header")
	}

	tokenString := bearerToken[1]
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Onverwachte ondertekeningsmethode: %v", token.Header["alg"])
		}

		// Dezelfde geheime sleutel gebruiken als tijdens het aanmaken van de token
		return []byte(os.Getenv("JWT_SECRET")), nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	} else {
		return nil, fmt.Errorf("Ongeldig token")
	}
}
