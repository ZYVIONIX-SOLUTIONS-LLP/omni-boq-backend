import requests

url = "http://localhost:3001/company-documents"
files = {'file': ('test.txt', 'hello world', 'text/plain')}
data = {'name': 'Test Upload'}

# I need an auth token though...
