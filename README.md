# Data Collection with Plugin Architecture

This backend application serves as a robust data collection tool designed around a plugin architecture. The implementation allows the seamless addition of new features without altering the core functionality of the data collection app. For instance, integrated Google Sheets on every form creation and response addition illustrates the flexibility and extensibility of the plugin system. These plugins respond to events triggered by the main app, ensuring smooth and modular enhancements.

## Features

- **Plugin Architecture:** Employs a flexible plugin system that facilitates the addition of new functionalities without modifying the core application.

- **Google Sheets Integration:** Integrated Google Sheets on form creation and response addition, showcasing the versatility of the plugin system.

- **Failsafe Implementation:** Ensures the application's resilience through comprehensive error handling, logging, and graceful shutdown mechanisms triggered by various process events such as exit, SIGINT, etc.

- **Monitoring with Prometheus and Grafana:** Utilizes Prometheus and Grafana for monitoring the Node.js server. Custom metrics, including concurrency and counts of various interactions, provide valuable insights.

- **Clustering for Scalability:** Implements clustering to horizontally scale the application, making it well-suited for handling high traffic loads.

- **Dockerized Deployment:** Dockerized for streamlined deployment, offering ease of reproduction and quick setup.
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
