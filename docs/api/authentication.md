# Authentication

To access the Modulator API, you must authenticate your requests using a token-based authentication system. This ensures that only authorized users can interact with the API.

## Obtaining an API Token

1. Register for an account on the Modulator platform.
2. Navigate to the API settings page.
3. Generate a new API token.

## Using the API Token

Include the API token in the `Authorization` header of your HTTP requests:

```
Authorization: Bearer YOUR_API_TOKEN
```

Ensure that your token is kept secure and not exposed in client-side code.
