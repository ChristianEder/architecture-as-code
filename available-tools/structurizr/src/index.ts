import { Workspace } from 'structurizr-typescript';
import * as fs from 'fs'
import { defineOverviewDiagram } from './diagrams/overview';
import { defineModel } from './model/model';
import { defineStyling } from './diagrams/styles';
import { defineDataIngressDiagram } from './diagrams/dataIngress';

const model = defineModel();
defineOverviewDiagram(model.workspace, model.systems.cloud.system);
defineDataIngressDiagram(model.workspace, model.systems.cloud.containers.backend.container);

defineStyling(model.workspace);

if (fs.existsSync('out/workspace.json')) {
    const existingWorkspaceJSON = fs.readFileSync('out/workspace.json').toString();
    const existingWorkspace = new Workspace('', '');
    existingWorkspace.fromDto(JSON.parse(existingWorkspaceJSON));
    existingWorkspace.hydrate();
    model.workspace.views.copyLayoutInformationFrom(existingWorkspace.views);
}

const workspaceJSON = JSON.stringify(model.workspace.toDto());

if (!fs.existsSync('out')) {
    fs.mkdirSync('out');
}
fs.writeFileSync('out/workspace.json', workspaceJSON);