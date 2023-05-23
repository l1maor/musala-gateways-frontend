# Use Node.js v18.14.0 as the base image
FROM node:18.14.0

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install the app's dependencies in the container using Yarn
RUN yarn install

# Copy the rest of the app's files to the container
COPY . .

# Build the app for production using Yarn
RUN yarn build
RUN yarn global add serve
EXPOSE 3000
CMD ["serve", "-s", "build"]
# Use an Nginx image to serve the built app
# FROM nginx:stable-alpine

# Copy the built app files to the Nginx container
# COPY --from=0 /app/build /usr/share/nginx/html

# Expose port 80 for the app

