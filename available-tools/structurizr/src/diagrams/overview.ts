import { SoftwareSystem, Workspace } from 'structurizr-typescript';

export function defineOverviewDiagram(workspace: Workspace, cloudSystem: SoftwareSystem) {
    const diagram = workspace.views.createContainerView(cloudSystem, 'Overview', 'Shows all related components');

    diagram.addAllSoftwareSystems();
    diagram.addAllContainers();
    diagram.addAllPeople();
}