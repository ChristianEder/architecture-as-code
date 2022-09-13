import { CreateImpliedRelationshipsUnlessAnyRelationshipExistsStrategy, Workspace } from 'structurizr-typescript';
import { defineCloudSystem } from './cloud/cloudSystem';
import { defineFactoryFloorSystem } from './factory-floor/factoryFloorSystem';
import { defineGatewayProvisioningEnvironment as defineGatewayProvisioningEnvironmentSystem } from './gateway-provisioning-environment/gatewayProvisioningEnvironment';
import { defineOnPremiseSystem } from './on-premise-system/onPremiseSystem';

export function defineModel() {
    const workspace = new Workspace('Architecture as code example workspace', 'Describes the architecture of a fictious IoT system');
    workspace.model.impliedRelationshipsStrategy = new CreateImpliedRelationshipsUnlessAnyRelationshipExistsStrategy();

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