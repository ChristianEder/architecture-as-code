import { AbstractImpliedRelationshipsStrategy, Relationship, Workspace, Element } from 'structurizr-typescript';
import { defineCloudSystem } from './cloud/cloudSystem';
import { defineFactoryFloorSystem } from './factory-floor/factoryFloorSystem';
import { defineGatewayProvisioningEnvironment as defineGatewayProvisioningEnvironmentSystem } from './gateway-provisioning-environment/gatewayProvisioningEnvironment';
import { defineOnPremiseSystem } from './on-premise-system/onPremiseSystem';

export function defineModel() {
    const workspace = new Workspace('Architecture as code example workspace', 'Describes the architecture of a fictious IoT system');
    workspace.model.impliedRelationshipsStrategy = new CreateTaggedImpliedRelationshipsUnlessAnyRelationshipExistsStrategy();

    const user = workspace.model.addPerson('User', 'Users of the system')!;

    const cloud = defineCloudSystem(workspace.model, user);
    const onPremiseSystem = defineOnPremiseSystem(workspace.model, cloud.containers.machineMetadataTransferStorage);
    const factoryFloor = defineFactoryFloorSystem(workspace.model, cloud.containers.iotHub, cloud.containers.dps);
    const gatewayProvisioningEnvironment = defineGatewayProvisioningEnvironmentSystem(workspace.model, factoryFloor.gateway, cloud.containers.dps, cloud.containers.iotHub);

    return {
        workspace,
        people: {
            user
        },
        systems: {
            cloud,
            onPremiseSystem,
            factoryFloor,
            gatewayProvisioningEnvironment
        }
    };
}

export class CreateTaggedImpliedRelationshipsUnlessAnyRelationshipExistsStrategy extends AbstractImpliedRelationshipsStrategy {

    createImpliedRelationships(relationship: Relationship): void {
        let source: Element | null = relationship.source;
        let destination: Element | null = relationship.destination;

        const model = source.model;

        while (source) {
            while (destination) {
                if (this.impliedRelationshipIsAllowed(source, destination)) {
                    const createRelationship = !source.relationships.getEfferentRelationshipWith(destination);

                    if (createRelationship) {
                        const newRelationship = model.addRelationship(source, destination, relationship.description, relationship.technology, relationship.interactionStlye, false)!;
                        relationship.tags.asArray().forEach(t => newRelationship.tags.add(t));
                        newRelationship.tags.add('implied');
                    }
                }

                destination = destination.parent;
            }

            destination = relationship.destination;
            source = source.parent;
        }
    }
}