from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Union
import json
import boto3
import pathlib
from uuid import uuid4

import asyncio

class File(BaseModel):
    file_name: str
    file_type: str

class FileUploadedMessage(BaseModel):
    file_id: Union[str, None] = None
    
app = FastAPI()

origins = [
    "http://54.146.67.173:8080",
    "http://ittweb.ddns.net:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def main():
    return {"message": "Hello World"}
    
@app.post("/api/files/upload/direct/start/")
def upload_start(file: File):
    
    file_name = file_generate_name(file.file_name)
    presigned_data = s3_generate_presigned_post(file_path=file_name,file_type=file.file_type)
    print(file_name, presigned_data) 
    return presigned_data
    
@app.post("/api/files/upload/direct/finish/")
def upload_finish(data: FileUploadedMessage):
    return {'message':'ok'}
    
def s3_generate_presigned_post(*, file_path: str, file_type: str):
    s3_client = boto3.client( service_name="s3")

    acl =  'public-read' # 'private'
    expires_in = 1000

    presigned_data = s3_client.generate_presigned_post(
        's3-web-tijuana',
        file_path,
        Fields={
            "acl": acl,
            "Content-Type": file_type
        },
        Conditions=[
            {"acl": acl},
            {"Content-Type": file_type},
        ],
        ExpiresIn=expires_in,
    )
    return presigned_data

def file_generate_name(original_file_name):
    name = pathlib.Path(original_file_name)
    extension = name.suffix
    file_name = name.stem
    return f"original/{file_name}-{uuid4().hex}{extension}"
    
async def event_generator(object_name: str):
    # Assuming you have some mechanism to get data for a specific user
    while True:
        #data = await get_data_for_user(user_id)  # Your function to get data
        data = json.dumps({'content':'hi'})
        yield f"data: {data}\n\n"
        await asyncio.sleep(10)  # Interval between messages

@app.get("/events/{user_id}")
async def events(request: Request, user_id: str):
    event_stream = event_generator(user_id)
    return StreamingResponse(event_stream, media_type="text/event-stream")