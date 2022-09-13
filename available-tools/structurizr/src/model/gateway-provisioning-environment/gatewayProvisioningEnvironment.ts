import { Container, Model } from 'structurizr-typescript';

export function defineGatewayProvisioningEnvironment(model: Model, gateway: Container, dps: Container, iotHub: Container) {
    const system = model.addSoftwareSystem('Gateway provisioning environment', '')!;
    system.tags.add('gateway-provisioning');

    system.uses(gateway, 'Force regenerate certificate, read public cert')!;
    system.uses(dps, 'Enroll gateway device using public cert')!;
    system.uses(iotHub, 'Configure modules to run on gateway');

    return { system };
}