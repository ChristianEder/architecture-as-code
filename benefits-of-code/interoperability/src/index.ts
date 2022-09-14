import * as fs from 'fs'
import { Container } from 'structurizr-typescript';
import { defineModel } from '../../../available-tools/structurizr/src/model/model';
import { IlographPerspective, IlographRelation, IlographResource, IlographWorkspace } from './ilograph/ilopgraph';

const structurizrModel = defineModel();

const ilographWorkspace = new IlographWorkspace();

structurizrModel.workspace.model.softwareSystems.forEach(system => {
    const systemResource = new IlographResource(system.name);
    system.containers.forEach(container => {
        const containerResource = new IlographResource(container.name);
        container.components.forEach(component => {
            const componentResource = new IlographResource(component.name);
            containerResource.addChildResource(componentResource);
        });
        systemResource.addChildResource(containerResource);
    });
    ilographWorkspace.addResource(systemResource);
});
structurizrModel.workspace.model.people.forEach(p => ilographWorkspace.addResource(new IlographResource(p.name)));

const overviewPerspective = new IlographPerspective('Overview');
structurizrModel.workspace.model.relationships
    .filter(r => r.source.type === Container.type && r.destination.type === Container.type)
    .forEach(r => {
        overviewPerspective.addRelation(new IlographRelation(r.source.name, r.destination.name, r.description));
});
ilographWorkspace.addPerspective(overviewPerspective);

const dataIngressPerspective = new IlographPerspective('Data Ingress');
structurizrModel.workspace.model.relationships
    .filter(r => r.source.tags.contains('data-ingress') && r.destination.tags.contains('data-ingress') && !r.tags.contains('implied'))
    .forEach(r => {
        dataIngressPerspective.addRelation(new IlographRelation(r.source.name, r.destination.name, r.description));
});
ilographWorkspace.addPerspective(dataIngressPerspective);

const workspaceYAML = ilographWorkspace.toYAML();

if (!fs.existsSync('out')) {
    fs.mkdirSync('out');
}
fs.writeFileSync('out/workspace.yaml', workspaceYAML);