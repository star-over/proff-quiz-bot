FROM --platform=linux/amd64 node:22 AS base

# load PUPPETEER
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
# ENV PUPPETEER_SKIP_DOWNLOAD true
# RUN apt-get update && apt-get install gnupg wget -y && \
#   wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
#   sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
#   apt-get update && \
#   apt-get install google-chrome-stable -y --no-install-recommends && \
#   rm -rf /var/lib/apt/lists/*

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
