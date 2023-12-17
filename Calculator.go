package main

import (
	"bufio"
	"fmt"
	"os"
	"strconv"
	"strings"
)

func main() {
	reader := bufio.NewReader(os.Stdin)

	for {
		fmt.Print("Test")
		fmt.Print("Enter an expression (e.g., 5 + 3) or 'exit' to quit: ")
		input, _ := reader.ReadString('\n')
		input = strings.TrimSpace(input)

		if input == "exit" {
			break
		}

		parts := strings.Fields(input)
		if len(parts) != 3 {
			fmt.Println("Invalid input. Please enter an expression like '5 + 3'.")
			continue
		}

		num1, err1 := strconv.ParseFloat(parts[0], 64)
		operator := parts[1]
		num2, err2 := strconv.ParseFloat(parts[2], 64)

		if err1 != nil || err2 != nil {
			fmt.Println("Invalid numbers. Please enter valid numbers.")
			continue
		}

		result, err := calculate(num1, operator, num2)
		if err != nil {
			fmt.Println("Invalid operator. Supported operators are +, -, *, and /")
		} else {
			fmt.Printf("Result: %.2f\n", result)
		}
	}
}

func calculate(num1 float64, operator string, num2 float64) (float64, error) {
	switch operator {
	case "+":
		return num1 + num2, nil
	case "-":
		return num1 - num2, nil
	case "*":
		return num1 * num2, nil
	case "/":
		if num2 == 0 {
			return 0, fmt.Errorf("Division by zero is not allowed")
		}
		return num1 / num2, nil
	default:
		return 0, fmt.Errorf("Invalid operator")
	}
}
