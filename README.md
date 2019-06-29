# CARL API

Backend API Framework for CARL Mobile Application
| RESTify, Socket.io, Custom Console Logger, CORS

## Demo

Open the file `carl.html` under the `/public` directory in a browser

## Installation

- Clone this repo with `git clone [GIT_REPO]`

- `cd` into the cloned directory and run `npm i` to install npm modules

- Run the development server using `npm run serve` and the hot development server using `npm run serve-hot`

## Usage

- Set the HTTP Authorization Header to `Bearer [TOKEN]`
| Note: Token can be found under AUTH_KEY env variable in the `.env` file

- Send Temperature and Heart Rate Values to the endpoint:
`/api/carl?temperature=[TEMPERATURE]&heart_rate=[HEART_RATE]`

- Create a Socket connection on the client-side like below:
| Note: The TOKEN below can be found under the SOCKET_KEY in the '.env' file

```javascript
var socket = io('http://localhost:5555/carl?token=[TOKEN]');
socket.on('connect', () => {
    socket.on('carl-data', (data) => {
        // Do some stuff with the data when received
        // You can access 'temperature' using data.temperature
        // You can access 'heartRate' using data.heartRate
    });
});
```

## Authors/Contributors

Dare McAdewole
Contact me via [Gmail](mailto://dare.dev.adewole@gmail.com)
