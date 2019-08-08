FROM node:8-alpine
ARG NPM_AUTH
ARG APP_PATH=/app

RUN echo "${NPM_AUTH}" >> ~/.npmrc
# Bundle APP files
COPY ./ ${APP_PATH}

# Install app dependencies
RUN echo "http://mirrors.tuna.tsinghua.edu.cn/alpine/v3.9/main" > /etc/apk/repositories \
    && echo "http://mirrors.tuna.tsinghua.edu.cn/alpine/v3.9/community" >> /etc/apk/repositories \
    && apk --update --no-cache add tzdata \
    && cp /usr/share/zoneinfo/Asia/Shanghai /etc/localtime \
    && echo "Asia/Shanghai" > /etc/timezone \
    && echo apk del tzdatda \
    && cd ${APP_PATH} && rm -rf node_modules \
    && cd ${APP_PATH} && npm install --production

WORKDIR ${APP_PATH}

CMD [ "npm", "start" ]