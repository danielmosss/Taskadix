package functions

import "net/http"

func GetUserID(req *http.Request) (int, error) {
	var user_id int
	claims, err := GetJWTClaims(req)
	if err != nil {
		return 0, err
	}
	user_id = int(claims["user_id"].(float64))
	return user_id, nil
}
