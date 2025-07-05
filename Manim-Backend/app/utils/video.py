from app.gemini import manim_script_from_prompt
from app.utils.utils import find_scene_class, video_output_path
from pathlib import Path
import uuid,textwrap,subprocess
from app.db.models import Message,ManimVideo
from app.db.crud import create_message,create_video
import cloudinary.uploader
from app.config.cloudinary_config import cloudinary
from shutil import rmtree
import time

BASE_DIR = Path(__file__).resolve().parent.parent.parent
RENDER_DIR = BASE_DIR / "rendered"
RENDER_DIR.mkdir(exist_ok=True)


async def generate_video(context, chatId, session):
    py_file = None
    vid_path = None

    try:
        start = time.time()
        script = manim_script_from_prompt(context)
        print(time.time()-start,"seconds taken to generate a script")

        
        new_message = Message(
            role="model",
            content=script,
            chatId=chatId,
        )
        create_message(session, new_message)
    

        scene = find_scene_class(script)
        if not scene:
            print("error raised at line 27 video.py")
            raise RuntimeError("Gemini did not define a scene class")
        
        file_id = uuid.uuid4().hex[:8]
        py_file = RENDER_DIR / f"scene_{file_id}.py"
        py_file.write_text(textwrap.dedent(script))

        vid_path = render_with_manim(py_file, scene)

        cloudinary_response = await upload_video_to_cloudinary(
            vid_path, chatId, file_id
        )

        video = ManimVideo(
            chatId=chatId,
            url=cloudinary_response['secure_url']
        )
        create_video(session, video)

        return {
            "video_url": cloudinary_response['secure_url'],
            "public_id": cloudinary_response['public_id']
        }

    except Exception as e: 
        print("error raised at line 55 video.py", e)
        raise RuntimeError("Error while generating video") from e

    finally:
        # Clean up the .py script
        
        if py_file and py_file.exists():
            py_file.unlink()
        
        # Clean up the rendered video file
        if vid_path and vid_path.exists():
            try:
                vid_path.unlink()
            except Exception as cleanup_err:
                print("Failed to delete video file:", cleanup_err)

        cache = BASE_DIR/ "rendered" /"__pycache__" / f"scene_{file_id}.cpython-313.pyc"
        try:
            cache.unlink()
        except Exception as cleanup_err:
                print("Failed to delete cache file:", cleanup_err)
        
        media_dir = BASE_DIR / "media" / "videos" / f"scene_{file_id}"
        if media_dir.exists() and media_dir.is_dir():
            for file in media_dir.iterdir():
                try:
                    if file.is_file():
                        file.unlink()
                    elif file.is_dir():
                        rmtree(file)
                except Exception as e:
                    print(f"Failed to delete {file.name} in media dir: {e}")
        

async def generate_video_from_stream(script,chatId,request_id,message_id,session):
    py_file = None
    vid_path = None

    try:
        start = time.time()
        script = script.strip()
        if script.startswith("```"):
            # Remove first line entirely (handles ``` or ```python)
            script = "\n".join(script.split("\n")[1:]).lstrip()

        # Remove ending triple backticks
        if script.endswith("```"):
            script = "\n".join(script.split("\n")[:-1]).rstrip()
        scene = find_scene_class(script)
        print(time.time()-start,"seconds taken to find scene class")
        if not scene:
            print("error raised at line 113 video.py")
            raise RuntimeError("Gemini did not define a scene class")
        
        start = time.time()
        file_id = uuid.uuid4().hex[:8]
        py_file = RENDER_DIR / f"scene_{file_id}.py"
        py_file.write_text(textwrap.dedent(script))
        print(time.time()-start,"seconds taken to write scene class")

        vid_path = render_with_manim(py_file, scene)

        cloudinary_response = await upload_video_to_cloudinary(
            vid_path, chatId, file_id
        )

        video = ManimVideo(
            id=request_id,
            chatId=chatId,
            url=cloudinary_response['secure_url']
        )
        session.add(video)
        session.commit()
        session.refresh(video)
        print("video done")
        message = session.get(Message, message_id)
        if message:
            message.video_id = video.id
            session.add(message)
            session.commit()
        print("video created")
        print(cloudinary_response['secure_url'])
        return {
            "video_url": cloudinary_response['secure_url'],
            "public_id": cloudinary_response['public_id']
        }

    except Exception as e: 
        print("error raised at line 150 video.py", e)
        raise RuntimeError("Error while generating video") from e

    finally:
        # Clean up the .py script
        
        if py_file and py_file.exists():
            py_file.unlink()
        
        # Clean up the rendered video file
        if vid_path and vid_path.exists():
            try:
                vid_path.unlink()
            except Exception as cleanup_err:
                print("Failed to delete video file:", cleanup_err)

        cache = BASE_DIR/ "rendered" /"__pycache__" / f"scene_{file_id}.cpython-313.pyc"
        try:
            cache.unlink()
        except Exception as cleanup_err:
                print("Failed to delete cache file:", cleanup_err)
        
        media_dir = BASE_DIR / "media" / "videos" / f"scene_{file_id}"
        if media_dir.exists() and media_dir.is_dir():
            for file in media_dir.iterdir():
                try:
                    if file.is_file():
                        file.unlink()
                    elif file.is_dir():
                        rmtree(file)
                except Exception as e:
                    print(f"Failed to delete {file.name} in media dir: {e}")
                

def render_with_manim(py_file: Path, scene_class: str) -> Path:
    """Run manim. Return path to the rendered MP4 (raises on error)."""
    start = time.time()
    try:
        subprocess.run(
            ["manim", str(py_file), scene_class, "-ql", "--fps", "15", "-r", "854,480"],
            check=True,
            cwd=BASE_DIR,
            capture_output=True
        )

    except subprocess.CalledProcessError as err:
        error_msg = err.stderr.decode() if err.stderr else str(err)
        print("error raised at line 195 video.py",err)

        raise RuntimeError(f"Manim failed: {err}") from err
    
    print(time.time()-start,"to execute manim code")
    
    vid_path = video_output_path(py_file, scene_class)
    if not vid_path.exists():
        print("error raised at line 202 video.py")
        raise RuntimeError("Expected video not found after rendering.")
    return vid_path

async def upload_video_to_cloudinary(video_path: Path, chatId: str, file_id: str):
    """Upload video to Cloudinary with optimizations"""
    try:
        print("cloudinary process begins")
        start = time.time()
        response = cloudinary.uploader.upload(
            str(video_path),
            resource_type="video",
            public_id=f"manim_videos/{chatId}/{file_id}",
            folder="manim_videos",
            backup=False,
            tags=[chatId, "manim", "generated"],

            # eager transformations — generate different versions asynchronously
            eager=[
                {"streaming_profile": "full_hd"},
                {"quality": "auto:good", "format": "mp4"},
                {"quality": "auto:low", "format": "webm"}
            ],
            eager_async=True,
        )
        print(time.time()-start,"to execute cloudinary process")

        return response

    except Exception as e:
        print("error raised at line 232 video.py", e)
        raise RuntimeError(f"Failed to upload to Cloudinary: {str(e)}")
