Create namespaces

    kubectl create namespace edge-demo-hq
    kubectl create namespace edge-demo-station-1
    kubectl create namespace edge-demo-station-2

Shell tools

    export KUBECONFIG=config/context/config-hq
    export KUBECONFIG=config/context/config-station-1
    export KUBECONFIG=config/context/config-station-2

Skupper create

    skupper init

On HQ

    skupper connection-token token.yaml

On Edges

    skupper connect token.yaml

Develop and test services

    cd charger-service
    ./mvnw compile quarkus:dev -Dquarkus.http.port=8100

    cd station-service
    ./mvnw compile quarkus:dev -Ddejanb.ChargingService/mp-rest/url=http://localhost:8100


    curl -i -X GET http://0.0.0.0:8080/station/available
    curl -i -X POST http://0.0.0.0:8100/charger/start/1

Build services

    mvn package -DskipTests
    
    docker build -f charger-service/src/main/docker/Dockerfile.jvm -t edge-demo/charger-service:1.0.0-SNAPSHOT charger-service
    
    docker build -f station-service/src/main/docker/Dockerfile.jvm -t edge-demo/station-service:1.0.0-SNAPSHOT station-service

Deploy Station 1

    oc apply -f config/templates/charger.yml
    oc expose service charger

    oc apply -f config/templates/station-1.yml
    oc expose service station1 

Deploy Station 2

    oc apply -f config/templates/charger.yml
    oc expose service charger

    oc apply -f config/templates/station-2.yml
    oc expose service station2


Test local on Station 1

    curl -i -X GET http://station1-edge-demo-station-1.192.168.64.6.nip.io/station/available
    curl -i -X POST http://charger-edge-demo-station-1.192.168.64.6.nip.io/charger/start/1

Test local on Station 2
    
    curl -i -X POST http://charger-edge-demo-station-2.192.168.64.6.nip.io/charger/start/1
    curl -i -X GET http://station2-edge-demo-station-2.192.168.64.6.nip.io/station/available 

Expose Station 1

    kubectl annotate service/station1 skupper.io/proxy=http    

Expose Station 2
    
    kubectl annotate service/station2 skupper.io/proxy=http
    
    
Test exposed on Station 1

    oc expose service station2
    curl -i -X GET http://station2-edge-demo-station-1.192.168.64.6.nip.io/station/available
    curl -i -X POST http://charger-edge-demo-station-2.192.168.64.6.nip.io/charger/start/2 
    
Test exposed on Station 2           
    
    oc expose service station1
    curl -i -X GET http://station1-edge-demo-station-1.192.168.64.6.nip.io/station/available
    curl -i -X POST http://charger-edge-demo-station-1.192.168.64.6.nip.io/charger/start/2   
