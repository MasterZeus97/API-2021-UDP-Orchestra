FROM node:17-alpine

COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

RUN apk update
RUN apk add busybox-extras

ENTRYPOINT ["node", "/opt/app/auditor.js"]
