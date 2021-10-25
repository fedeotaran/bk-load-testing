# Load tests for Brandkit App

## Usage

1. Create the `users.json` file with valid data
2. Run the command with the HOSTNAME env for the test file:

```
HOSTNAME=clustered-app.fly.dev k6 run test_list_assets.js
```
