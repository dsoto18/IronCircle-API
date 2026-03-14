# AWS Infrastructure Setup and Template Development
## Architecture


## Phases
### Phase 1 - Networking
- VPC
- Internet Gateway
- Public Subnets
- Private Subnets
- Route Tables

** Setup **
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

** Setup **
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

### Phase 4 - Networking for Containers
- VPC endpoints
- Security groups

### Phase 5 - Traffic Layer
- Application Load Balancer
- Target Group
- Listener

### Phase 6 - Compute
- ECS Service