package handlers

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
)

func GetWeather(res http.ResponseWriter, req *http.Request) {
	fmt.Println("GetWeather called")
	var weatherapikey string = os.Getenv("weatherApiKey")

	weatherRes, err := http.Get("https://api.weatherapi.com/v1/forecast.json?key=" + weatherapikey + "&q=barneveld&days=1&aqi=no&alerts=no")
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}
	defer weatherRes.Body.Close()

	if weatherRes.StatusCode != http.StatusOK {
		http.Error(res, weatherRes.Status, weatherRes.StatusCode)
		return
	}

	data, err := ioutil.ReadAll(weatherRes.Body)
	if err != nil {
		http.Error(res, err.Error(), http.StatusInternalServerError)
		return
	}

	res.Header().Set("Content-Type", "application/json")
	res.Write(data)
}
