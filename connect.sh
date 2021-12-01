case $1 in

mongo)
    scp -i sdcMongo.pem ./init.sh ubuntu@ec2-18-222-124-70.us-east-2.compute.amazonaws.com
    ssh -i sdcMongo.pem ubuntu@ec2-18-222-124-70.us-east-2.compute.amazonaws.com
    ;;
node)
    scp -i sdcMongo.pem ./init.sh ubuntu@ec2-18-218-52-123.us-east-2.compute.amazonaws.com
    ssh -i sdcMongo.pem ubuntu@ec2-18-218-52-123.us-east-2.compute.amazonaws.com
    ;;
esac