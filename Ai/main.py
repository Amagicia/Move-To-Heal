"""
==========================================================
  MoveToHeal — AI Model Inference Microservice (FastAPI)
==========================================================

  Endpoints:
    GET  /                  → Health check + model availability
    POST /predict/{model}   → Run prediction (brain | chest | skin)

  HOW TO RUN:
    cd ai
    pip install -r requirements.txt
    python main.py

  Server: http://localhost:8000

==========================================================
  MODEL FILES — Place inside ai/models/:
    ai/models/brain_tumor.h5
    ai/models/chest_disease.h5
    ai/models/skin_disease.h5
==========================================================
"""

import os
import io
import traceback
import numpy as np
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import uvicorn


# ============================================================
# APP
# ============================================================
app = FastAPI(title="MoveToHeal AI Engine", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# MODEL CONFIG
# ============================================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_CONFIG = {
    "brain": {
        "path": os.path.join(BASE_DIR, "brain_tumor_model.h5"),
        "input_size": (224, 224),        # TODO: match your model's input shape
        "labels": [                      # TODO: match your model's class order
            "Glioma",
            "Meningioma",
            "No Tumor",
            "Pituitary Tumor",
        ],
    },
    "chest": {
        "path": os.path.join(BASE_DIR, "chest_tuberculosis_model.h5"),
        "input_size": (224, 224),        # TODO: match your model's input shape
        "labels": [                      # TODO: match your model's class order
            "Normal",
            "Tuberculosis",
            "Lung Cancer",
        ],
    },
    "skin": {
        "path": os.path.join(BASE_DIR, "skin_disease_model.h5"),
        "input_size": (224, 224),        # TODO: match your model's input shape
        "labels": [                      # TODO: match your model's class order
            "Actinic Keratosis",
            "Basal Cell Carcinoma",
            "Dermatofibroma",
            "Melanoma",
            "Nevus",
            "Pigmented Benign Keratosis",
            "Vascular Lesion",
        ],
    },
}


# ============================================================
# MODEL CACHE (lazy-loaded on first request)
# ============================================================
_model_cache = {}


def load_model(model_key: str):
    """Load a .h5 model from disk on first call, then cache it."""
    if model_key in _model_cache:
        return _model_cache[model_key]

    cfg = MODEL_CONFIG.get(model_key)
    if not cfg:
        raise HTTPException(400, detail=f"Unknown model: '{model_key}'. Valid: {list(MODEL_CONFIG.keys())}")

    if not os.path.exists(cfg["path"]):
        raise HTTPException(
            503,
            detail=f"Model file missing: {os.path.basename(cfg['path'])}. "
                   f"Place your .h5 file at: {cfg['path']}",
        )

    from tensorflow.keras.models import load_model as keras_load  # type: ignore

    print(f"[AI] Loading {model_key} model: {cfg['path']}")
    model = keras_load(cfg["path"])
    _model_cache[model_key] = model
    print(f"[AI] ✅ {model_key} model loaded — input shape: {model.input_shape}")
    return model


# ============================================================
# IMAGE PREPROCESSING
# ============================================================
def preprocess(image_bytes: bytes, target_size: tuple) -> np.ndarray:
    """Raw bytes → normalized (1, H, W, 3) numpy array."""
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    img = img.resize(target_size)
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)


# ============================================================
# PREDICTION
# ============================================================
def predict(model_key: str, image_bytes: bytes) -> dict:
    """Run inference and return structured result."""
    cfg = MODEL_CONFIG[model_key]
    model = load_model(model_key)
    labels = cfg["labels"]

    img = preprocess(image_bytes, cfg["input_size"])
    preds = model.predict(img, verbose=0)

    # --- Handle binary (sigmoid) vs multi-class (softmax) ---
    if preds.shape[-1] == 1:
        prob = float(preds[0][0])
        idx = 1 if prob > 0.5 else 0
        conf = prob if idx == 1 else (1.0 - prob)
    else:
        idx = int(np.argmax(preds[0]))
        conf = float(preds[0][idx])

    label = labels[idx] if idx < len(labels) else "Unknown"

    # --- Per-class breakdown ---
    probs = {}
    if preds.shape[-1] > 1:
        for i, lbl in enumerate(labels):
            if i < preds.shape[-1]:
                probs[lbl] = round(float(preds[0][i]) * 100, 2)
    else:
        probs[labels[0]] = round((1.0 - float(preds[0][0])) * 100, 2)
        if len(labels) > 1:
            probs[labels[1]] = round(float(preds[0][0]) * 100, 2)

    return {
        "prediction": label,
        "confidence": round(conf * 100, 2),
        "class_probabilities": probs,
        "model_type": model_key,
    }


# ============================================================
# ENDPOINTS
# ============================================================

@app.get("/")
async def health():
    """Health check — shows which models are available on disk."""
    models = {}
    for key, cfg in MODEL_CONFIG.items():
        models[key] = {
            "available": os.path.exists(cfg["path"]),
            "file": os.path.basename(cfg["path"]),
            "labels": cfg["labels"],
        }
    return {"status": "online", "service": "MoveToHeal AI Engine", "models": models}


@app.post("/predict/{model_type}")
async def predict_endpoint(model_type: str, file: UploadFile = File(...)):
    """
    Run AI model prediction.

    Path param:
      model_type — one of: brain, chest, skin

    Body:
      file — image file (jpg/png)

    Returns:
      prediction, confidence, class_probabilities, model_type
    """
    if model_type not in MODEL_CONFIG:
        raise HTTPException(400, detail=f"Invalid model type: '{model_type}'. Must be one of: {list(MODEL_CONFIG.keys())}")

    try:
        image_bytes = await file.read()
        if len(image_bytes) == 0:
            raise HTTPException(400, detail="Empty file uploaded")

        result = predict(model_type, image_bytes)
        return result

    except HTTPException:
        raise
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, detail=f"Prediction failed: {str(e)}")


# ============================================================
# MAIN
# ============================================================
if __name__ == "__main__":
    print("=" * 55)
    print("  MoveToHeal AI Engine — Port 8000")
    print("=" * 55)
    for key, cfg in MODEL_CONFIG.items():
        found = "✅ FOUND" if os.path.exists(cfg["path"]) else "❌ MISSING"
        print(f"  [{key.upper():6s}] {os.path.basename(cfg['path']):25s} {found}")
    print("=" * 55)
    uvicorn.run(app, host="0.0.0.0", port=8000)
