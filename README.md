# Deliverect integration
## Stack description
Server = `express` <br>
Http requests to deliverect = `undici` <br>
Token repository = `prisma` + `sqlite` (could be implemented with any type of repository that implements propper interface. e.g. s3, filesystem, redis based)
## Project sertup
- Install dependencies
```bash
yarn
```
- Generate `.env` file (if using Windows, just create .env file and copy all content of .env.example in it)
```bash
yarn init:env
```
- Configure `.env` (More info about it below)
- Migrate db and generate prisma client
```bash
yarn prisma:migrate
```
- Start mock deliverect server (optional. More info about it in section below)
```bash
yarn start:mock-deliverect
```
- Start application server
```bash
yarn start
```

## Mock Deliverect server
Mock deliverect server implements deliverect endpoints <br>
GET /accounts <br>
POST /oauth/token <br>
It is useful for testing if you don`t have Deliverect api keys. 
It stores just one token and uses configured in .env file client_id and client_secret to validate authentication request. <br>

## `.env` Configuration
### `DELIVERECT_API_HOST` 
If you want to use real Deliverect server, please paste its api host here e.g. `https://api.staging.deliverect.com` <br>
If you want to use mocked server please paste it's host e.g. `http://localhost:3001`
### `DELIVERECT_CLIENT_ID` and `DELIVERECT_CLIENT_SECRET`
Please paste your client secret and client id if you want to use real Deliverect server. <br>
In case you need mock server, any values can be used. Both servers will use these values.

## App server endpoints
`GET /accounts` returns response from deliverect server