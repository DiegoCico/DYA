import sys
import json

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b == 0:
        return 'Cannot divide by zero'
    return a / b

def power(a, b):
    return a ** b

def mod(a, b):
    return a % b

def concat_strings(a, b):
    return a + b

def find_max(a, b):
    return max(a, b)

def is_even(a):
    return a % 2 == 0

def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n-1)

# Example test cases
test_cases = {
    "add": [(1, 2, 3), (5, 5, 10), (-1, 1, 0)],
    "subtract": [(2, 1, 1), (5, 5, 0), (-1, 1, -2)],
    "multiply": [(2, 3, 6), (5, 5, 25), (-1, 1, -1)],
    "divide": [(6, 2, 3), (5, 0, 'Cannot divide by zero'), (-4, 2, -2)],
    "power": [(2, 3, 8), (5, 2, 25), (-1, 2, 1)],
    "mod": [(6, 4, 2), (5, 5, 0), (-1, 1, 0)],
    "concat_strings": [("hello", " world", "hello world"), ("foo", "bar", "foobar"), ("", "", "")],
    "find_max": [(1, 2, 2), (5, 5, 5), (-1, 1, 1)],
    "is_even": [(2, True), (5, False), (0, True)],
    "factorial": [(5, 120), (0, 1), (3, 6)]
}

def run_tests(function_name, user_code):
    # Compile and execute user_code
    exec(user_code)
    user_function = locals()[function_name]
    cases = test_cases[function_name]

    for case in cases:
        input_args = case[:-1]
        expected_output = case[-1]
        result = user_function(*input_args)
        if result != expected_output:
            return False, f"Test failed for inputs {input_args}. Expected {expected_output}, got {result}."
    
    return True, "All tests passed!"

if __name__ == "__main__":
    function_name = sys.argv[1]
    user_code = sys.argv[2]
    success, message = run_tests(function_name, user_code)
    response = {"success": success, "message": message}
    print(json.dumps(response))
