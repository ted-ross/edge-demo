kubectl create namespace edge-demo-hq
kubectl create namespace edge-demo-station-1
kubectl create namespace edge-demo-station-2


export KUBECONFIG=config-hq
export KUBECONFIG=config-station-1
export KUBECONFIG=config-station-2


skupper init


hq: skupper connection-token token.yaml

edge: skupper connect token.yaml


mvn package -DskipTests
docker build -f src/main/docker/Dockerfile.jvm -t dejanb/edge-demo:1.0-SNAPSHOT .
kubectl apply -f target/wiring-classes/META-INF/kubernetes/kubernetes.yml
