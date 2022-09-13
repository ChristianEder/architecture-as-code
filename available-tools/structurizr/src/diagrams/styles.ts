import { ElementStyle, Shape, Tags, Workspace } from "structurizr-typescript";

export function defineStyling(workspace: Workspace) {
    renderTagAsShape(workspace, Tags.Person, Shape.Person);
    renderTagAsShape(workspace, 'queue', Shape.Pipe);
    renderTagAsShape(workspace, 'database', Shape.Cylinder);

    renderTagWithColor(workspace, Tags.Container, "#ACF39D");
    renderTagWithColor(workspace, Tags.Component, "#ACF39D");
    renderTagWithColor(workspace, 'azure-component', "#CCCCCC");
}

function renderTagAsShape(workspace: Workspace, tag: string, shape: Shape) {
    const style = new ElementStyle(tag);
    style.shape = shape;
    workspace.views.configuration.styles.addElementStyle(style);
}

function renderTagWithColor(workspace: Workspace, tag: string, color: string) {
    const style = new ElementStyle(tag);
    style.background = color;
    workspace.views.configuration.styles.addElementStyle(style);
}