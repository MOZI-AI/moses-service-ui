FROM node:alpine as builder

RUN mkdir /root/react
WORKDIR /root/react
ARG SERVER_ADDR
ENV SERVICE_ADDR $SERVER_ADDR
COPY . ./

RUN npm install
RUN npm run-script build

#production environment
FROM nginx:alpine
COPY --from=builder /root/react/build /usr/share/nginx/html
EXPOSE 8000
CMD ["nginx", "-g", "daemon off;"]