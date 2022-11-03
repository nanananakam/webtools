FROM node:16-alpine3.16

COPY . /

# yarn installは済んでいる想定
RUN yarn run build

CMD ["yarn","run","start"]
