Scalable URL Shortener with CI/CD
A high-performance URL shortener application designed with a focus on scalability and automation. This project demonstrates a production-ready architecture using AWS Load Balancing, Docker, and a fully automated CI/CD Pipeline.

NodeJSDockerAWS

🚀 Tech Stack
Backend: Node.js, Express.js
Database: MongoDB Atlas
Containerization: Docker
Infrastructure: AWS EC2 (Ubuntu), Application Load Balancer (ALB)
Automation: GitHub Actions (CI/CD)
Process Manager: PM2
✨ Features
High Availability: Uses AWS Application Load Balancer to distribute incoming traffic across multiple EC2 instances, ensuring zero downtime.
Auto-Deployment: Code changes pushed to the main branch automatically build, push to Docker Hub, and deploy to all production servers.
Dockerized: Application runs in isolated containers, ensuring consistency across local, staging, and production environments.
Real-time Shortening: Generates unique short codes instantly using nanoid.
🛠️ Architecture & Deployment Steps
This project follows a scalable architecture. Below are the detailed steps to replicate this environment:

1. Local Setup & Database Configuration
Clone the repository.
Install Dependencies:
npm install
Environment Variables:
Update the MONGO_URI in server.js with your MongoDB connection string.
Ensure your MongoDB Atlas Network Access whitelist allows your local IP and server IPs.
Run Locally:
bash

npm start
2. Dockerization
The application is containerized for easy deployment.

Build the Image:
bash

docker build -t <your-dockerhub-username>/url-shortener:latest .
Push to Registry:
bash

docker push <your-dockerhub-username>/url-shortener:latest
3. AWS Infrastructure Setup
A. EC2 Instances Setup
Launch 2 EC2 Instances (Ubuntu, t2.micro) in the same VPC/Subnet.
Security Group: Ensure Port 22 (SSH), 80 (HTTP), and 3000 (Custom App Port) are open.
Install Docker:
bash

curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh
Deploy Container:
bash

sudo docker run -d -p 3000:3000 --name my-url-app <your-dockerhub-username>/url-shortener:latest
B. Load Balancer Configuration
Target Group: Create a Target Group targeting Port 3000. Register both EC2 instances here.
Load Balancer: Create an Application Load Balancer (ALB).
Listener: Configure the listener to forward HTTP traffic (Port 80) to the Target Group.
Security Group: Allow Port 80 from anywhere (0.0.0.0/0) on the Load Balancer's Security Group.
4. CI/CD Pipeline (GitHub Actions)
The deployment process is fully automated using GitHub Actions.

Workflow Logic:

Trigger: Automatically triggers on every push to the main branch.
Continuous Integration (CI):
Checks out code.
Builds a new Docker image with the latest changes.
Push: Logs into Docker Hub and pushes the latest image tag.
Continuous Deployment (CD):
Connects via SSH to EC2 Server 1.
Pulls the latest image, stops the old container, and starts the new one.
Repeats the process for EC2 Server 2.
Required Secrets:
To run the pipeline, the following GitHub Secrets must be configured:

SSH_PRIVATE_KEY: AWS EC2 Key Pair content.
EC2_USER: Server username (e.g., ubuntu).
EC2_HOST_1: Public IP of Server 1.
EC2_HOST_2: Public IP of Server 2.
DOCKER_USERNAME: Docker Hub username.
DOCKER_PASSWORD: Docker Hub Access Token.
🌐 How to Access
The application is accessible via the Load Balancer's public DNS name:
http://<your-load-balancer-dns>.us-east-1.elb.amazonaws.com

📸 Project Architecture Diagram

User
   ↓
[ AWS Load Balancer ]
   ↓        ↓
[ Server 1 ]  [ Server 2 ]
   ↓            ↓
[ Docker App ]  [ Docker App ]
   ↓            ↓
   -----------
   ↓
[ MongoDB Atlas ]
📝 Future Improvements
 Add Custom Domain (Route 53) with HTTPS (SSL Certificate).
 Implement User Authentication (JWT).
 Add Analytics (Click counts per URL).
 Set up Auto Scaling Groups to increase servers automatically based on traffic.
📄 License
This project is open source and available for educational purposes.