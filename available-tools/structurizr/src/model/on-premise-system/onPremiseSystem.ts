import { Container, Model } from 'structurizr-typescript';

export function defineOnPremiseSystem(model: Model, machineMetadataTransferStorage: Container) {
    const system = model.addSoftwareSystem('On premise system', 'Used to manage machine metadata')!;

    system.uses(machineMetadataTransferStorage, 'Periodically export machine metadata');

    return { system };
}