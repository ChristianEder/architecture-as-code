export class IlographWorkspace {
    public resources: IlographResource[] = [];
    public perspectives: IlographPerspective[] = [];

    public addResource(resource: IlographResource) {
        this.resources.push(resource);
    }

    public addPerspective(perspective: IlographPerspective) {
        this.perspectives.push(perspective);
    }

    public toYAML(): string {
        let yaml = '';

        if (this.resources.length > 0) {
            yaml += 'resources:';

            this.resources.forEach(r => {
                yaml += '\n' + this.resourceYAML(r, 0);
            });
        }

        if (this.perspectives.length > 0) {
            yaml += '\n\nperspectives:';

            this.perspectives.forEach(p => {
                yaml += '\n- name: ' + p.name;
                yaml += '\n  relations:'

                p.relations.forEach(r => {
                    yaml += '\n  - from: ' + r.from;
                    yaml += '\n    to: ' + r.to;
                    yaml += '\n    label: ' + r.label;
                });
            });
        }

        return yaml;
    }


    private resourceYAML(resource: IlographResource, level: number): string {
        const indentation = ''.padStart(level * 2, ' ');
        let yaml = indentation + '- name: ' + resource.name;

        if (resource.children.length > 0) {
            yaml += '\n' + indentation + '  children: ';

            resource.children.forEach(c => {
                yaml += '\n' + this.resourceYAML(c, level + 1);
            });
        }

        return yaml;
    }
}

export class IlographResource {
    constructor(public name: string, public children: IlographResource[] = []) {
    }

    public addChildResource(resource: IlographResource) {
        this.children.push(resource);
    }
}

export class IlographPerspective {
    constructor(public name: string, public relations: IlographRelation[] = []) {
    }

    public addRelation(relation: IlographRelation) {
        this.relations.push(relation);
    }
}

export class IlographRelation {
    constructor(public from: string, public to: string, public label: string) {
    }
}

