echo "☸️  Applying Kubernetes manifests..."
kubectl apply -f k8s/

echo "🔄 Restarting deployment to pick up the latest image..."
kubectl rollout restart deployment react-app

echo "⏳ Waiting for new pods to become ready..."
kubectl rollout status deployment react-app

echo "✅ Deployment successfully rolled out!"


