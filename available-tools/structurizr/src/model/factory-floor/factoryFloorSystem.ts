import { Container, Model } from 'structurizr-typescript';

export function defineFactoryFloorSystem(model: Model, iotHub: Container, dps: Container) {
    const system = model.addSoftwareSystem('Factory Floor', '')!;
    system.tags.add('data-ingress');

    const machinePLC = system.addContainer('Machine PLC', 'PLC controlling a machine', 'Siemens S7')!;
    machinePLC.tags.add('data-ingress');

    const gateway = system.addContainer('Gateway', 'Reads machine state information from the machine, preprocesses it and forwards that to the cloud', 'Azure IoT Edge')!;
    gateway.tags.add('gateway-provisioning');
    gateway.tags.add('data-ingress');

    gateway.uses(machinePLC, 'Read machine state every 10 seconds');

    gateway.uses(dps, 'Authenticate using cert and private key, retrieve connection credentials of IoT Hub');
    gateway.uses(iotHub, 'Forward data every 60 seconds, get module configuration');

    return {
        system,
        machinePLC,
        gateway
    }
}