# Instruction of how to set up and execute

First, you can cd into the docker/ directory of the api project, and execute the command:
docker-compose -f docker-compose.dev.yml up
after finished, you will see:

![image](https://user-images.githubusercontent.com/1572996/179399183-e2661234-3bd1-4b62-8e6b-7608d4fd55b3.png)

Second, you cd into the root of the frontend project and run:
yarn && mkdir -p ../restaurants-reservation-api/public && yarn build && cp -r build/\* ../restaurants-reservation-api/public

Then you have build and copy the frontend app into the backend app.

After that, you can open http://localhost:5000 in your Chrome, and see this:

![image](https://user-images.githubusercontent.com/1572996/179399358-6d2e32af-1f2f-45d3-9338-91067937e301.png)

Now you can input 'admin' as your username, 'hilton' as your password, click the 'Login' button, then you will login as a 'Admin' user, who is a builtin user who can only create a 'Employee' user, and nothing else. After login success, you'll see this:

![image](https://user-images.githubusercontent.com/1572996/179399546-5e5062ca-2977-43d6-ad45-da03d9a15bd7.png)

In this page, you can input the infomation and create a 'Employee' user, who can list reservations from all 'Guest' users, and update them.

![image](https://user-images.githubusercontent.com/1572996/179399628-9c3c1e98-77d7-40c7-b00d-379533c13661.png)

After you submit, the page will become empty again, and you can create another 'Employee' user.

Now you can click 'Logout' button, and go back to the login page.

Then you can click the 'Register now' link, and go to the 'Guest' user register page.
![image](https://user-images.githubusercontent.com/1572996/179400014-d9bf0ce8-1ca7-4e22-8178-1ad451d37662.png)

After you complete the information and submit, you'll goto the login page automatic.
Then you can login as the 'Guest' user you just created.

![image](https://user-images.githubusercontent.com/1572996/179400081-0c1e8b53-6932-485d-8367-c37ebf3263e4.png)

in this page, i.e. the 'Reservations' page, you can add a reservation by clicking the 'Add' button and fill the form.

![image](https://user-images.githubusercontent.com/1572996/179400207-564491b5-eb24-4bfb-9c2d-efec6df51ce7.png)

After submitting, you'll go back to the 'Reservations' page, and now you need to refresh the page, and see the newest reservation list:

![image](https://user-images.githubusercontent.com/1572996/179400261-5299f856-67d2-40aa-9ee1-92fee2d8645e.png)

You hit the 'Edit' button, then you can update the information and hit the 'Update' button to submit.

![image](https://user-images.githubusercontent.com/1572996/179400326-459e5557-7e8e-424f-bb2f-fb9ceda04d2b.png)

After you submit, you go back to the 'Reservations' page again.

Now you can logout and login as a employee that you created as a 'Admin' user in the first step.

![image](https://user-images.githubusercontent.com/1572996/179400385-bb60eeb9-bd3f-449a-a095-bc55671445d2.png)

In the page you see after login, you can not see the 'Add' button anymore. But you can see all the reservations in the app. (The Guest users can only see their own reservations.), and update them.
![image](https://user-images.githubusercontent.com/1572996/179400470-e22975e6-6ad3-4280-947b-2fe1fe868941.png)

You can also change the reservation status from the default value 'Pending' into 'Completed' or 'Canceled'.(The 'Guest' users can only change theire own reservations from 'Pending' into 'Canceled'). But by now I only finished developing the Rest and GraphQL apis of the 'Change Status' function, not the frontend.

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

# Test Report if applicable

![image](https://user-images.githubusercontent.com/1572996/179403024-c0dbcdd5-a05a-48e9-87ac-c4b577352c78.png)

I have only finished writing unit test, integration test and e2e test for just one use case: Create Reservation, which can be run by executing 'yarn test'.

# Reference

I created this project from the template: [express-typescript-skeleton](https://github.com/borjapazr/express-typescript-skeleton).

I rearrange the project folders, add GraphQL and CouchDB support.
