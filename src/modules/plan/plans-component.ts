import { ENTITY, generateUuid, PK, SK } from "../../services/dynamodb-keys";
import { ResourceError, ResourceErrorReason } from "../../shared/error";
import { UserDatastore } from "../user/user-datastore";
import { UpdateWeekNodeDTO } from "./DTOs/patch-nodes/update-week-node.dto";
import { GetBrowsablePlansDTO } from "./DTOs/plan-meta/browse-plans.dto";
import { CreatePlanDTO } from "./DTOs/plan-meta/create-plan.dto";
import { GetPlanMetaDTO } from "./DTOs/plan-meta/get-plan-meta.dto";
import { GetUsersPlansDTO } from "./DTOs/plan-meta/get-users-plans.dto";
import { UpdatePlanMetaDTO } from "./DTOs/plan-meta/update-plan-meta.dto";
import { AddBlockNodeDTO } from "./DTOs/post-nodes/add-block-node.dto";
import { AddDayNodeDTO } from "./DTOs/post-nodes/add-day-node.dto";
import { AddItemNodeDTO } from "./DTOs/post-nodes/add-item-node.dto";
import { AddWeekNodeDTO } from "./DTOs/post-nodes/add-week-node.dto";
import { PublishPlanDTO } from "./DTOs/publish.dto";
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

    public async getBrowsablePlans(dto: GetBrowsablePlansDTO) {
        const limit = dto.limit && dto.limit > 0 ? Math.min(dto.limit, 50) : 20; // default to 20 if not provided, max 50

        const result = await this.plansDatastore.getBrowsablePlans({
            limit,
            cursor: dto.cursor,
        });

        let plans = result?.items;

        // optional in-memory filtering for now
        if (dto.type) {
            plans = plans.filter((plan: any) => plan.type === dto.type);
        }

        if (dto.goal) {
            plans = plans.filter((plan: any) => plan.goal === dto.goal);
        }

        if (dto.difficulty) {
            plans = plans.filter((plan: any) => plan.difficulty === dto.difficulty);
        }

        return {
            plans: plans.map((plan: any) => ({
                planId: plan.planId,
                userId: plan.userId,
                creator: plan.creator,
                title: plan.title,
                summary: plan.summary,
                goal: plan.goal,
                difficulty: plan.difficulty,
                durationWeeks: plan.durationWeeks,
                type: plan.type,
                tags: plan.tags,
                coverImageUrl: plan.coverImageUrl,
                createdAt: plan.createdAt,
                updatedAt: plan.updatedAt,
            })),
            cursor: result.cursor,
        };
    }

    public async createPlanShell(dto: CreatePlanDTO) {
        console.log("Creating plan shell with DTO:", dto);
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
            creator: user?.Item.username,
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
            title: dto.title,
            status: "draft",
            createdAt: currentDate
        }

        await this.plansDatastore.createPlanShellAndRef(planBody, userReference);

        return planBody;
    }

    public async getUsersPlans(dto: GetUsersPlansDTO){
        // might as well do this check since we have an id from url params, and the token
        if(dto.tokenUser !== dto.userId){
            throw new ResourceError("User ID In Token Does Not Match User ID In Request.", ResourceErrorReason.FORBIDDEN);
        }
        const user = await this.userDatastore.getUserById(dto.userId);
        if(!user?.Item){
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }
        return await this.plansDatastore.getUsersPlans(dto.userId);
    }

    public async getFullPlan(dto: GetPlanMetaDTO){
        const plan = await this.plansDatastore.getFullPlan(dto.planId);
        if(!plan?.Items || plan.Items.length === 0){
            throw new ResourceError("Plan Not Found.", ResourceErrorReason.NOT_FOUND);
        }
        return plan;
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

    // Publish Plan
    public async publishPlan(dto: PublishPlanDTO) {
        const user = await this.userDatastore.getUserById(dto.userId);
        if (!user?.Item) {
            throw new ResourceError("User Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        const plan = await this.plansDatastore.getPlanMeta(dto.planId);
        if (!plan?.Item) {
            throw new ResourceError("Plan Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        if (plan.Item.userId !== dto.userId) {
            throw new ResourceError("User Is Not The Owner Of The Plan.", ResourceErrorReason.FORBIDDEN);
        }

        if (plan.Item.status !== "draft") {
            throw new ResourceError("Only Draft Plans Can Be Published.", ResourceErrorReason.BAD_REQUEST);
        }

        const now = new Date().toISOString();

        await this.plansDatastore.publishUserPlanReference(dto.userId, dto.planId, dto.createdAt);

        return await this.plansDatastore.publishPlanMeta(dto.planId, {
            status: "published",
            publishedAt: now,
            updatedAt: now,
            GSI1PK: "PLANS",
            GSI1SK: `PUBLISHED#${now}#${dto.planId}`,
        });
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
        const weekNumber = await this.getNextWeekNumber(dto.planId);
        const weekNodeBody: PlanWeek = {
            PK: PK.plan(dto.planId),
            SK: SK.week(weekNumber.toString()),
            entity: ENTITY.week,
            weekNumber: weekNumber,
            createdAt: currentDate,
            updatedAt: currentDate,
            ...dto
        }

        await this.plansDatastore.addWeekNodeToPlan(weekNodeBody);

        return weekNodeBody;
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

        // Check for and verify immediate parent, no need to verify whole ancestor chain
        const week = await this.plansDatastore.getWeekNode(dto.planId, dto.weekNumber.toString())
        if(!week?.Item){
            throw new ResourceError("Week Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        // prep day node body, generate PK and SK with dynamo-keys.ts helper functions
        const currentDate = new Date().toISOString();
        // TODO: I can move this conversion in the router/dto layer since its formatting concern
        dto.weekNumber = Number(dto.weekNumber); // Should be coming in as a string from the route params, need to convert to a number
        // const dayId = 1; // For now, just defaulting to day 1, but will need to implement logic to determine this value based on existing days for the week
        const dayId = await this.getNextDayNumber(dto.planId, dto.weekNumber);
        const dayNodeBody: PlanDay = {
            PK: PK.plan(dto.planId),
            SK: SK.day(dto.weekNumber.toString(), dayId.toString()),
            entity: ENTITY.day,
            dayNumber: dayId,
            createdAt: currentDate,
            updatedAt: currentDate,
            ...dto
        }

        await this.plansDatastore.addDayNodeToWeek(dayNodeBody);
        return dayNodeBody;
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

        // Check Day exists
        const day = await this.plansDatastore.getDayNode(dto.planId, dto.weekNumber.toString(), dto.dayNumber.toString())
        if(!day?.Item){
            throw new ResourceError("Day Not Found.", ResourceErrorReason.NOT_FOUND);
        }

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

        await this.plansDatastore.addBlockNodeToDay(blockNodeBody);
        return blockNodeBody;
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

        const block = await this.plansDatastore.getBlockNode(
            dto.planId,
            dto.weekNumber.toString(),
            dto.dayNumber.toString(),
            dto.blockNumber.toString()
        );
        if(!block?.Item){
            throw new ResourceError("Block Not Found.", ResourceErrorReason.NOT_FOUND);
        }

        // prep block node body, generate PK and SK with dynamo-keys.ts helper functions
        const currentDate = new Date().toISOString();
        dto.weekNumber = Number(dto.weekNumber); // Should be coming in as a string from the route params, need to convert to a number
        dto.dayNumber = Number(dto.dayNumber);
        dto.blockNumber = Number(dto.blockNumber);
        const itemNodeBody: PlanItem = {
            PK: PK.plan(dto.planId),
            SK: SK.item(dto.weekNumber.toString(), dto.dayNumber.toString(), dto.blockNumber.toString(), dto.order.toString()),
            entity: ENTITY.item,
            createdAt: currentDate,
            updatedAt: currentDate,
            ...dto
        }

        await this.plansDatastore.addItemNodeToBlock(itemNodeBody);
        return itemNodeBody;
    }

    // ------------------------- End Node Adding Shell Functions ----------------------------------

    // ----------------------------- Node Updating Functions --------------------------------------
    public async updateWeek(dto: UpdateWeekNodeDTO){

    }

    // SPECIFIC NODE HELPER FUNCTIONS TO RETRIEVE LATEST RECORDS
    // Get Next Week Number
    public async getNextWeekNumber(planId: string): Promise<number> {
        const weeks = await this.plansDatastore.getSiblingNodesByPrefix<PlanWeek>({
            planId,
            skPrefix: 'WEEK#',
            entity: ENTITY.week,
        });

        if (weeks.length === 0) return 1;

        const maxWeekNumber = Math.max(...weeks.map((w) => w.weekNumber));
        return maxWeekNumber + 1;
    }

    // Get Next Day Number
    public async getNextDayNumber(planId: string, weekNumber: number): Promise<number> {
        const weekKey = SK.week(weekNumber.toString()); // e.g. WEEK#01

        const days = await this.plansDatastore.getSiblingNodesByPrefix<PlanDay>({
            planId,
            skPrefix: `${weekKey}DAY#`,
            entity: ENTITY.day,
        });

        if (days.length === 0) return 1;

        const maxDayNumber = Math.max(...days.map((d) => d.dayNumber));
        return maxDayNumber + 1;
    }

    // Get Next Block Number
    public async getNextBlockNumber(planId: string, weekNumber: number, dayNumber: number): Promise<number> {
        const weekKey = SK.week(weekNumber.toString());
        const dayKey = SK.day(weekNumber.toString(), dayNumber.toString());

        const blocks = await this.plansDatastore.getSiblingNodesByPrefix<PlanBlock>({
            planId,
            skPrefix: `${weekKey}#${dayKey}#BLOCK#`,
            entity: ENTITY.block,
        });

        if (blocks.length === 0) return 1;

        const maxBlockNumber = Math.max(...blocks.map((b) => b.blockNumber));
        return maxBlockNumber + 1;
    }

    // Get Next Item Order Number
    public async getNextItemOrder(planId: string, weekNumber: number, dayNumber: number, blockNumber: number): Promise<number> {
        const weekKey = SK.week(weekNumber.toString());
        const dayKey = SK.day(weekNumber.toString(), dayNumber.toString());
        const blockKey = SK.block(weekNumber.toString(), dayNumber.toString(), blockNumber.toString());

        const items = await this.plansDatastore.getSiblingNodesByPrefix<PlanItem>({
            planId,
            skPrefix: `${weekKey}#${dayKey}#${blockKey}#ITEM#`,
            entity: ENTITY.item,
        });

        if (items.length === 0) return 1;

        const maxOrder = Math.max(...items.map((i) => i.order ?? 0));
        return maxOrder + 1;
    }
}