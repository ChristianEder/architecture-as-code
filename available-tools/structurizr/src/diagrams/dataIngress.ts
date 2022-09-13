import { Container, Workspace } from 'structurizr-typescript';

export function defineDataIngressDiagram(workspace: Workspace, backend: Container) {
    const diagram = workspace.views.createComponentView(backend, 'Data Ingress', 'Shows all components related to data ingress');

    workspace.model.softwareSystems.filter(s => s.tags.contains('data-ingress')).forEach(s => diagram.addSoftwareSystem(s));
    
    backend.components.filter(c => c.tags.contains('data-ingress')).forEach(c => {
        diagram.addComponent(c);
        diagram.addNearestNeighbours(c);
    });

    return { diagram };
}