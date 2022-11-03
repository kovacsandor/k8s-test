# K8s test

## Running the app locally

### With Kubernetes

#### Build Docker images

All microservices need to have Docker images build from them.

```bash
cd ~/Projects/k8s-test/
# react app environment variables need to be present at build time
docker build -t andorkovacs/k8s-test-client-docker-image -f ./client/Dockerfile $(for i in `cat .env`; do out+="--build-arg $i " ; done; echo $out;out="") ./client/ 
docker build -t andorkovacs/k8s-test-microservice-a-docker-image -f ./microservice-a/Dockerfile ./microservice-a/
docker build -t andorkovacs/k8s-test-microservice-b-docker-image -f ./microservice-b/Dockerfile ./microservice-b/
```

#### Push Docker images

All images need to be pushed to Docker Hub.

```bash
docker push andorkovacs/k8s-test-microservice-a-docker-image
docker push andorkovacs/k8s-test-microservice-b-docker-image
docker push andorkovacs/k8s-test-client-docker-image
```

#### Create secrets for environment variables

```bash
kubectl apply -f ./microservice-a/secret.yaml
kubectl apply -f ./microservice-b/secret.yaml
# client environment variables were set at image build time
```

#### Create the Kubernetes deployments

The deployments will create pods running containers made based on the docker images.

```bash
kubectl apply -f ./microservice-a/deployment.yaml
kubectl apply -f ./microservice-b/deployment.yaml
kubectl apply -f ./client/deployment.yaml
```

#### Create the Kubernetes Cluster IP services

The Cluster IP services take care of the communication between pods inside the cluster.

```bash
kubectl apply -f ./microservice-a/cluster-ip-service.yaml
kubectl apply -f ./microservice-b/cluster-ip-service.yaml
kubectl apply -f ./client/cluster-ip-service.yaml
```

#### Install NGINX ingress controller

Create a LoadBalancer service and an ingress-nginx-controller deployment.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.4.0/deploy/static/provider/cloud/deploy.yaml
```

#### Configure NGINX ingress controller

Create a an ingress configuration for the ingress-nginx-controller.

```bash
kubectl apply -f ingress.yaml
```

#### Map application host to localhost

In your `/etc/host` file map `k8s-test.com` to your local ip address. This is needed if you wish to work on multiple projects locally.

```bash
127.0.0.1 k8s-test.com
```

#### Stop app in Kubernetes

```bash
kubectl delete deployment client-deployment
kubectl delete deployment microservice-a-deployment
kubectl delete deployment microservice-b-deployment
kubectl delete service client-cluster-ip-service
kubectl delete service microservice-a-cluster-ip-service
kubectl delete service microservice-b-cluster-ip-service
kubectl delete all --all -n ingress-nginx
```

### With Docker Compose

#### Start app

Start application in development mode with live code refresh and live reload in the browser

```bash
cd ~/Projects/k8s-test/
docker-compose up -d
```

#### Stop app in Docker Compose

Stops and deletes the containers

```bash
docker-compose down
```
