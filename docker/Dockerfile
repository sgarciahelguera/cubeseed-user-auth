# syntax=docker/dockerfile:1

FROM ubuntu:22.04
WORKDIR /app

COPY . /app

# install node
RUN apt update && apt upgrade -y && apt install curl -y
RUN curl -sL https://deb.nodesource.com/setup_14.x  | bash -
RUN apt -y install nodejs

# check installed versions
RUN node -v
RUN npm -v
RUN npx -v

# Cleanup
RUN apt update && apt upgrade -y && apt autoremove -y

# install deps
RUN npm install

# build app
RUN npm run build

CMD ["npm", "run", "start"]
EXPOSE 3000
