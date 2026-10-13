
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import base64

app = FastAPI(
    title="AI Road Damage Detection API",
    description="YOLO11-based road damage detection system",
    version="1.0.0"
)

# ================= CORS =================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= YOLO MODEL =================

model = YOLO("best.pt")


# ================= HOME =================

@app.get("/")
def home():
    return {
        "message": "AI Road Damage Detection API is running",
        "status": "success"
    }


# ================= HEALTH =================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ================= SEVERITY ENGINE =================

def calculate_severity(
    damage_type,
    confidence,
    box_width,
    box_height,
    image_width,
    image_height
):
    # Calculate damaged area
    damage_area = box_width * box_height

    # Calculate total image area
    image_area = image_width * image_height

    # Percentage of image occupied by damage
    area_percentage = (damage_area / image_area) * 100

    # Base severity score
    score = confidence * 40

    # Add score based on damage size
    if area_percentage >= 20:
        score += 45
    elif area_percentage >= 10:
        score += 35
    elif area_percentage >= 5:
        score += 25
    elif area_percentage >= 2:
        score += 15
    else:
        score += 5

    # Damage-type importance
    if damage_type == "pothole":
        score += 15

    elif damage_type == "alligator_crack":
        score += 12

    elif damage_type == "longitudinal_crack":
        score += 7

    elif damage_type == "transverse_crack":
        score += 7

    # Convert score into severity
    if score >= 75:
        severity = "Critical"
    elif score >= 55:
        severity = "High"
    elif score >= 35:
        severity = "Medium"
    else:
        severity = "Low"

    return severity, round(area_percentage, 2), round(score, 2)


# ================= PREDICTION =================

@app.post("/predict")
async def predict(file: UploadFile = File(...)):

    # Read uploaded image
    image_bytes = await file.read()

    # Convert image to RGB
    image = Image.open(
        io.BytesIO(image_bytes)
    ).convert("RGB")

    # Get image dimensions
    image_width, image_height = image.size

    # Run YOLO
    results = model(
        image,
        conf=0.15
    )

    # Generate annotated image
    annotated_image = results[0].plot()

    annotated_pil = Image.fromarray(
        annotated_image
    )

    buffer = io.BytesIO()

    annotated_pil.save(
        buffer,
        format="JPEG"
    )

    annotated_base64 = base64.b64encode(
        buffer.getvalue()
    ).decode("utf-8")

    # Store detections
    detections = []

    for result in results:

        for box in result.boxes:

            class_id = int(
                box.cls[0]
            )

            confidence = float(
                box.conf[0]
            )

            class_name = model.names[
                class_id
            ]

            # Bounding box
            x1, y1, x2, y2 = (
                box.xyxy[0].tolist()
            )

            # Calculate width and height
            box_width = x2 - x1
            box_height = y2 - y1

            # Calculate intelligent severity
            severity, area_percentage, severity_score = calculate_severity(
                class_name,
                confidence,
                box_width,
                box_height,
                image_width,
                image_height
            )

            detections.append({

                "class": class_name,

                "confidence": round(
                    confidence,
                    3
                ),

                "severity": severity,

                "severity_score": severity_score,

                "damage_area_percentage": area_percentage,

                "bounding_box": {

                    "x1": round(
                        x1,
                        2
                    ),

                    "y1": round(
                        y1,
                        2
                    ),

                    "x2": round(
                        x2,
                        2
                    ),

                    "y2": round(
                        y2,
                        2
                    )
                }
            })

    # ================= ROAD HEALTH =================

    damage_count = len(
        detections
    )

    if damage_count == 0:

        road_health_score = 100

    else:

        # Total severity impact
        total_severity = sum(
            detection["severity_score"]
            for detection in detections
        )

        road_health_score = max(
            0,
            round(
                100 - (
                    total_severity * 0.35
                )
            )
        )

    # ================= REPAIR PRIORITY =================

    if road_health_score >= 80:

        repair_priority = "Low"

    elif road_health_score >= 60:

        repair_priority = "Medium"

    elif road_health_score >= 40:

        repair_priority = "High"

    else:

        repair_priority = "Critical"

    # ================= RESPONSE =================

    return {

        "success": True,

        "damage_count": damage_count,

        "road_health_score": road_health_score,

        "repair_priority": repair_priority,

        "detections": detections,

        "annotated_image": annotated_base64
    }

