package main

import (
	"fmt"
	"time"
)

func main() {
	// Prompt the user to enter the year
	fmt.Print("Enter year: ")
	var year int
	fmt.Scan(&year)

	// Prompt the user to enter the month
	fmt.Print("Enter month (1-12): ")
	var month int
	_, err := fmt.Scan(&month)

	// Validate the entered month
	if err != nil || month < 1 || month > 12 {
		fmt.Println("Invalid month. Please enter a value between 1 and 12.")
		return
	}

	// Prompt the user to enter the start day
	fmt.Print("Enter start day (0-6, where 0 is Sunday): ")
	var startDay int
	fmt.Scan(&startDay)

	// Create a time object for the first day of the specified month and year
	t := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.Local)

	// Print the header for the calendar
	fmt.Println("Calendar for", t.Month(), t.Year())
	fmt.Println("Sun Mon Tue Wed Thu Fri Sat")

	// Calculate the number of days in the specified month
	daysInMonth := time.Date(year, time.Month(month+1), 0, 0, 0, 0, 0, time.Local).Day()

	// Calculate the weekday of the first day in the month
	weekday := (t.Weekday() + time.Weekday(startDay)) % 7

	currentDay := time.Now().Day()

	// Print leading spaces
	for i := 0; i < int(weekday); i++ {
		fmt.Print("    ")
	}

	// Print calendar days
	for day := 1; day <= daysInMonth; day++ {
		// Highlight the current day in red
		if day == currentDay {
			fmt.Printf("\033[1;31m%3d\033[0m ", day)
		} else if weekday == 0 || weekday == 6 {
			// Highlight weekends in blue
			fmt.Printf("\033[1;34m%3d\033[0m ", day)
		} else {
			fmt.Printf("%3d ", day)
		}
		weekday = (weekday + 1) % 7
		if weekday == 0 {
			fmt.Println()
		}
	}

	fmt.Println()
}
