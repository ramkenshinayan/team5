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
	fmt.Scan(&month)

	t := time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.Local)

	fmt.Println("Calendar for", t.Month(), t.Year())
	fmt.Println("Sun Mon Tue Wed Thu Fri Sat")

	daysInMonth := time.Date(year, time.Month(month+1), 0, 0, 0, 0, 0, time.Local).Day()

	weekday := t.Weekday()

	// Print leading spaces
	for i := 0; i < int(weekday); i++ {
		fmt.Print("    ")
	}

	for day := 1; day <= daysInMonth; day++ {
		fmt.Printf("%3d ", day)
		weekday = (weekday + 1) % 7
		if weekday == 0 {
			fmt.Println()
		}
	}

	fmt.Println()
}
