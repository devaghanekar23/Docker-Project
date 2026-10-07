# Weather App (React + Express, No Database)

Simple two-tier Weather application:
- **Frontend:** React + Vite (npm)
- **Backend:** Node.js + Express (npm) — calls the **free Open-Meteo API** (no API key needed, no database)

## Project Structure

```
weather-app/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   ├── nginx.conf
│   └── Dockerfile
├── docker-compose.yml
└── Jenkinsfile
```

## Run Locally in VS Code (2 terminals)

### Terminal 1 — Backend
```bash
cd backend
npm install
npm start
```
Backend runs on `http://localhost:5000`

### Terminal 2 — Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

Open the frontend URL in your browser, type a city name, and hit Search.

## Run with Docker Compose

```bash
docker-compose up --build
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Endpoint (Backend)

| Method | Endpoint            | Description                          |
|--------|----------------------|----------------------------------------|
| GET    | /weather?city=Mumbai | Get current weather for a city        |
| GET    | /health              | Health check                           |

Example:
```
GET http://localhost:5000/weather?city=Mumbai
```

## Notes
- Uses **Open-Meteo** (https://open-meteo.com) — completely free, no API key or signup required.
- No database — nothing is stored, every search hits the live API.
- Jenkinsfile already includes `chmod +x node_modules/.bin/*` before `vite build` to avoid the
  "Permission denied" issue seen in the todo-app pipeline.
