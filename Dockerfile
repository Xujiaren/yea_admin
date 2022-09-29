FROM node:alpine


# FROM alpine:3.10.2
# RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.ustc.edu.cn/g' /etc/apk/repositories \
#     && apk add --no-cache npm \
#     && apk add --no-cache nodejs

# 创建 app 目录


# 安装 app 依赖
RUN npm -g install serve

# 使用通配符复制 package.json 与 package-lock.json
#COPY package*.json ./

#RUN npm install

# 打包 app 源码
#COPY build /app
#COPY index.html /app
COPY build .
#WORKDIR /build
# 如需对 react/vue/angular 打包，生成静态文件，使用：
# RUN npm run build

EXPOSE 5000
# 如需部署静态文件，使用：
CMD ["serve","-s","-p","5000"]
#CMD [ "node", "server.js" ]