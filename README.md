# Library Management System

![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![Microservices](https://img.shields.io/badge/Microservices-blue?style=for-the-badge)

A comprehensive Library Management System built using a Microservices architecture. This system is designed to handle various aspects of library operations including user management, book cataloging, and loan processing.

## 🏗️ Architecture

The project is structured as a set of independent microservices, ensuring scalability and maintainability.

| Service | Description |
| :--- | :--- |
| **Discovery Service** | Eureka Server for service registration and discovery. |
| **Gateway Service** | API Gateway (Spring Cloud Gateway) for routing and filtering. |
| **User Service** | Manages user registration, authentication, and profiles. |
| **Catalog Service** | Handles book inventory, categories, and search. |
| **Loan Service** | Manages book loans, returns, and status tracking. |
| **Frontend** | Web interface for users and administrators. |

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Maven
- Node.js (for Frontend)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/TopazBTW/Project-system-.git
    cd Project-system-
    ```

2.  **Build Microservices**
    Navigate to each service directory and run:
    ```bash
    mvn clean install
    ```

3.  **Run Services**
    Start the services in the following order:
    1.  Discovery Service
    2.  Gateway Service
    3.  User / Catalog / Loan Services

4.  **Run Frontend**
    ```bash
    cd frontend
    npm install
    npm start
    ```

## 🛠️ Technologies

- **Backend:** Java, Spring Boot, Spring Cloud
- **Frontend:** JavaScript/TypeScript (React/Vue/Angular - *Check frontend folder*)
- **Database:** H2 / MySQL / PostgreSQL (Configured in `application.yml`)
- **Build Tool:** Maven

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
