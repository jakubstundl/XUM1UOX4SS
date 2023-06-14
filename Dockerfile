FROM node:slim
EXPOSE 3000
COPY . .
RUN npm install
RUN npm install -g serve
RUN npm run build
CMD ["serve", "-s", "build"]

