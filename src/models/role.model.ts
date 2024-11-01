import Permission from "./permission.model";

class Role {
    id: number;
    name: string;
    description: string;
    permissions: Permission[];

    constructor(id: number, name: string, description: string, permissions: Permission[]) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.permissions = permissions;
    }
}
export default Role;