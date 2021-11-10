# Password Storage, Manager and Generator

A web app that safely stores encrypted username-password combinations in a database.

Plain text passwords don’t leave the browser, and only the client has the encryption/decryption algorithm.

Passwords are encrypted and decrypted using AES and a salt that is randomly generated when the user registers on the app.

The app can also generate passwords based on user-configurable parameters and symmetric/asymmetric keys

