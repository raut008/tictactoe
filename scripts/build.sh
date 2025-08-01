eval $(minikube docker-env)

# Build the latest Docker image
docker build -t react-app:latest .
echo "✅ Build successful"