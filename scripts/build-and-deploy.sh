APP_NAME="react-app"
IMAGE_TAG="latest"

echo "📦 Switching to Minikube Docker environment..."
eval $(minikube docker-env)

echo "🐳 Building Docker image: $APP_NAME:$IMAGE_TAG ..."
docker build -t $APP_NAME:$IMAGE_TAG .

echo "🚢 Docker image built successfully."

echo "☸️  Deploying to Kubernetes..."
kubectl apply -f k8s/

echo "⏳ Waiting for deployment to complete..."
kubectl rollout status deployment/$APP_NAME

echo "✅ Deployment complete."

echo "🌐 Accessing service in browser..."
minikube service ${APP_NAME}-service
