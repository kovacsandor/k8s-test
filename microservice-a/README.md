# Microservice A

## Provide environment variables for running the app locally in Docker Compose

.env

```bash
VARIABLE_FROM_DOTENV_FILE= ...
```

## Provide environment variables for running the app locally in Kubernetes

secret.yaml

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: microservice-a-secret
type: Opaque
stringData:
  VARIABLE_FROM_DOTENV_FILE: ...
```
