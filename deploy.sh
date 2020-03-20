docker build -t michaelbabin/multi-client -f ./client/Dockerfile ./client
docker build -t michaelbabin/multi-server -f ./server/Dockerfile ./server
docker build -t michaelbabin/multi-worker -f ./worker/Dockerfile ./worker

docker push michaelbabin/multi-client
docker push michaelbabin/multi-server
docker push michaelbabin/multi-worker

kubectl apply -f k8s
kubectl rollout restart deployments/server-deployment
kubectl rollout restart deployments/client-deployment
kubectl rollout restart deployments/worker-deployment