# Deployment

## Frontend
In a terminal with docker installed run the following commands

`docker build -t gateways-frontend .`

`docker run -p 3000:3000 gateways-frontend serve -s build`


# Development and testing

## Frontend

### Install dependencies
`yarn`

### Run development server
`yarn start`

The browser should open automatically at http://localhost:3000
