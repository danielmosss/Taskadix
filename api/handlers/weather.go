package handlers

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func GetWeather(res http.ResponseWriter, req *http.Request) {
	// logging
	fmt.Println("GetWeather called")
	res.Header().Set("Content-Type", "application/json")

	weatherRes, err := http.Get("https://api.weatherapi.com/v1/current.json?key=5ce8b442e18b4b568fd135838232002&q=barneveld&aqi=no")
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer weatherRes.Body.Close()

	data, err := ioutil.ReadAll(weatherRes.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	// return the json data
	res.Write(data)
}
