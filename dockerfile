# Use an official Node.js runtime as the base image
FROM node

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY . .

# Expose a port (if your Node.js app listens on a specific port)
EXPOSE 3000

# Define the command to run your Node.js app
CMD [ "node", "server.js" ]