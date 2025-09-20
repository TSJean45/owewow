import json
import boto3
import logging

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    # Parse the request
    body = json.loads(event['body']) if event.get('body') else {}
    
    # Call your existing Python Lambda
    lambda_client = boto3.client('lambda', region_name='ap-southeast-5')
    
    try:
        response = lambda_client.invoke(
            FunctionName='owewow-textract-parser',
            InvocationType='RequestResponse',
            Payload=json.dumps({
                'bucket_name': 'owewow-uploads-x9k4m2',
                'object_key': body.get('object_key', 'receipt.jpg'),
                'group_id': body.get('group_id', 'demo')
            })
        )
        
        result = json.loads(response['Payload'].read())
        
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': True,
                'data': result
            })
        }
        
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            'body': json.dumps({
                'success': False,
                'error': str(e)
            })
        }
