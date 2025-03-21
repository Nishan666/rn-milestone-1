import boto3
import jwt
import hmac
import hashlib
import base64

def calculate_secret_hash(username: str, app_client_id: str, client_secret: str) -> str:
    message = username + app_client_id
    digest = hmac.new(client_secret.encode(), message.encode(), hashlib.sha256).digest()
    secret_hash = base64.b64encode(digest).decode()

    # Debug log
    print(f"Computed Secret Hash: {secret_hash}")
    return secret_hash

def authenticate_and_get_token(username: str, password: str, user_pool_id: str, app_client_id: str, client_secret: str) -> None:
    client = boto3.client('cognito-idp')

    # Compute SECRET_HASH
    secret_hash = calculate_secret_hash(username, app_client_id, client_secret)

    try:
        resp = client.admin_initiate_auth(
            UserPoolId=user_pool_id,
            ClientId=app_client_id,
            AuthFlow='ADMIN_USER_PASSWORD_AUTH',
            AuthParameters={
                "USERNAME": username,
                "PASSWORD": password,
                "SECRET_HASH": secret_hash  # Include SECRET_HASH
            }
        )

        print("Log in success")
        print("Access token:", resp['AuthenticationResult']['AccessToken'])
        print("ID token:", resp['AuthenticationResult']['IdToken'])

        # Decode the ID token
        decoded_token = jwt.decode(resp['AuthenticationResult']['IdToken'], options={"verify_signature": False})
        email = decoded_token.get('email', 'Email not found in token')
        print("Email:", email)
    
    except Exception as e:
        print(f"Unexpected error: {e}")

# Call the function with your credentials
authenticate_and_get_token(
    'nishankumar559@gmail.com',
    'Poiuy@09876', 
    'us-east-1_r9Ygjkuo2', 
    '5d5v9l373186pk95g89qm0jrij',
    's6757ptbbguptaa30qrrmdvh01g6r23mjigf2vnn01psnhthk2p'
)
