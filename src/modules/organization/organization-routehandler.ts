import { Router, Request, Response } from "express";

export class OrganizationRoutehandler {
    public static build(): Router {
        const router = Router();

        router.get("/organizations", this.getOrgs);
        router.get("/organization/:orgId", this.getOrganization);
        router.post("/organization", this.createOrganization);
        router.patch("/organization/:orgId", this.updateOrg);
        router.delete("/organization/:orgId", this.deleteOrg);
        router.patch("/organizations/:orgId/users/:userId", this.addUserToOrg);
        router.delete("/organizations/:orgId/users/:userId", this.removeUserFromOrg);
        router.patch("/organizations/:orgId/admin/:userId/", this.editAdminPrivileges)

        return router;
    }

    public static getOrgs(req: Request, res: Response) {
        return res.json({ message: "Get Orgs"});
    }

    public static getOrganization(req: Request, res: Response) {
        return res.json({ message: "Get Organization"});
    }

    public static createOrganization(req: Request, res: Response) {
        return res.json({ message: "Create Organization"});
    }

    public static updateOrg(req: Request, res: Response) {
        return res.json({ message: "Update Organization"});
    }

    public static deleteOrg(req: Request, res: Response) {
        return res.json({ message: "Delete Organization"});
    }

    public static addUserToOrg(req: Request, res: Response) {
        return res.json({ message: "Add User To Organization"});
    }

    public static removeUserFromOrg(req: Request, res: Response) {
        return res.json({ message: "Remove User From Organization"});
    }

    public static editAdminPrivileges(req: Request, res: Response) {
        return res.json({ message: "Edited Admins For Organization"});
    }
}