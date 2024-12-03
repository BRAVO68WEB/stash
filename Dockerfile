FROM oven/bun:latest

WORKDIR /app

# Create uploads directory
RUN mkdir -p uploads && chmod 777 uploads

# Copy package.json and install dependencies
COPY package.json .
RUN bun install

# Copy source code
COPY . .

# Build the project
RUN bun build ./index.ts --compile --outfile=stash 

# Expose the default port
EXPOSE 9988

# Run the server
CMD ["./stash"]