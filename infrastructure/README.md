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