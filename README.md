# Instruction of how to set up and execute

First, you can cd into the docker/ directory of the api project, and execute the command:
docker-compose -f docker-compose.dev.yml up

Second, you cd into the root of the frontend project and run:
yarn && mkdir -p ../gradual-messaging-api/public && yarn build && cp -r build/\* ../gradual-messaging-api/public

Then you have build and copy the frontend app into the backend app.

After that, you can open http://localhost:5000 in your Chrome, and see this:

Now you can input 'admin' as your username, '123456' as your password, click the 'Login' button, then you will login as a 'Admin' user, who is a builtin superuser.

Now you can click 'Logout' button, and go back to the login page.

Then you can click the 'Register now' link, and go to the 'User' user register page.

After you complete the information and submit, you'll goto the login page automatic.
Then you can login as the 'User' user you just created.

in this page, i.e. the 'Chats' page, you can send or receive messages.

Now, you can use the preset usernames: jacob1, jacob2 and jacob3, whose password is jacob, in different browsers, and chat with each other.

# Explain of the tech stack used in this project and what the reason behind the choice

I used express.js as the Web Framework, because I wrote most of my Node.js project in the help of it and It's popular.

I used Routing Controllers because it's an powerful data binding and validation tool, which can eliminate bulk of boilerplate codes. By using it, I can skip writing code processing the request and response data and converting input data into typescript strongly typed objects.

I used Awilix for Dependency Injection, so the classes don't have to create and inject the objects they depend on.

I used Jest and Supertest for automatic tests, because, they can help me write and run unit tests, integration tests as well as e2e api tests.

I used Docker because it can run everything my app depends on efficiently, including the programs which can not run on macOS. And it can help anyone to run my application on any computer without worrying about problems relating to OS or Language versions.

# Explain of the project structure and why make it so

The docker/ folder contains Dockerfile and docker-compose config files.

The features/ folder contains cucumber.js files, which I don't have enough time to finish.

The logs/ folder contains all the log files.

The public/ folder contains frontend files after build.

The test/ folder contains the test source files, including unit/ integration/ e2e/ and cucumber/ subfolders.

The src/ folder contains the main source files, including:

- domain/ folder: the domain objects representing the data model of the project, and used for CouchDB mapping
- infrastructure/ folder: the utility codes independent of business codes, including the global config data, error classes, dependency injection codes, and also the couchdb client.

- persistence/ folder: the DAO(Data Access Object) classes
- application/ folder: the business logic, including the files relating to jwt tokens, and business use case classes with the param and return value classes.

- presentation/ folder: the REST AND GraphQL API implementation codes, and authentication & logging middlewares.

There are some folders and files that comes from the project template I'm using, which should be deleted, but I don't have time to finish that.

# Reference

I init this project by forking the template: [express-typescript-skeleton](https://github.com/borjapazr/express-typescript-skeleton).

I rearrange the project folders, add GraphQL and Mongodb support.
