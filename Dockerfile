FROM node:14-alpine

# RUN groupadd customgroup && useradd -m nodejsuser

# USER nodejsuser
# RUN mkdir /home/nodejsuser/express-local-library-app
WORKDIR /express-local-library-app

COPY package*.json ./
RUN npm install

COPY . .

ENV NODE_ENV production
ENV PORT 3000

EXPOSE 3000
CMD [ "npm", "start" ]