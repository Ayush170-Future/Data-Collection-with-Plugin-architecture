# Data Collection with Plugin Architecture

This backend application serves as a robust data collection tool designed around a plugin architecture. The implementation allows the seamless addition of new features without altering the core functionality of the data collection app. For instance, integrated Google Sheets on every form creation and response addition illustrates the flexibility and extensibility of the plugin system. These plugins respond to events triggered by the main app, ensuring smooth and modular enhancements.

![Architectural_Diagram](./Architectural_Diagram.jpg)

## Features

## Plugin Architecture

Our system is designed with a modular Plugin Architecture that allows for seamless feature integration without modifying the core functionality and codebase. Key features include:

- **Modularity**: The system supports a modular approach, enabling the integration of new features without altering the core functionality.
  
- **Event-Based Approach**: Plugins respond to events triggered by the main application and carry out their functionality using the data conveyed by these events.

- **Plugin Configuration**: A dedicated Plugin Config file facilitates the addition and removal of plugins. The Plugin Manager loads plugins at runtime during the initialization of the main application.

## Google Sheets Integration

The system offers seamless integration with Google Sheets, providing the following functionalities:

- Dynamically creates new sheets when forms are generated.
- Adds rows to the sheet when a response is added.
- Inserts columns in the header when questions are added to a form.

## Failsafe Implementation

To ensure robustness and reliability, our system incorporates a failsafe implementation, including:

- **Robust Error Handling**: Comprehensive error handling is implemented across all routes.
  
- **Logging**: Utilizes Winston for logging, with output to the console and a .log file. Different log levels such as info, error, and warn are supported.

- **Graceful Shutdown Mechanisms**: Ensures reliability in case of plugin failure, process crashes, or closures.

## Monitoring with Prometheus and Grafana

Our system utilizes Prometheus and Grafana for insightful server monitoring, offering custom metrics for:

- Concurrency
- CPU Usage
- Event Loop
- Forms Route
- Response Route
- Request-Response Delay

## Clustering for Scalability

To enhance performance and scalability, our system implements Node.js clustering.

## Dockerized Deployment

For convenient deployment, our system is Dockerized, with the following features:

- **Containers**: Docker containers are provided for the main application, Grafana, and Prometheus.

- **Docker-Compose**: Utilizes Docker-compose to manage multiple containers, with port-mapping for easy local machine access.


## Installation

### Without Docker

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ayush170-Future/Data-Collection-with-Plugin-architecture.git

2. **Navigate to the project directory:**
   ```bash
   cd Data-Collection-with-Plugin-architecture
3. **Install dependencies:**
   ```bash
   npm install
4. **Start the application:**
   ```bash
   npm start

## Using Docker

Follow these steps to deploy the application, Grafana, and Prometheus using Docker:

1. **Start Docker Desktop:**
    Ensure Docker Desktop is running on your machine.

2. **Build and Run Docker Containers:**
    Run the following command to build and start the Docker containers for the application, Grafana, and Prometheus:
    ```bash
    docker-compose up
    ```
    This command initiates the application on port 5000, Grafana on port 3000, and Prometheus on port 9090.

3. **Access the Application:**
    Open your web browser and navigate to [http://localhost:5000](http://localhost:5000) to access the main application.

4. **Access Grafana:**
    Visit [http://localhost:3000](http://localhost:3000) to access Grafana. Use the default credentials (admin/admin).

5. **Access Prometheus:**
    Navigate to [http://localhost:9090](http://localhost:9090) to access Prometheus for monitoring purposes.
## Scope for Improvement

1. **Kubernetes Autoscaling:**

   Explore using Kubernetes autoscaling for improved scalability and resource management, replacing Node.js build-in clustering.

2. **Optimize MongoDB Autoscaling:**

   Pick paid the MongoDB plan for autoscaling.


## 🚀 About Me

Hey! This is Ayush Singh. I'm a backend developer and a Bitcoin core contributor from India. 

Most recently, I was chosen among 45 students from all over the world for the Summer of Bitcoin internship, where I was responsible for making open-source contributions to Bitcoin Core. I made 4 PRs to the original Bitcoin you must have heard about in the news, one of them is already merged and is in production. Along with that, I'm a backend developer who has worked on many full-stack applications related to Blockchain and Core CS technologies. I'm also a great problem solver as I do a lot of competitive programming, I'm a Specialist on Codeforces, an ICPC India regionalist, and a Knight on Leetcode.

Besides my technical knowledge and experience, I'm very interested in philosophy and I'm a self-driven person, I don't need external motivation to work hard, I'm a naturally hardworking being, who gets things done.
