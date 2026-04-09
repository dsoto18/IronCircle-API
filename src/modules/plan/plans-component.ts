import { ENTITY, generateUuid, PK, SK } from "../../services/dynamodb-keys";
import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { UserDatastore } from "../user/user-datastore";
import { CreatePlanDTO } from "./DTOs/plan-meta/create-plan.dto";
import { GetPlanMetaDTO } from "./DTOs/plan-meta/get-plan-meta.dto";
import { GetUsersPlansDTO } from "./DTOs/plan-meta/get-users-plans.dto";
import { UpdatePlanMetaDTO } from "./DTOs/plan-meta/update-plan-meta.dto";
import { AddBlockNodeDTO } from "./DTOs/post-nodes/add-block-node.dto";
import { AddDayNodeDTO } from "./DTOs/post-nodes/add-day-node.dto";
import { AddItemNodeDTO } from "./DTOs/post-nodes/add-item-node.dto";
import { AddWeekNodeDTO } from "./DTOs/post-nodes/add-week-node.dto";
import { PlansDatastore } from "./plans-datastore";
import { PlanBlock } from "./types/plan-block";
import { PlanDay } from "./types/plan-day";
import { PlanItem } from "./types/plan-item";
import { PlanMeta } from "./types/plan-meta";
import { PlanWeek } from "./types/plan-week";


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

    public async updatePlanMeta(dto: UpdatePlanMetaDTO){
        const user = await this.userDatastore.getUserById(dto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        const plan = await this.plansDatastore.getPlanMeta(dto.planId);
        if(!plan?.Item){
            throw new ResourceError("Plan Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        if(plan.Item.userId !== dto.userId){
            throw new ResourceError("User Is Not The Owner Of The Plan.", ResourceErrorReason.FORBIDDEN);
        }

        if(plan.Item.status !== "draft"){
            throw new ResourceError("Only Plans In Draft Status Can Be Updated.", ResourceErrorReason.BAD_REQUEST);
        }

        // For now, just allowing updates to the title and description, but can expand this later if needed
        const updatedPlanMeta = {
            planId: dto.planId,
            title: dto.title ?? plan.Item.title,
            description: dto.description ?? plan.Item.description,
            updatedAt: new Date().toISOString()
        }

        return await this.plansDatastore.updatePlanMeta(updatedPlanMeta);
    }

    // ------------ Node Adding Shell Functions - TODO: Possibly add to own file ----------------------------------
    public async addWeekToPlan(dto: AddWeekNodeDTO) {
        const user = await this.userDatastore.getUserById(dto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        const plan = await this.plansDatastore.getPlanMeta(dto.planId);
        if(!plan?.Item){
            throw new ResourceError("Plan Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        if(plan.Item.userId !== dto.userId){
            throw new ResourceError("User Is Not The Owner Of The Plan.", ResourceErrorReason.FORBIDDEN);
        }

        if(plan.Item.status !== "draft"){
            throw new ResourceError("Only Plans In Draft Status Can Be Updated.", ResourceErrorReason.BAD_REQUEST);
        }

        // prep week node body, generate PK and SK with dynamo-keys.ts helper functions
        const currentDate = new Date().toISOString();
        const weekId = 1; // For now, just defaulting to week 1, but will need to implement logic to determine this value based on existing weeks for the plan
        const weekNodeBody: PlanWeek = {
            PK: PK.plan(dto.planId),
            SK: SK.week(weekId.toString()),
            entity: ENTITY.week,
            weekNumber: 1,
            createdAt: currentDate,
            updatedAt: currentDate,
            ...dto
        }

        return await this.plansDatastore.addWeekNodeToPlan(weekNodeBody);
    }

    public async addDayToWeek(dto: AddDayNodeDTO) {
        const user = await this.userDatastore.getUserById(dto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        const plan = await this.plansDatastore.getPlanMeta(dto.planId);
        if(!plan?.Item){
            throw new ResourceError("Plan Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        if(plan.Item.userId !== dto.userId){
            throw new ResourceError("User Is Not The Owner Of The Plan.", ResourceErrorReason.FORBIDDEN);
        }

        if(plan.Item.status !== "draft"){
            throw new ResourceError("Only Plans In Draft Status Can Be Updated.", ResourceErrorReason.BAD_REQUEST);
        }

        // TODO: Get Week and make sure it exists, needs supporting datastore function
        // if !week throw new ResourceError("Week Not Found.", ResourceErrorReason.NOT_FOUND);

        // prep day node body, generate PK and SK with dynamo-keys.ts helper functions
        const currentDate = new Date().toISOString();
        dto.weekNumber = Number(dto.weekNumber); // Should be coming in as a string from the route params, need to convert to a number
        const dayId = 1; // For now, just defaulting to day 1, but will need to implement logic to determine this value based on existing days for the week
        const dayNodeBody: PlanDay = {
            PK: PK.plan(dto.planId),
            SK: SK.day(dto.weekNumber.toString(), dayId.toString()),
            entity: ENTITY.day,
            dayNumber: dayId,
            createdAt: currentDate,
            updatedAt: currentDate,
            ...dto
        }

        return await this.plansDatastore.addDayNodeToWeek(dayNodeBody);
    }

    public async addBlockToDay(dto: AddBlockNodeDTO) {
        const user = await this.userDatastore.getUserById(dto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        const plan = await this.plansDatastore.getPlanMeta(dto.planId);
        if(!plan?.Item){
            throw new ResourceError("Plan Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        if(plan.Item.userId !== dto.userId){
            throw new ResourceError("User Is Not The Owner Of The Plan.", ResourceErrorReason.FORBIDDEN);
        }

        if(plan.Item.status !== "draft"){
            throw new ResourceError("Only Plans In Draft Status Can Be Updated.", ResourceErrorReason.BAD_REQUEST);
        }

        // TODO: Get Day and make sure it exists, needs supporting datastore function
        // if !day throw new ResourceError("Day Not Found.", ResourceErrorReason.NOT_FOUND);
    
        // Check if week exists too if necessary?? Maybe can get everyting under Partition Key as easiest method

        // prep block node body, generate PK and SK with dynamo-keys.ts helper functions
        const currentDate = new Date().toISOString();
        dto.weekNumber = Number(dto.weekNumber); // Should be coming in as a string from the route params, need to convert to a number
        dto.dayNumber = Number(dto.dayNumber);
        const blockId = 1; // For now, just defaulting to block 1, but will need to implement logic to determine this value based on existing blocks for the day
        const blockNodeBody: PlanBlock = {
            PK: PK.plan(dto.planId),
            SK: SK.block(dto.weekNumber.toString(), dto.dayNumber.toString(), blockId.toString()),
            entity: ENTITY.block,
            blockNumber: blockId,
            createdAt: currentDate,
            updatedAt: currentDate,
            ...dto
        }

        return await this.plansDatastore.addBlockNodeToDay(blockNodeBody);
    }

    public async addItemToBlock(dto: AddItemNodeDTO) {
        const user = await this.userDatastore.getUserById(dto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        const plan = await this.plansDatastore.getPlanMeta(dto.planId);
        if(!plan?.Item){
            throw new ResourceError("Plan Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        if(plan.Item.userId !== dto.userId){
            throw new ResourceError("User Is Not The Owner Of The Plan.", ResourceErrorReason.FORBIDDEN);
        }

        if(plan.Item.status !== "draft"){
            throw new ResourceError("Only Plans In Draft Status Can Be Updated.", ResourceErrorReason.BAD_REQUEST);
        }

        // TODO: check week/day/block exists, needs supporting datastore function
        // if !block throw new ResourceError("Block Not Found.", ResourceErrorReason.NOT_FOUND);

        // prep block node body, generate PK and SK with dynamo-keys.ts helper functions
        const currentDate = new Date().toISOString();
        dto.weekNumber = Number(dto.weekNumber); // Should be coming in as a string from the route params, need to convert to a number
        dto.dayNumber = Number(dto.dayNumber);
        dto.blockNumber = Number(dto.blockNumber);
        const itemId = generateUuid();
        const itemNodeBody: PlanItem = {
            PK: PK.plan(dto.planId),
            SK: SK.item(dto.weekNumber.toString(), dto.dayNumber.toString(), dto.blockNumber.toString(), itemId.toString()),
            entity: ENTITY.item,
            itemId: itemId,
            createdAt: currentDate,
            updatedAt: currentDate,
            ...dto
        }

        return await this.plansDatastore.addItemNodeToBlock(itemNodeBody);
    }
}