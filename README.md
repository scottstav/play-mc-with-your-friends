# Minecraft Server Template

## Setup
generate a key for the ec2 instance: `ssh-keygen -t rsa -m PEM -f ~/.ssh/minecraft-server-key`
import to aws: `aws ec2 import-key-pair --key-name minecraft-server-pem --public-key-material fileb://~/.ssh/minecraft-server-key.pub`
create a bucket for the stack: `aws s3 mb s3://pmwyf-cfn-stack`
deploy: `aws cloudformation deploy --template-file ./ec2-instance.yml --stack-name minecraft-server --s3-bucket pmwyf-cfn-stack`
get the dns of the deployed stack: `aws cloudformation describe-stacks --stack-name minecraft-server --query "Stacks[0].Outputs[0].OutputValue" --output text`

or ssh to you instance: `ssh -v -i ~/.ssh/minecraft-server-key ubuntu@$(aws cloudformation describe-stacks --stack-name minecraft-server --query "Stacks[0].Outputs[0].OutputValue" --output text)`
