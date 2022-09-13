# Ilograph

[Ilograph](https://www.ilograph.com/) is a tool that allows us to model our architecture as a hierarchy of components, and then create diagrams showing different perspectives on this model. Both the model and the perspectives are written in YAMl:

```yaml
resources:
- name: Users
  subtitle: Users of the system
  color: Gray
  style: plural
  icon: Networking/user.svg

- name: Plant
  subtitle: Factory floor
  children: 
  - name: Machine
    subtitle: Machine PLC
    icon: Networking/server.svg
  - name: Gateway
    subtitle: Azure IoT Edge Gateway
    icon: Azure/Internet of Things/Azure IoT Hub.svg
    
- name: Cloud
  subtitle: Azure
  children: 
  - name: Azure IoT Hub
    icon: Azure/Internet of Things/Azure IoT Hub.svg
  - name: Azure Device Provisioning Service
    icon: Azure/Internet of Things/Device Provisioning Services.svg
  - name: Ingress queue
    icon: Azure/Integration/Azure Service Bus.svg
  - name: Backend
    icon: Azure/Web/App Services.svg
    children: 
    - name: Ingress Queue Client
    - name: Machine Orleans Grain
    - name: OEE KPI Aggregator
    - name: Entity Framework DB Context
  - name: Dashboard
    icon: Networking/browser-search.svg
  - name: OEE Database
    icon: Azure/Databases/Azure Database for PostgreSQL servers.svg
  - name: Timeseries Database
    icon: Azure/Internet of Things/Time Series Insights environments.svg
  - name: Azure Active Directory
    icon: Azure/Identity/Active Directory.svg
  - name: Machine metadata transfer storage
    icon: Azure/Storage/Blob Storage.svg
- name: On premise system
  icon: Networking/server.svg
- name: Gateway Provisioning environment
  icon: Networking/server.svg

  
perspectives:
- name: Overview
  relations:
  - from: Machine
    to: Gateway
    label: Read data every 10 seconds
    arrowDirection: backward
  - from: Gateway
    to: Azure IoT Hub
    label: Forward data every 60 seconds
  - from: Azure IoT Hub
    to: Ingress queue
    label: Forward enriched messages
  - from: Backend
    to: Ingress queue
    label: Process messages
  - from: Backend
    to: OEE Database
    label: Read and write aggregated OEE data
  - from: Backend
    to: Timeseries Database
    label: Read and write raw telemetry messages
  - from: Dashboard
    to: Backend
    label: GET aggregated OEE data via GraphQL API
  - from: Users
    to: Dashboard
    label: View OEE data for machines
  - from: Users
    to: Azure Active Directory
    label: Authenticate
  - from: On premise system
    to: Machine metadata transfer storage
    label: Periodically export machine metadata
  - from: Backend
    to: Machine metadata transfer storage
    label: Periodically import machine metadata
  - from: Gateway
    to: Azure Device Provisioning Service
    label: Provision on startup
  - from: Azure Device Provisioning Service
    to: Azure IoT Hub
    label: Provision gateway device
    
- name: Gateway provisioning
  sequence: 
    start: Gateway Provisioning environment
    steps: 
    - toAndBack: Gateway
      label: Force regenerate certificate, read public cert
    - toAndBack: Azure Device Provisioning Service
      label: Enroll gateway device using public cert
    - restartAt: Gateway
    - to: Azure Device Provisioning Service
      label: Authenticate using cert and private key
    - toAndBack: Azure IoT Hub
      label: Create device
    - to: Gateway
      label: Connection credentials of IoT Hub
    - restartAt: Gateway Provisioning environment
    - to: Azure IoT Hub
      label: Configure modules to run on gateway
    - restartAt: Gateway
    - to: Azure IoT Hub
      label: Connect, Get module configuration 
      
- name: Data ingress
  relations:
  - from: Machine
    to: Gateway
    label: Read data every 10 seconds
    arrowDirection: backward
  - from: Gateway
    to: Azure IoT Hub
    label: Forward data every 60 seconds
  - from: Azure IoT Hub
    to: Ingress queue
    label: Forward enriched messages
  - from: Ingress Queue Client
    to: Ingress queue
    label: Process messages using PeekLock
  - from: Ingress Queue Client
    to: Machine Orleans Grain
    label: Forward received message
  - from: Machine Orleans Grain
    to: OEE KPI Aggregator
    label: Ingest message into aggregator, providing aggregation state
  - from: OEE KPI Aggregator
    to: Entity Framework DB Context
    label: Upsert aggregated KPIs for machine
  - from: Entity Framework DB Context
    to: OEE Database
    label: Upsert aggregated KPIs for machine
```

The perspectives (so, diagrams) generated from this YAML are interactive - you can add icons, the user can select and focus on different parts of each diagram (please note the animation shown below doesn't represent the same YAML shown above, the diagrams shown above can be explored [here](https://app.ilograph.com/@christian.eder/Architecture-As-Code-Ilograph-Sample/Overview)):

![](https://www.ilograph.com/blog/img/feature-spotlight-perspectives/three.gif)
