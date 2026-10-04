# Rhythm of Soul 🎵

Rhythm of Soul is a comprehensive web-based application (likely a music or audio streaming platform) built with a modern tech stack. It features a robust microservices architecture on the backend and a responsive, feature-rich frontend.

## 🏗 Architecture Overview

The project is divided into two main parts:

- **Frontend (`/frontend`)**: A Single Page Application (SPA) built with React and TypeScript.
- **Backend (`/backend`)**: A microservices-based architecture using Spring Boot.

---

## 💻 Frontend

The frontend is a React application built for performance and a great user experience, featuring audio visualization and state management.

### Tech Stack
- **Framework:** React 19 with TypeScript
- **State Management:** Redux Toolkit & React-Redux
- **Routing:** React Router DOM
- **Styling:** Tailwind CSS, Bootstrap, and PrimeReact
- **Audio & Visualization:** Wavesurfer.js
- **Network Requests:** Axios, StompJS/SockJS (for WebSockets)
- **Other Utilities:** Swiper (carousels), Recharts (charts), SweetAlert2 (alerts), Dayjs

### Getting Started (Frontend)
1. Navigate to the frontend application directory:
   ```bash
   cd frontend/rhythm_of_soul
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## ⚙️ Backend

The backend is structured as a collection of microservices to ensure scalability and maintainability.

### Microservices
- **API Gateway (`api_gateway`)**: Acts as the single entry point for all frontend requests, routing them to the appropriate microservices.
- **Identity Service (`identity_service`)**: Handles user authentication, authorization, OAuth2 integration, and user management.
- **Content Service (`content_service`)**: Manages the core content (likely music, playlists, audio files).
- **Notification Service (`notification_service`)**: Handles sending notifications to users.

### Tech Stack
- **Framework:** Spring Boot (Java 23) & Spring Cloud (OpenFeign)
- **Database:** MariaDB (Relational) & Spring Data JPA
- **Caching & Messaging:** Redis
- **Object Storage:** MinIO (for storing audio/image files)
- **Security:** Spring Security & OAuth2 Resource/Authorization Server
- **Tools:** Maven, Lombok, MapStruct, Spotless (Code formatting), JaCoCo (Test coverage)

### Getting Started (Backend)
Prerequisites: Java 23, Maven, MariaDB, Redis, and MinIO.

1. Navigate to a specific service, e.g., Identity Service:
   ```bash
   cd backend/identity_service
   ```
2. Build the project:
   ```bash
   ./mvnw clean install
   ```
3. Run the service:
   ```bash
   ./mvnw spring-boot:run
   ```

---

## 🚀 Deployment & Environment

- The frontend utilizes `.env.dev` and `.env.prod` for environment-specific configurations.
- The backend relies on standard `application.yml` or `application.properties` within each service for configuring database connections, MinIO credentials, and Redis settings.

