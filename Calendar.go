package main

import (
	"fmt"
	"time"
)

func main() {
	fmt.Print("Enter year: ")
	var year int
	fmt.Scan(&year)

	fmt.Print("Enter month (1-12): ")
	var month int
	_, err := fmt.Scan(&month)

	if err != nil || month < 1 || month > 12 {
		fmt.Println("Invalid month. Please enter a value between 1 and 12.")
		return
	}

	fmt.Print("Enter start day (0-6, where 0 is Sunday): ")
	var startDay int
	fmt.Scan(&startDay)

	t := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.Local)

	fmt.Println("Calendar for", t.Month(), t.Year())
	fmt.Println("Sun Mon Tue Wed Thu Fri Sat")

	daysInMonth := time.Date(year, time.Month(month+1), 0, 0, 0, 0, 0, time.Local).Day()

	weekday := (t.Weekday() + time.Weekday(startDay)) % 7

	currentDay := time.Now().Day()

	// Print leading spaces
	for i := 0; i < int(weekday); i++ {
		fmt.Print("    ")
	}

	// Print calendar days
	for day := 1; day <= daysInMonth; day++ {
		if day == currentDay {
			fmt.Printf("\033[1;31m%3d\033[0m ", day) // Highlight current day in red
		} else if weekday == 0 || weekday == 6 {
			fmt.Printf("\033[1;34m%3d\033[0m ", day) // Highlight weekends in blue
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
