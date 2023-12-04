package handlers

import (
	"api/functions"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
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

	query := "SELECT password FROM users WHERE username = ?;"
	resultPassword, err := dbConnection.Query(query, loginRequest.Username)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resultPassword.Close()

	var hashedPassword string
	for resultPassword.Next() {
		err := resultPassword.Scan(&hashedPassword)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	if CheckHashedPassword(loginRequest.Password, hashedPassword) == false {
		http.Error(res, "Wrong password", http.StatusUnauthorized)
		return
	}

	query2 := "SELECT id FROM users WHERE username = ? AND password = ?;"
	result, err := dbConnection.Query(query2, loginRequest.Username, hashedPassword)
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

func CheckHashedPassword(password, hashedPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
