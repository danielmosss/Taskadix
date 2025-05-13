package functions

import (
	"github.com/golang-jwt/jwt/v5"
	"os"
	"time"
)

func CreateToken(userId int) (string, error) {
	// Create a JWT token with the user id and an expiration date of 7 days.
	secret := os.Getenv("JWT_SECRET")

	claims := jwt.MapClaims{}
	claims["user_id"] = userId
	claims["expire"] = time.Now().Add(time.Hour * 24 * 7).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
