FROM node:20 AS base

# Create app directory
WORKDIR /prof_bot

# Files required by npm install
COPY package*.json .

# Install app dependencies
RUN npm ci

# Bundle app source
COPY . .

# Type check app
RUN npm run build


FROM base AS runner

# Install only production app dependencies
RUN npm ci --only=production


# Bundle app source
# COPY . .

USER node

# Start the app
# EXPOSE 80
# CMD ["npm", "run", "start"]
# CMD ["bash"]
