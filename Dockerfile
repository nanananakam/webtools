FROM node:16-bullseye-slim

COPY . /

# yarn installは済んでいる想定
RUN yarn run build

CMD ["yarn","run","start"]
