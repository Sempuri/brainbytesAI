FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npx prettier --write . --ignore-path .prettierignore || true
COPY . .
RUN npm run build
EXPOSE 3000
ENV NEXT_PUBLIC_API_URL=http://backend:3000
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
CMD ["npm", "start"]
