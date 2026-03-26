# AWS Infrastructure Setup and Template Development
## Architecture


## Phases
### Phase 1 - Networking
- VPC
- Internet Gateway
- Public Subnets
- Private Subnets
- Route Tables

**Setup**
VPC
│
├─ Internet Gateway
│
├─ Public Subnet A
│     └─ (future ALB)
│
├─ Public Subnet B
│     └─ (future ALB)
│
├─ Private Subnet A
│     └─ (future ECS tasks)
│
└─ Private Subnet B
      └─ (future ECS tasks)

### Phase 2 - DynamoDB + IAM
- DynamoDB table
- Task IAM Role
- Task Execution Role
- CloudWatch log group

**Setup**
Blueprint VPC
│
├─ DynamoDB Table
│
├─ IAM Roles
│
└─ CloudWatch Logs

### Phase 3 - ECS Infrastructure
- ECR repository
- ECS cluster
- Task definition

**Note:** 
ECR Repo setup manually through AWS console, and image was pushed after building locally using the following commands:
```
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com
docker tag ironcircle-api:latest <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ironcircle-api:latest
docker push <AWS_ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ironcircle-api:latest
```

### Phase 4 - Networking for Containers, Traffic Layer, Compute
- VPC endpoints
- Security groups
- Application Load Balancer
  - Target Group
  - Listener
- ECS Service

## Deploying with AWS CloudFormation CLI
The following commands are used to spin up and tear down the environment and all associated resources:
To Spin up - `aws cloudformation deploy --template-file infrastructure/template.yaml --stack-name blueprint-api --capabilities CAPABILITY_NAMED_IAM`
Test cycle loop of commands I ran while deving
```
aws cloudformation delete-stack --stack-name blueprint-api
aws cloudformation wait stack-delete-complete --stack-name blueprint-api
# test updated template with changes
aws cloudformation deploy --template-file infrastructure/template.yaml --stack-name blueprint-api --capabilities CAPABILITY_NAMED_IAM
```

## Project Database
### DynamoDB
In the planning/requirements gathering phase of the project, it was originally decided to use MongoDB. 
Shortly after beginning development efforts, it was decided to transition to [AWS DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html).
**Reasons to use DynamoDB per AWS docs:**
- DynamoDB offers zero infrastructure management
- Zero downtime maintenance
- Instant scaling to any application demand
- Pay-per-request billing
- There are no cold starts, no version upgrades, and no maintenance windows

**Other Factors that played into this Decision:**
Deploying the project on the AWS Cloud via [Elastic Container Service](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html) on Fargate, also favor deploying
on DynamoDB to keep the project completely AWS and more maintainable from an AWS Native Developer's standpoint.

Consistent single-digit millisecond performance at any scale, capable of handling millions of requests per second. Performance is a shared responsibility between the DynamoDB service and the client application, and it can be optimized through several architectural and configuration choices, which include **Single Table Design**.

### Single Table Design
DynamoDB [single-table design](https://aws.amazon.com/blogs/database/single-table-vs-multi-table-design-in-amazon-dynamodb/) is a data modeling approach where multiple, different entity types (e.g., users and their orders) are stored in a single table to achieve high performance, reduce costs, and eliminate the need for costly database JOIN operations which DynamoDB does not support.

If everything is all in the same table -> Queries and retreiving data will be lighting fast

Core Principles:
- Access Pattern First: Before designing your table, you must first list and understand all of your application's data access patterns (how you will query the data).
- Composite Keys: The design heavily relies on composite primary keys (Partition Key (PK) and Sort Key (SK)). The PK groups related items into an item collection, while the SK orders or
  categorizes items within that collection, enabling powerful range queries and filtering (e.g., begins_with()).
- Key Overloading: Generic attribute names like PK, SK, GSI1PK, and GSI1SK are used and "overloaded" with different prefixed values (e.g., USER#123, POST#456) to differentiate between entity
  types and support various query patterns.
- Denormalization: Data is often denormalized, meaning related data might be duplicated across items or combined into single, large items to ensure a single request can retrieve all necessary
  information.

Implementing Single Table Design with DynamoDB will be a technical challenge being new to DynamoDB so having to learn new methods of querying and inserting data, and also coming from
a background of being used to schemas and holding different entities in different tables/collections will be a steep learning curve to get used to a non-relational modeling approach.
We're going to move forward with this to accept the challenge and learn new techniques and design patterns that will fit the project's needs.