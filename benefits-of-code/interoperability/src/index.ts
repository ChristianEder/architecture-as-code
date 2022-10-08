import * as fs from 'fs'
import { Container } from 'structurizr-typescript';
import { defineModel } from '../../../available-tools/structurizr/src/model/model';
import { RelationalPerspective, Resource, Workspace } from 'ilograph-typescript';

const structurizrModel = defineModel();

const ilographWorkspace = new Workspace();

structurizrModel.workspace.model.softwareSystems.forEach(system => {
    const systemResource = new Resource({ name: system.name });
    system.containers.forEach(container => {
        const containerResource = new Resource({ name: container.name });
        container.components.forEach(component => {
            const componentResource = new Resource({ name: component.name });
            containerResource.addChild(componentResource);
        });
        systemResource.addChild(containerResource);
    });
    ilographWorkspace.resources.push(systemResource);
});
structurizrModel.workspace.model.people.forEach(p => ilographWorkspace.resources.push(new Resource({ name: p.name })));

const overviewPerspective = new RelationalPerspective({ name: 'Overview', relations: [] });
structurizrModel.workspace.model.relationships
    .filter(r => r.source.type === Container.type && r.destination.type === Container.type)
    .forEach(r => {
        overviewPerspective.properties.relations!.push({ from: r.source.name, to: r.destination.name, label: r.description });
    });
ilographWorkspace.perspectives.push(overviewPerspective);

const dataIngressPerspective = new RelationalPerspective({name: 'Data Ingress'});
structurizrModel.workspace.model.relationships
    .filter(r => r.source.tags.contains('data-ingress') && r.destination.tags.contains('data-ingress') && !r.tags.contains('implied'))
    .forEach(r => {
        dataIngressPerspective.properties.relations!.push({ from: r.source.name, to: r.destination.name, label: r.description });
    });
ilographWorkspace.perspectives.push(dataIngressPerspective);

const workspaceYAML = ilographWorkspace.toYAML();

if (!fs.existsSync('out')) {
    fs.mkdirSync('out');
}
fs.writeFileSync('out/workspace.yaml', workspaceYAML);