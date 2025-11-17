# backend/app/routes/upload.py
from fastapi import APIRouter, File, UploadFile, Depends, HTTPException
from minio import Minio
from dotenv import load_dotenv
import os
import io
import base64
from app.auth_utils import get_current_user
from app.models import User

try:
    from google import genai
except ImportError:
    genai = None

load_dotenv()
router = APIRouter()

MINIO_ENDPOINT = os.getenv("MINIO_ENDPOINT")
MINIO_ACCESS_KEY = os.getenv("MINIO_ACCESS_KEY")
MINIO_SECRET_KEY = os.getenv("MINIO_SECRET_KEY")
MINIO_BUCKET = os.getenv("MINIO_BUCKET")
MINIO_PUBLIC_ENDPOINT = os.getenv("MINIO_PUBLIC_ENDPOINT")  # e.g. host.docker.internal:9000

if not all([MINIO_ENDPOINT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY, MINIO_BUCKET]):
    raise RuntimeError("MinIO config missing in env")

minio_client = Minio(
    str(MINIO_ENDPOINT),
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

if not minio_client.bucket_exists(MINIO_BUCKET):
    minio_client.make_bucket(MINIO_BUCKET)

@router.post("/", status_code=201)
async def upload_image(file: UploadFile = File(...), current_user: User = Depends(get_current_user)):
    try:
        content = await file.read()
        buffer = io.BytesIO(content)
        object_name = file.filename or "upload.bin"
        minio_client.put_object(
            str(MINIO_BUCKET),
            object_name,
            buffer,
            length=len(content),
            content_type=file.content_type or "application/octet-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

    public_endpoint = MINIO_PUBLIC_ENDPOINT or MINIO_ENDPOINT
    url = f"http://{public_endpoint}/{MINIO_BUCKET}/{object_name}"

    # Gemini AI meal analysis
    api_key = os.getenv("GEMINI_API_KEY")
    analysis = {}
    print(f"Starting meal analysis with Gemini API...")
    try:
        if genai and api_key:
            # Initialize Gemini client
            client = genai.Client(api_key=api_key)
            
            # Save image temporarily for upload
            import tempfile
            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
            temp_file.write(content)
            temp_file.close()
            
            print(f"Uploading image to Gemini...")
            uploaded_file = client.files.upload(file=temp_file.name)
            print(f"Image uploaded successfully: {uploaded_file}")
            
            prompt = (
                "Analyze this meal image and return ONLY a valid JSON object (no markdown, no code blocks, no extra text) "
                "with these exact keys: description (string), calories (number), protein_g (number), carbs_g (number), "
                "fat_g (number), rating (number 1-10), suggestion (string with health tip). "
                "Provide realistic estimates based on the visible food."
            )
            
            # Try models that support vision
            models_to_try = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.5-pro"]
            last_error = None
            
            for model_name in models_to_try:
                try:
                    print(f"Trying model: {model_name} for image analysis...")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=[prompt, uploaded_file]
                    )
                    
                    text = response.text
                    print(f"Successfully used model {model_name} for image analysis")
                    print(f"Response: {text[:200]}...")  # Print first 200 chars
                    
                    # Clean up temp file
                    os.unlink(temp_file.name)
                    
                    # Try to extract JSON
                    import json, re
                    # Remove markdown code blocks if present
                    text = re.sub(r'^```json\s*', '', text)
                    text = re.sub(r'\s*```$', '', text)
                    match = re.search(r'\{[\s\S]*\}', text)
                    if match:
                        try:
                            analysis = json.loads(match.group(0))
                            print(f"Successfully parsed JSON analysis")
                        except Exception as json_error:
                            print(f"JSON parse error: {str(json_error)}")
                            analysis = {"text": text}
                    else:
                        print(f"No JSON found in response, using raw text")
                        analysis = {"text": text}
                    break  # Success, exit loop
                except Exception as model_error:
                    last_error = model_error
                    print(f"Model {model_name} failed for image analysis: {str(model_error)}")
                    continue
            
            # Clean up temp file if still exists
            try:
                os.unlink(temp_file.name)
            except:
                pass
            
            if not analysis:
                print(f"All models failed. Last error: {str(last_error)}")
                analysis = {"note": f"AI analysis failed: {str(last_error)}"}
        else:
            missing = []
            if not genai: missing.append("Gemini SDK")
            if not api_key: missing.append("GEMINI_API_KEY")
            print(f"Missing dependencies for image analysis: {', '.join(missing)}")
            analysis = {"note": f"Missing: {', '.join(missing)}"}
    except Exception as e:
        print(f"Image analysis error: {str(e)}")
        import traceback
        traceback.print_exc()
        analysis = {"note": f"AI analysis failed: {str(e)}"}
    try:
        import json
        json_bytes = json.dumps(analysis, ensure_ascii=False).encode("utf-8")
        minio_client.put_object(
            str(MINIO_BUCKET),
            f"{object_name}.analysis.json",
            io.BytesIO(json_bytes),
            length=len(json_bytes),
            content_type="application/json"
        )
    except Exception:
        pass

    return {"url": url, "filename": object_name, "analysis": analysis}
