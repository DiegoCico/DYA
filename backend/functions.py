# functions.py

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
    if b == 0:
        return 'Cannot divide by zero'
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
    return n * factorial(n - 1)
