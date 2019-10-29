Create namespaces

    kubectl create namespace edge-demo-hq
    kubectl create namespace edge-demo-station-1
    kubectl create namespace edge-demo-station-2

Shell tools

    export KUBECONFIG=config-hq
    export KUBECONFIG=config-station-1
    export KUBECONFIG=config-station-2

Skupper create

    skupper init

On HQ

    skupper connection-token token.yaml

On Edges

    skupper connect token.yaml

Deploy service on HQ

    mvn package -DskipTests
    docker build -f src/main/docker/Dockerfile.jvm -t dejanb/edge-demo:1.0.0-SNAPSHOT .
    kubectl apply -f target/wiring-classes/META-INF/kubernetes/kubernetes.yml
    oc expose service edge-demo
    curl http://edge-demo-edge-demo-hq.192.168.64.6.nip.io/hello

Expose

    kubectl annotate service/edge-demo skupper.io/proxy=http

Access on Edges

    curl http://edge-demo-edge-demo-station-1.192.168.64.6.nip.io/hello
