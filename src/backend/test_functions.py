# test_functions.py
import sys
import json

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
    # Execute user code to define the function
    exec(user_code, globals())

    # Retrieve the function defined in the user code
    user_function = globals().get(function_name)
    if not user_function:
        return False, f"Function {function_name} not found in user code."
    
    # Retrieve test cases for the function
    cases = test_cases.get(function_name)
    if not cases:
        return False, f"No test cases found for function {function_name}."

    # Run the tests and collect results
    results = []
    all_passed = True
    for case in cases:
        input_args = case[:-1]
        expected_output = case[-1]
        try:
            result = user_function(*input_args)
            if result == expected_output:
                results.append({"passed": True, "message": f"Test passed for inputs {input_args}. Expected and got {expected_output}.", "inputs": input_args, "expected": expected_output, "actual": result})
            else:
                all_passed = False
                results.append({"passed": False, "message": f"Test failed for inputs {input_args}. Expected {expected_output}, got {result}.", "inputs": input_args, "expected": expected_output, "actual": result})
        except Exception as e:
            all_passed = False
            results.append({"passed": False, "message": f"Test raised an exception for inputs {input_args}: {str(e)}", "inputs": input_args, "expected": expected_output, "actual": None})
    
    return all_passed, results

if __name__ == "__main__":
    # Get the function name and user code from the command-line arguments
    function_name = sys.argv[1]
    user_code = sys.argv[2]
    
    # Run the tests and get the result
    success, message = run_tests(function_name, user_code)
    
    # Create the response and print it as JSON
    response = {"success": success, "testResults": message}
    print(json.dumps(response))
