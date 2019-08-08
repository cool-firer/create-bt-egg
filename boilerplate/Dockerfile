FROM registry-vpc.cn-shenzhen.aliyuncs.com/btclass/node:v{{node}}-alpine
ARG NPM_AUTH
ARG APP_PATH=/app

RUN echo "${NPM_AUTH}" >> ~/.npmrc
# Bundle APP files
COPY ./ ${APP_PATH}

# Install app dependencies
RUN cd ${APP_PATH} && npm install --production

WORKDIR ${APP_PATH}

CMD [ "npm", "start" ]