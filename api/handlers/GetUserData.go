package handlers

import (
	"api/functions"
	"fmt"
	"net/http"
)

func GetUserData(res http.ResponseWriter, req *http.Request) {
	claims, err := functions.GetJWTClaims(req)
	if err != nil {
		http.Error(res, err.Error(), http.StatusUnauthorized)
		return
	}
	fmt.Println(claims)
}
