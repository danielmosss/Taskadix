package POST

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"io/ioutil"
	"net/http"
)

func Register(res http.ResponseWriter, req *http.Request) {
	// I don't want people to register at this moment, so I'm returning an error.
	http.Error(res, "Register is not available", http.StatusGone)
	return

	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var registerRequest handlers.RegisterRequest
	if err := json.Unmarshal(body, &registerRequest); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	hashedPassword, err := CreateHashedPassword(registerRequest.Password)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	query := "INSERT INTO users (username, password, email) VALUES (?, ?, ?);"
	rest, err := dbConnection.Query(query, registerRequest.Username, hashedPassword, registerRequest.Email)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rest.Close()

	query2 := "SELECT id FROM users WHERE username = ? AND email = ?;"
	result, err := dbConnection.Query(query2, registerRequest.Username, registerRequest.Email)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var id int
	for result.Next() {
		err := result.Scan(&id)
		if err != nil {
			http.Error(res, err.Error(), http.StatusInternalServerError)
			return
		}
	}

	defer result.Close()
	defer dbConnection.Close()

	if id == 0 {
		http.Error(res, "User not found", http.StatusNotFound)
		return
	}

	jwtToken, err := functions.CreateToken(id)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	returnToken := handlers.LoginResponse{JsonWebToken: jwtToken}

	tokenInJson, err := json.Marshal(returnToken)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	res.Header().Set("Content-Type", "application/json")
	res.Write(tokenInJson)
}

// Create hashed password from the string that user inputted.
func CreateHashedPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}
