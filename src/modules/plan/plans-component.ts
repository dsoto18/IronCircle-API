import { ENTITY } from "../../services/dynamodb-keys";
import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { UserDatastore } from "../user/user-datastore";
import { CreatePlanDTO } from "./DTOs/create-plan.dto";
import { PlansDatastore } from "./plans-datastore";

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

    public async createPlan(dto: CreatePlanDTO) {
        const user = await this.userDatastore.getUserById(dto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        // Maybe check that the title is unique for the user?

        // TODO: Add planPostType for more validation and spread dto body into it while adding other fields
        // const currentDate = new Date().toISOString();
        // const planBody = {
        //     ...dto,
        //     entity: ENTITY.plan,
        //     createdAt: currentDate,
        //     updatedAt: currentDate,
        //     enrollmentCount: 0
        // }

        return await this.plansDatastore.createPlan(dto);
    }
}