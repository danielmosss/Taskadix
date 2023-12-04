package handlers

import (
	"api/functions"
	"encoding/json"
	"io/ioutil"
	"net/http"
)

type LoginResponse struct {
	JsonWebToken string `json:"jsonwebtoken"`
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

func Login(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var loginRequest LoginRequest
	if err := json.Unmarshal(body, &loginRequest); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	query := "SELECT id FROM users WHERE username = ? AND password = ?;"
	result, err := dbConnection.Query(query, loginRequest.Username, loginRequest.Password)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer result.Close()
	defer dbConnection.Close()

	var id int
	for result.Next() {
		err := result.Scan(&id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if id == 0 {
		http.Error(res, "User not found", http.StatusNotFound)
		return
	}

	jwtToken, err := functions.CreateToken(id)
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
