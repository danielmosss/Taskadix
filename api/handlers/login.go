package handlers

import (
	"api/functions"
	"encoding/json"
	"net/http"
)

type LoginResponse struct {
	JsonWebToken string `json:"jsonwebtoken"`
}

func Login(res http.ResponseWriter, req *http.Request) {
	
	jwtToken, err := functions.CreateToken(1)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	returnToken := LoginResponse{JsonWebToken: jwtToken}

	tokenInJson, err := json.Marshal(returnToken)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	res.Header().Set("Content-Type", "application/json")
	res.Write(tokenInJson)
}
