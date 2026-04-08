import { ENTITY, generateUuid, PK, SK } from "../../services/dynamodb-keys";
import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { UserDatastore } from "../user/user-datastore";
import { CreatePlanDTO } from "./DTOs/create-plan.dto";
import { GetPlanMetaDTO } from "./DTOs/get-plan-meta.dto";
import { GetUsersPlansDTO } from "./DTOs/get-users-plans.dto";
import { PlansDatastore } from "./plans-datastore";
import { PlanMeta } from "./types/plan-meta";


// Implemented a different pattern here, preparting the body in the component layer and passing down to the datastore,
// but could also do this in the datastore layer. Just a design choice, but I think it makes more sense to do it here
// since we can keep the datastore more focused on just db interactions and not have to worry about generating things
// like PK/SK values or timestamps which are more of a business logic concern.
export class PlansComponent {
    constructor(
        private userDatastore: UserDatastore,
        private plansDatastore: PlansDatastore
    ) {}

    public static build(): PlansComponent {
        const userDatastore = UserDatastore.build();
        const plansDatastore = PlansDatastore.build();
        return new PlansComponent(userDatastore, plansDatastore);
    }

    public async createPlanShell(dto: CreatePlanDTO) {
        const user = await this.userDatastore.getUserById(dto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        // Maybe check that the title is unique for the user?

        // prep plan body to conform to PlanMeta type, generate PK and SK with dynamo-keys.ts helper functions
        const currentDate = new Date().toISOString();
        const planId = generateUuid();
        const planBody: PlanMeta = {
            ...dto,
            PK: PK.plan(planId),
            SK: "META",
            planId: planId,
            status: "draft",
            entity: ENTITY.plan,
            createdAt: currentDate,
            updatedAt: currentDate,
            enrollmentCount: 0
        }

        const userReference = {
            PK: PK.user(dto.userId),
            SK: SK.plan(currentDate, planId),
            entity: ENTITY.userPlan,
            planId: planId,
            userId: dto.userId,
            createdAt: currentDate
        }

        return await this.plansDatastore.createPlanShellAndRef(planBody, userReference);
    }

    public async getUsersPlans(dto: GetUsersPlansDTO){
        const user = await this.userDatastore.getUserById(dto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }
        return await this.plansDatastore.getUsersPlans(dto.userId);
    }

    public async getPlanMeta(dto: GetPlanMetaDTO) {
        const plan = await this.plansDatastore.getPlanMeta(dto.planId);
        if(!plan?.Item){
            throw new ResourceError("Plan Not Found.", ResourceErrorReason.NOT_FOUND);
        }
        return plan;
    }
}