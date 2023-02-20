# E-commerce Website
The project is an e-commerce platform that allows users to browse and purchase products online. It is built using a microservices architecture, which is made up of distinct components, or microservices, that are connected by REST APIs. The same microservices on the back end can be used to create many user interfaces. Though the quirks of this architectural style fascinate development teams, the benefits to corporations are considerable.

The system has two types of users - admins and customers. Admins are responsible for managing the categories, products, orders, and payments, while customers can register, login, browse products, add items to cart, checkout, and track their orders.

The front-end of the application is built using ReactJS, while the back-end is built using NodeJS and ExpressJS. The data is stored in a MySQL database.

The application is hosted on AWS, with the Kubernetes cluster managed by eksctl, a command-line utility that generates managed Kubernetes clusters in AWS as part of the infrastructure creation process. Playbooks are used by Ansible to configure cluster nodes. The Github repository is used to maintain source code. Any modifications to the repository will start the Jenkins pipeline, which combines development and operational activities. The images are created with Docker.

The application has undergone both static and dynamic testing. Dynamic testing, also known as control-flow-based testing, ensures that the software covers each branch of the control flow. In the control flow, dynamic testing tests for statement, path, and branch coverage. On the other hand, static testing does not require running the program, but rather walking through the code. This includes code walkthrough, code review, and code audit.

Automation testing has been performed using Jest, which is a JavaScript testing framework designed to ensure correctness of any JavaScript codebase. The tests are run in containers managed by Kubernetes. Prometheus and Grafana are used for monitoring the health of the application and the cluster, while Docker is used for containerization.

Overall, the e-commerce platform is designed to be a scalable, robust, and secure system that allows customers to shop for products online with ease. The microservices architecture and use of DevOps tools ensures that the platform can be easily maintained and updated while minimizing downtime.

## Technologies Used
- Next.js (React framework)
- Nest.js (Node.js framework)
- MongoDB
- Git
- Github
- Jest
- Docker
- Kubernetes
- Jenkins
- Ansible
- Prometheus
- Grafana
- AWS
- Stripe API

## Features
- **User authentication:** customers can register, login, and manage their profile information
- **Product browsing:** customers can browse products by category, filter by price or other attributes, and search for specific products
- **Shopping cart:** customers can add items to their cart, edit the quantity of items, and remove items from their cart
- **Checkout:** customers can securely checkout using Stripe API to process payments
- **Order management:** customers can view their order history and check the status of their current orders
- **Admin panel:** administrators can manage product inventory, view and fulfill orders, and manage customer information

## Installation
To run this project locally, you'll need to follow these steps:
- Clone the repository to your local machine
- Install the technologies mentioned above on your machine
- Install dependencies by running npm install in both the root directory and the client directory
- Create a .env file in the root directory and add the following environment variables:
   ```
   MONGO_URI=<your MongoDB connection string>
   JWT_SECRET=<your secret key for JSON Web Tokens>
   STRIPE_SECRET_KEY=<your secret key for Stripe API>
   ```
- Seed the database by running npm run seed in the root directory
- Start the server by running npm start in the root directory
- Start the client by running npm start in the client directory
- Visit http://localhost:3000 in your web browser to view the app

## Automation Testing
Jest was used for automation testing in this application. Jest is a JavaScript testing framework used to ensure code quality and prevent regressions. Jest provides features like snapshot testing, mocking, and code coverage analysis. It also has built-in support for asynchronous testing, making it suitable for testing Node.js applications.

## DevOps Tools Used
The following DevOps tools were used in building and deploying this application:
- **Docker:** used for containerizing the application and its dependencies
- **Kubernetes:** used for automating deployment, scaling, and management of containerized applications
- **Jenkins:** used for building, testing, and deploying the application
- **Ansible:** used for configuring and managing servers
- **Prometheus:** used for collecting and querying metrics from the application
- **Grafana:** used for visualizing metrics collected by Prometheus
- **AWS:** used as the cloud provider to host the Kubernetes cluster and the infrastructure supporting the application. 
