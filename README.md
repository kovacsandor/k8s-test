# K8s test

## Running the app locally

### Map application host to localhost

In your `/etc/host` file map `k8s-test.com` to your local ip address. This is needed if you wish to work on multiple projects locally.

```bash
127.0.0.1 k8s-test.com
```

Once the application is running visit the app in the browser <http://k8s-test.com/>

### Starting up the app in Kubernetes

#### Docker images

##### Build Docker images

All microservices need to have Docker images build from them.

```bash
cd ~/Projects/k8s-test/
# react app environment variables need to be present at build time
build_with_args="docker build -t andorkovacs/k8s-test-client-docker-image -f ./client/Dockerfile $(cat ./client/.env | while read -r line; do out+="--build-arg \"$line\" "; done; echo $out;out="")./client/"
eval "$build_with_args"
docker build -t andorkovacs/k8s-test-microservice-a-docker-image -f ./microservice-a/Dockerfile ./microservice-a/
docker build -t andorkovacs/k8s-test-microservice-b-docker-image -f ./microservice-b/Dockerfile ./microservice-b/
```

##### Push Docker images

All images need to be pushed to Docker Hub.

```bash
docker push andorkovacs/k8s-test-microservice-a-docker-image
docker push andorkovacs/k8s-test-microservice-b-docker-image
docker push andorkovacs/k8s-test-client-docker-image
```

#### Kubernetes objects

##### Create secrets for environment variables

```bash
# client environment variables were set at image build time
kubectl apply -f ./microservice-a/secret.yaml
kubectl apply -f ./microservice-b/secret.yaml
```

##### Create the Kubernetes deployments

The deployments will create pods running containers made based on the docker images.

```bash
kubectl apply -f ./microservice-a/deployment.yaml
kubectl apply -f ./microservice-a/deployment-database.yaml
kubectl apply -f ./microservice-b/deployment.yaml
kubectl apply -f ./client/deployment.yaml
```

##### Create the Kubernetes Cluster IP services

The Cluster IP services take care of the communication between pods inside the cluster.

```bash
kubectl apply -f ./microservice-a/cluster-ip-service.yaml
kubectl apply -f ./microservice-a/cluster-ip-service-database.yaml
kubectl apply -f ./microservice-b/cluster-ip-service.yaml
kubectl apply -f ./client/cluster-ip-service.yaml
```

##### Install NGINX ingress controller

Create a LoadBalancer service and an ingress-nginx-controller deployment.

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.4.0/deploy/static/provider/cloud/deploy.yaml
```

##### Configure NGINX ingress controller

Create a an ingress configuration for the ingress-nginx-controller.

```bash
kubectl apply -f ingress.dev.yaml
```

#### Restart app in Kubernetes

```bash
kubectl rollout restart deployment client-deployment
kubectl rollout restart deployment microservice-a-deployment
kubectl rollout restart deployment microservice-a-database-deployment
kubectl rollout restart deployment microservice-b-deployment
```

#### Accessing the databases running in Kubernetes locally

Create nope port services

```bash
kubectl apply -f ./microservice-a/node-port-service-database.yaml
```

List services

```bash
kubectl get services
```

Find the database's nope port service that you want to connect to and use the _node port_.

| NAME                                      | TYPE     | CLUSTER-IP   | EXTERNAL-IP | PORT(S)             | AGE |
| ----------------------------------------- | -------- | ------------ | ----------- | ------------------- | --- |
| ⋮                                         | ⋮        | ⋮            | ⋮           | ⋮                   | ⋮   |
| microservice-a-database-node-port-service | NodePort | 10.96.125.79 | `<none>`    | 27017:**30247**/TCP | 48m |
| ⋮                                         | ⋮        | ⋮            | ⋮           | ⋮                   | ⋮   |

You can access the database with the connection string of `mongodb://localhost:30247`.

#### Stop app in Kubernetes

```bash
kubectl delete deployment client-deployment
kubectl delete deployment microservice-a-deployment
kubectl delete deployment microservice-a-database-deployment
kubectl delete deployment microservice-b-deployment
kubectl delete service client-cluster-ip-service
kubectl delete service microservice-a-cluster-ip-service
kubectl delete service microservice-a-database-cluster-ip-service
kubectl delete service microservice-b-cluster-ip-service
kubectl delete service microservice-a-database-node-port-service
kubectl delete all --all -n ingress-nginx
```

### Starting up the app in Docker Compose

Start application in development mode with live code refresh and live reload in the browser

```bash
cd ~/Projects/k8s-test/
docker-compose up --detach
```

If you make changes outside of the src folder you might want to rebuild the images with `docker-compose up --detach --build`.

#### Accessing the databases running in Docker Compose locally

Find the database you want to connect to in the `docker-compose.yaml` file and see what port it is mapped to on your local computer.

```yaml
services:
  microservice-a-database:
    ports:
      - "27080:27017"
```

Then connect to the database using that port `mongodb://localhost:27080`.

#### Stop app in Docker Compose

Stops and deletes the containers

```bash
docker-compose down
```
