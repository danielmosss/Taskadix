package POST

import (
	"api/functions"
	"api/handlers"
	"encoding/json"
	"golang.org/x/crypto/bcrypt"
	"io/ioutil"
	"net/http"
)

func Login(res http.ResponseWriter, req *http.Request) {
	body, err := ioutil.ReadAll(req.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	var loginRequest handlers.LoginRequest
	if err := json.Unmarshal(body, &loginRequest); err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	dbConnection, err := functions.GetDatabaseConnection()
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	// Query the database for the hashed password of the given username
	query := "SELECT password FROM users WHERE username = ?;"
	resultPassword, err := dbConnection.Query(query, loginRequest.Username)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer resultPassword.Close()

	// Retrieve the hashed password from the query result
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

	// Generate a JWT token for the user
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

func CheckHashedPassword(password, hashedPassword string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
