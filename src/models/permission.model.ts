
class Permission {
    name: string;
    description: string;
    action: string;
    resource: string;
    allowedRoles: string[];

    constructor(name: string, description: string, action: string, resource: string, allowedRoles: string[]) {
        this.name = name;
        this.description = description;
        this.action = action;
        this.resource = resource;
        this.allowedRoles = allowedRoles;
    }
}

export default Permission;
