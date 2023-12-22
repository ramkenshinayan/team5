package main

import (
	"fmt"
	"time"
)

func main() {
	// Prompt user for input
	fmt.Print("Enter year: ")
	var year int
	fmt.Scan(&year)

	fmt.Print("Enter month (1-12): ")
	var month int
	fmt.Scan(&month)

	// Create a time object for the specified year and month
	t := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.Local)

	// Print the calendar
	fmt.Println("Calendar for", t.Month(), t.Year())
	fmt.Println("Sun Mon Tue Wed Thu Fri Sat")

	// Calculate the number of days in the month
	daysInMonth := time.Date(year, time.Month(month+1), 0, 0, 0, 0, 0, time.Local).Day()

	// Determine the day of the week for the first day of the month
	weekday := t.Weekday()

	// Print leading spaces
	for i := 0; i < int(weekday); i++ {
		fmt.Print("    ")
	}

	// Print days of the month
	for day := 1; day <= daysInMonth; day++ {
		fmt.Printf("%3d ", day)
		weekday = (weekday + 1) % 7
		if weekday == 0 {
			fmt.Println() // Start a new line for the next week
		}
	}

	fmt.Println() // Add a newline at the end
}
