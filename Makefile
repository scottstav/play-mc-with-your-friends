deploy-stack:
	aws cloudformation deploy --template-file ./ec2-instance.yml --stack-name minecraft-server --s3-bucket pmwyf-cfn-stack --capabilities CAPABILITY_NAMED_IAM
get-ip:
	aws cloudformation describe-stacks --stack-name minecraft-server --query "Stacks[0].Outputs[0].OutputValue" --output text
delete-stack:
	aws cloudformation delete-stack --stack-name minecraft-server
