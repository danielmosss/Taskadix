package functions

import (
	"github.com/dgrijalva/jwt-go"
	"os"
	"time"
)

func CreateToken(userId int) (string, error) {
	secret := os.Getenv("JWT_SECRET")

	claims := jwt.MapClaims{}
	claims["user_id"] = userId
	claims["expire"] = time.Now().Add(time.Hour * 24 * 7).Unix()
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
