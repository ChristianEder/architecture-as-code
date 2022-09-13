import { Container, Model, Person, SoftwareSystem } from 'structurizr-typescript';

export function defineCloudSystem(model: Model, user: Person) {
    const system = model.addSoftwareSystem('Cloud', 'Azure')!;

    const iotHub = system.addContainer('Azure IoT Hub', 'Cloud side message broker and gateway device management system', 'Azure IoT Hub')!;
    iotHub.tags.add('data-ingress');
    iotHub.tags.add('gateway-provisioning');
    iotHub.tags.add('azure-component');

    const dps = system.addContainer('Azure Device Provisioning Service', 'Used to provision gateway devices to IoT Hub', 'Azure Device Provisioning Service')!;
    dps.tags.add('gateway-provisioning');
    dps.tags.add('azure-component');

    const ingressQueue = system.addContainer('Ingress queue', 'Allows transactional processing of machine telemetry', 'Azure Servive Bus Queue')!;
    ingressQueue.tags.add('queue');
    ingressQueue.tags.add('data-ingress');
    ingressQueue.tags.add('azure-component');

    const oeeDatabase = system.addContainer('OEE database', 'Used to persist aggregated OEE data', 'PostreSQL')!;
    oeeDatabase.tags.add('database');
    oeeDatabase.tags.add('data-ingress');
    oeeDatabase.tags.add('azure-component');

    const timeseriesDatabase = system.addContainer('Timeseries database', 'Used to persist raw machine telemetry', 'Azure TimeSeries Insight')!;
    timeseriesDatabase.tags.add('database');
    timeseriesDatabase.tags.add('data-ingress');
    timeseriesDatabase.tags.add('azure-component');

    const activeDirectory = system.addContainer('Azure Active Directory', 'Used to implement user authentication', 'Azure Active Directory')!;
    activeDirectory.tags.add('azure-component');

    const machineMetadataTransferStorage = system.addContainer('Machine metadata transfer storage', 'Data transfer storage used to export and import machine metadata', 'Azure Blob Storage')!;
    machineMetadataTransferStorage.tags.add('database');
    machineMetadataTransferStorage.tags.add('azure-component');

    const dashboard = system.addContainer('Dashboard', 'Visualizes OEE data and machine telemetry time series data', 'React')!;

    const backend = defineBackendContainer(system, ingressQueue, oeeDatabase, timeseriesDatabase, machineMetadataTransferStorage);

    dps.uses(iotHub, 'Create device');
    iotHub.uses(ingressQueue, 'Forward enriched messages');
    dashboard.uses(backend.container, 'GET aggregated OEE data via GraphQL API');
    user.uses(dashboard, 'View OEE data for machines');
    user.uses(activeDirectory, 'Authenticate');

    return {
        system,
        containers: {
            iotHub,
            dps,
            ingressQueue,
            oeeDatabase,
            timeseriesDatabase,
            activeDirectory,
            machineMetadataTransferStorage,
            dashboard,
            backend
        }
    };
}

function defineBackendContainer(system: SoftwareSystem, ingressQueue: Container, oeeDatabase: Container, timeseriesDatabase: Container, machineMetadataTransferStorage: Container) {
    const container = system.addContainer('Backend', 'Implements OEE data aggegration and provides an API used by the dashboard', 'ASP.NET Core hosted on Azure App Service')!

    const ingressQueueClient = container.addComponent('Ingress Queue Client', 'Processes messages from the ingress queue')!;
    ingressQueueClient.tags.add('data-ingress');

    const machineOrleansGrain = container.addComponent('Machine Orleans grain', 'Implements message processing logic per machine')!;
    machineOrleansGrain.tags.add('data-ingress');

    const oeeKpiAggregator = container.addComponent('OEE KPI Aggregator', 'Implements stateful KPI aggregation based on telemetry messages flowing in')!;
    oeeKpiAggregator.tags.add('data-ingress');

    const dbContext = container.addComponent('Entity Framework DB Context', 'Implements upserting of OEE data into the database')!;
    dbContext.tags.add('data-ingress');

    container.uses(machineMetadataTransferStorage, 'Periodically import machine metadata');
    ingressQueueClient.uses(ingressQueue, 'Process messages using PeekLock');
    ingressQueueClient.uses(timeseriesDatabase, 'Persist messages');
    ingressQueueClient.uses(machineOrleansGrain, 'Forward received message');
    machineOrleansGrain.uses(oeeKpiAggregator, 'Ingest message into aggregator, providing aggregation state');
    oeeKpiAggregator.uses(dbContext, 'Upsert aggregated KPIs for machine');
    dbContext.uses(oeeDatabase, 'Upsert aggregated KPIs for machine');

    return {
        container,
        ingressQueueClient,
        machineOrleansGrain,
        oeeKpiAggregator,
        dbContext
    }
}
