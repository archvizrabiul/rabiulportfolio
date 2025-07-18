from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
from pymongo import MongoClient
import uuid
from bson import ObjectId
import json

# MongoDB connection
MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017/')
client = MongoClient(MONGO_URL)
db = client.archviz_portfolio

# Collections
projects_collection = db.projects
blog_collection = db.blog_posts
testimonials_collection = db.testimonials
settings_collection = db.settings
contacts_collection = db.contacts

app = FastAPI(title="Architectural Visualization Portfolio API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# Pydantic models
class Project(BaseModel):
    id: Optional[str] = None
    title: str
    description: str
    category: str
    image_url: str
    gallery_images: List[str] = []
    software_used: List[str] = []
    created_at: Optional[datetime] = None

class BlogPost(BaseModel):
    id: Optional[str] = None
    title: str
    content: str
    excerpt: str
    image_url: str
    category: str
    tags: List[str] = []
    published_at: Optional[datetime] = None
    read_time: Optional[int] = 5

class Testimonial(BaseModel):
    id: Optional[str] = None
    name: str
    company: str
    role: str
    content: str
    image_url: str
    rating: int = 5

class Contact(BaseModel):
    name: str
    email: str
    message: str
    created_at: Optional[datetime] = None

class Settings(BaseModel):
    name: str
    title: str
    bio: str
    profile_image: str
    cv_url: str
    email: str
    phone: str
    location: str
    social_links: dict = {}

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    if doc and '_id' in doc:
        doc['id'] = str(doc['_id'])
        del doc['_id']
    return doc

# Initialize default data
@app.on_event("startup")
async def startup_event():
    # Check if settings exist, if not create default
    if not settings_collection.find_one():
        default_settings = {
            "name": "Rabiul Hasan",
            "title": "Architectural Visualizer | AI Enthusiast",
            "bio": "Creative and detail-oriented Architectural Visualizer with a Diploma in Civil Engineering and certified training under the IsDB-BISEW IT Scholarship. Passionate about leveraging technology and AI to create stunning and realistic architectural representations.",
            "profile_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
            "cv_url": "/downloads/cv.pdf",
            "email": "rabiul.hasan@example.com",
            "phone": "+880 1234 567890",
            "location": "Dhaka, Bangladesh",
            "social_links": {
                "linkedin": "https://linkedin.com/in/rabiul-hasan",
                "behance": "https://behance.net/rabiul-hasan",
                "instagram": "https://instagram.com/rabiul.archviz",
                "facebook": "https://facebook.com/rabiul.hasan"
            }
        }
        settings_collection.insert_one(default_settings)
    
    # Initialize sample projects
    if projects_collection.count_documents({}) == 0:
        sample_projects = [
            {
                "id": str(uuid.uuid4()),
                "title": "Cozy Living Room",
                "description": "An interior design visualization for a cozy and inviting living space. The project focuses on warm lighting, comfortable furniture, and a harmonious color palette.",
                "category": "Interior Design",
                "image_url": "https://images.unsplash.com/photo-1749464251742-107093fc5650?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwdmlzdWFsaXphdGlvbnxlbnwwfHx8fDE3NTI4MTQ0NDJ8MA&ixlib=rb-4.1.0&q=85",
                "gallery_images": [
                    "https://images.unsplash.com/photo-1747538454771-c6500c61266d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxhcmNoaXRlY3R1cmFsJTIwdmlzdWFsaXphdGlvbnxlbnwwfHx8fDE3NTI4MTQ0NDJ8MA&ixlib=rb-4.1.0&q=85",
                    "https://images.unsplash.com/photo-1747538454763-3c80e36f17bf?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxhcmNoaXRlY3R1cmFsJTIwdmlzdWFsaXphdGlvbnxlbnwwfHx8fDE3NTI4MTQ0NDJ8MA&ixlib=rb-4.1.0&q=85"
                ],
                "software_used": ["3ds Max", "Corona Renderer", "Photoshop"],
                "created_at": datetime.now()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Modern Villa Exterior",
                "description": "A photorealistic rendering of a contemporary villa featuring clean lines, large windows, and modern architectural elements.",
                "category": "Exterior Design",
                "image_url": "https://images.pexels.com/photos/32984408/pexels-photo-32984408.jpeg",
                "gallery_images": [
                    "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDN8MHwxfHNlYXJjaHwyfHxpbnRlcmlvciUyMGRlc2lnbnxlbnwwfHx8fDE3NTI4MTQ0NDh8MA&ixlib=rb-4.1.0&q=85"
                ],
                "software_used": ["3ds Max", "V-ray", "AutoCAD"],
                "created_at": datetime.now()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "Corporate Office Interior",
                "description": "Professional office space design emphasizing productivity, comfort, and modern aesthetics.",
                "category": "Commercial Design",
                "image_url": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
                "gallery_images": [],
                "software_used": ["Revit", "3ds Max", "Lumion"],
                "created_at": datetime.now()
            }
        ]
        projects_collection.insert_many(sample_projects)
    
    # Initialize sample blog posts
    if blog_collection.count_documents({}) == 0:
        sample_posts = [
            {
                "id": str(uuid.uuid4()),
                "title": "Mastering Photorealism in 3ds Max and Corona",
                "content": "Achieving photorealism requires a deep understanding of lighting, materials, and composition. In this tutorial, we walk through the essential techniques in 3ds Max and Corona Renderer to take your visualizations from good to breathtakingly realistic.",
                "excerpt": "Learn essential techniques for creating photorealistic architectural visualizations using 3ds Max and Corona Renderer.",
                "image_url": "https://images.unsplash.com/photo-1749464251742-107093fc5650?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwdmlzdWFsaXphdGlvbnxlbnwwfHx8fDE3NTI4MTQ0NDJ8MA&ixlib=rb-4.1.0&q=85",
                "category": "Tutorial",
                "tags": ["3ds Max", "Corona", "Photorealism"],
                "published_at": datetime.now(),
                "read_time": 8
            },
            {
                "id": str(uuid.uuid4()),
                "title": "The Future of AI in Architectural Visualization",
                "content": "Artificial Intelligence is revolutionizing architectural visualization, from automated material generation to intelligent lighting solutions. Explore how AI tools are transforming our workflow and enhancing creative possibilities.",
                "excerpt": "Discover how AI is transforming the architectural visualization industry and what it means for designers.",
                "image_url": "https://images.unsplash.com/photo-1747538454771-c6500c61266d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxhcmNoaXRlY3R1cmFsJTIwdmlzdWFsaXphdGlvbnxlbnwwfHx8fDE3NTI4MTQ0NDJ8MA&ixlib=rb-4.1.0&q=85",
                "category": "Technology",
                "tags": ["AI", "Future", "Innovation"],
                "published_at": datetime.now(),
                "read_time": 6
            }
        ]
        blog_collection.insert_many(sample_posts)
    
    # Initialize sample testimonials
    if testimonials_collection.count_documents({}) == 0:
        sample_testimonials = [
            {
                "id": str(uuid.uuid4()),
                "name": "Sarah Johnson",
                "company": "Modern Architecture Studio",
                "role": "Principal Architect",
                "content": "Rabiul's architectural visualizations are exceptional. His attention to detail and ability to bring our designs to life is remarkable. The photorealistic quality of his work has helped us win several major projects.",
                "image_url": "https://images.unsplash.com/photo-1494790108755-2616b612b390?w=150&h=150&fit=crop&crop=face",
                "rating": 5
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Michael Chen",
                "company": "Urban Design Group",
                "role": "Creative Director",
                "content": "Working with Rabiul has been a game-changer for our firm. His technical expertise in 3ds Max and Corona, combined with his artistic vision, produces stunning visualizations that exceed client expectations.",
                "image_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
                "rating": 5
            },
            {
                "id": str(uuid.uuid4()),
                "name": "Emma Rodriguez",
                "company": "Residential Designs Inc.",
                "role": "Interior Designer",
                "content": "Rabiul's interior visualizations are incredibly realistic and help our clients visualize their future spaces perfectly. His understanding of lighting and materials is outstanding.",
                "image_url": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                "rating": 5
            }
        ]
        testimonials_collection.insert_many(sample_testimonials)

# API Routes
@app.get("/")
async def root():
    return {"message": "Architectural Visualization Portfolio API"}

# Projects endpoints
@app.get("/api/projects")
async def get_projects():
    projects = list(projects_collection.find())
    return [serialize_doc(project) for project in projects]

@app.get("/api/projects/categories")
async def get_project_categories():
    categories = projects_collection.distinct("category")
    return categories

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    project = projects_collection.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_doc(project)

@app.post("/api/projects")
async def create_project(project: Project):
    project.id = str(uuid.uuid4())
    project.created_at = datetime.now()
    result = projects_collection.insert_one(project.dict())
    return {"id": project.id, "message": "Project created successfully"}

@app.put("/api/projects/{project_id}")
async def update_project(project_id: str, project: Project):
    result = projects_collection.update_one(
        {"id": project_id}, 
        {"$set": project.dict(exclude={"id"})}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project updated successfully"}

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    result = projects_collection.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

# Blog endpoints
@app.get("/api/blog")
async def get_blog_posts():
    posts = list(blog_collection.find().sort("published_at", -1))
    return [serialize_doc(post) for post in posts]

@app.get("/api/blog/{post_id}")
async def get_blog_post(post_id: str):
    post = blog_collection.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return serialize_doc(post)

@app.post("/api/blog")
async def create_blog_post(post: BlogPost):
    post.id = str(uuid.uuid4())
    post.published_at = datetime.now()
    result = blog_collection.insert_one(post.dict())
    return {"id": post.id, "message": "Blog post created successfully"}

@app.put("/api/blog/{post_id}")
async def update_blog_post(post_id: str, post: BlogPost):
    result = blog_collection.update_one(
        {"id": post_id}, 
        {"$set": post.dict(exclude={"id"})}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post updated successfully"}

@app.delete("/api/blog/{post_id}")
async def delete_blog_post(post_id: str):
    result = blog_collection.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}

# Testimonials endpoints
@app.get("/api/testimonials")
async def get_testimonials():
    testimonials = list(testimonials_collection.find())
    return [serialize_doc(testimonial) for testimonial in testimonials]

@app.post("/api/testimonials")
async def create_testimonial(testimonial: Testimonial):
    testimonial.id = str(uuid.uuid4())
    result = testimonials_collection.insert_one(testimonial.dict())
    return {"id": testimonial.id, "message": "Testimonial created successfully"}

@app.put("/api/testimonials/{testimonial_id}")
async def update_testimonial(testimonial_id: str, testimonial: Testimonial):
    result = testimonials_collection.update_one(
        {"id": testimonial_id}, 
        {"$set": testimonial.dict(exclude={"id"})}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial updated successfully"}

@app.delete("/api/testimonials/{testimonial_id}")
async def delete_testimonial(testimonial_id: str):
    result = testimonials_collection.delete_one({"id": testimonial_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return {"message": "Testimonial deleted successfully"}

# Settings endpoints
@app.get("/api/settings")
async def get_settings():
    settings = settings_collection.find_one()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return serialize_doc(settings)

@app.put("/api/settings")
async def update_settings(settings: Settings):
    result = settings_collection.update_one(
        {}, 
        {"$set": settings.dict()}, 
        upsert=True
    )
    return {"message": "Settings updated successfully"}

# Contact endpoints
@app.post("/api/contact")
async def create_contact(contact: Contact):
    contact.created_at = datetime.now()
    result = contacts_collection.insert_one(contact.dict())
    return {"message": "Contact form submitted successfully"}

@app.get("/api/contacts")
async def get_contacts():
    contacts = list(contacts_collection.find().sort("created_at", -1))
    return [serialize_doc(contact) for contact in contacts]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)