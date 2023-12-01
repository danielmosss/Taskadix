# Navigate to angular/src and start ng serve on a new PowerShell terminal
Start-Process PowerShell -ArgumentList "-NoExit", "-Command cd angular/src; ng serve --port 61961"

# Navigate to the /api directory
cd api

# Check if api.exe exists and delete if it does
if (Test-Path "api.exe") {
    Remove-Item "api.exe"
}

# Build the API using Go
go build api

# Run the newly created api.exe
Start-Process "./api.exe"

# Close the current PowerShell terminal
exit
