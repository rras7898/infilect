#   Tech Stack Choices & Reasoning

    1.  Flask (Python): minimal footprint, simple JSON API; great for mock metrics.

    2.  React + Vite: fast dev/build pipeline; Recharts for simple charts; axios for polling.

    3.  Docker (multi-stage): small runtime images (nginx:alpine, python:slim) and fast builds.

    4.  Docker Hub (free): image registry for CI push + K8s pull.

    5.  GitHub Actions (free minutes): reliable CI/CD with environment-agnostic runners.

    6.  Minikube on GCP VM (local K8s): free/low-cost, no managed K8s dependency.

#   Local Validation with Docker Compose

    Requirements: Docker Desktop / Docker Engine + Compose

    # From repo root
    docker compose up --build
    # Frontend: http://localhost/
    # Backend:  http://localhost:5000/metrics

#   Kubernetes (Local: Minikube)

    Prerequisite:-

    -   A cluster (Minikube)
    -   kubectl configured
    -   Images pushed to Docker Hub

    Apply Manifests:-

    kubectl apply -f k8s-manifest-files/namespace.yaml
    kubectl apply -f k8s-manifest-files/service-backend.yaml
    kubectl apply -f k8s-manifest-files/service-frontend.yaml
    kubectl apply -f k8s-manifest-files/deployment-backend.yaml
    kubectl apply -f k8s-manifest-files/deployment-frontend.yaml

#   Access the App

    minikube service -n metrics-app frontend-service --url
    kubectl -n metrics-app port-forward svc/frontend-service 8080:80
    http://localhost:8080

    ssh -i /Users/rohitranjan/.ssh/rohit_private_key -L 8082:192.168.49.2:30130 rohit.ranjan7898@34.16.6.95
    http://localhost:8082


    ssh -i /Users/rohitranjan/.ssh/rohit_private_key -L 5000:192.168.49.2:30000 rohit.ranjan7898@34.16.6.95
    http://localhost:5000/metrics

#   CI/CD (GitHub Actions)

    Trigger: on PRs and pushes to main.

    Jobs:

    1.  lint

    -   Backend: flake8
    -   Frontend: eslint (JS/JSX)

    2.  test

    -   Backend: pytest (placeholder test_dummy.py provided)

    3.  docker

    -   Build images for backend & frontend
    -   Tag only with the commit SHA (${{ github.sha }}) → immutable
    -   Push to Docker Hub


    Secrets required (Repository → Settings → Secrets and variables → Actions):

    -   DOCKER_USERNAME – Docker Hub username
    -   DOCKER_PASSWORD – Docker Hub password

    The workflow only pushes SHA tags to avoid mutable tags like latest. Example pushed tags:

    -   DOCKER_USERNAME/infilect-backend:<sha>
    -   DOCKER_USERNAME/infilect-frontend:<sha>

#   Observability, Logs & Troubleshooting

    kubectl -n metrics-app get pods,svc,deploy
    kubectl -n metrics-app describe pod <pod-name>
    kubectl -n metrics-app logs -f deploy/backend
    kubectl -n metrics-app logs -f deploy/frontend
    kubectl -n metrics-app get events
    kubectl -n metrics-app exec -it deploy/frontend -- /bin/sh

    docker compose logs -f
    docker compose ps

    curl -i http://localhost:5000/metrics
    curl -i http://backend-service:5000/metrics



