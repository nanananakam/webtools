FROM node:16.17.1-bullseye-slim

COPY . /

RUN apt-get update && apt-get install -y python3 make g++\
 && yarn install && yarn run build \
 && apt-get clean && rm -rf /var/lib/apt/lists/*

CMD ["yarn","run","start"]
