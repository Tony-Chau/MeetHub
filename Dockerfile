FROM node:boron

#The file directory
COPY . /assignment1

#The folder that progress the work
WORKDIR /assignment1

#install all npm packages
RUN npm install 

#Host the site on port 3000
EXPOSE 3000

#Command for starting the website (npm start = node app)
CMD ["npm", "start"]

