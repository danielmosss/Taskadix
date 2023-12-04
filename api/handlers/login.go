package handlers

import "net/http"

func Login(res http.ResponseWriter, req *http.Request) {
	res.Write([]byte("Login"))
}
