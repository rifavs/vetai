"""
Image analysis service using trained DenseNet121 veterinary disease detection model.
Loads vet_densenet_model.keras (14-class, 92.5% accuracy) and labels.pkl
for image-based disease prediction on uploaded clinical images.
"""

import os
import uuid
import pickle
from datetime import datetime
from typing import Optional, Dict, Any, List, Tuple
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

# ─────────────────────────────────────────────────────────────────────
# Lazy-loaded model globals
# ─────────────────────────────────────────────────────────────────────

_disease_model = None
_idx_to_class = None          # dict[int, str]  (index → disease name)
_num_classes = 0

MODEL_DIR = os.path.join(
    os.path.dirname(__file__), '..', '..', 'Antigravity_Package'
)
MODEL_PATH = os.path.join(MODEL_DIR, 'vet_densenet_model.keras')
LABELS_PATH = os.path.join(MODEL_DIR, 'labels.pkl')

INPUT_SIZE = 224  # DenseNet121 expects 224×224




def _load_disease_model():
    """Lazy-load the DenseNet121 disease detection model and label map."""
    global _disease_model, _idx_to_class, _num_classes

    if _disease_model is not None:
        return True

    try:
        import tensorflow as tf

        print("Loading DenseNet121 veterinary disease detection model...")
        _disease_model = tf.keras.models.load_model(MODEL_PATH)

        with open(LABELS_PATH, 'rb') as f:
            label_map = pickle.load(f)   # dict[str, int]: name → index

        # Build index → class name mapping (same logic as inference.py)
        _idx_to_class = {v: k for k, v in label_map.items()}
        _num_classes = len(_idx_to_class)

        print(f"SUCCESS: DenseNet121 model loaded with {_num_classes} classes")
        print(f"  Label mapping: {_idx_to_class}")
        return True

    except Exception as e:
        print(f"ERROR: Failed to load disease detection model: {e}")
        import traceback
        traceback.print_exc()
        _disease_model = None
        return False


class ImageAnalyzer:
    """Analyzes veterinary clinical images using trained DenseNet121 model."""

    UPLOAD_DIR = Path("uploads/images")
    ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.bmp', '.webp'}
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

    def __init__(self):
        self.upload_dir = self.UPLOAD_DIR
        self.upload_dir.mkdir(parents=True, exist_ok=True)

    # ─────────────────────────────────────────────────────────────────
    # File management (unchanged)
    # ─────────────────────────────────────────────────────────────────

    async def save_image(
        self,
        file_content: bytes,
        filename: str,
        image_type: str = "general"
    ) -> Dict[str, Any]:
        """Save uploaded image and return metadata."""
        # Validate file extension
        ext = Path(filename).suffix.lower()
        if ext not in self.ALLOWED_EXTENSIONS:
            raise ValueError(f"Invalid file type. Allowed: {self.ALLOWED_EXTENSIONS}")

        # Validate file size
        if len(file_content) > self.MAX_FILE_SIZE:
            raise ValueError(f"File too large. Maximum size: {self.MAX_FILE_SIZE // (1024*1024)}MB")

        # Generate unique ID and paths
        image_id = str(uuid.uuid4())
        date_folder = datetime.now().strftime("%Y-%m-%d")
        save_dir = self.upload_dir / date_folder
        save_dir.mkdir(parents=True, exist_ok=True)

        # Save original
        original_path = save_dir / f"{image_id}_original{ext}"
        with open(original_path, 'wb') as f:
            f.write(file_content)

        # Create thumbnail
        thumb_path = save_dir / f"{image_id}_thumb.jpg"
        self._create_thumbnail(original_path, thumb_path)

        # Get image dimensions
        with Image.open(original_path) as img:
            width, height = img.size

        return {
            "image_id": image_id,
            "original_path": str(original_path),
            "thumbnail_path": str(thumb_path),
            "image_type": image_type,
            "filename": filename,
            "file_size": len(file_content),
            "width": width,
            "height": height,
            "uploaded_at": datetime.utcnow().isoformat()
        }

    def _create_thumbnail(self, source_path: Path, thumb_path: Path, size: Tuple[int, int] = (200, 200)):
        """Create a thumbnail of the image."""
        with Image.open(source_path) as img:
            img.thumbnail(size, Image.Resampling.LANCZOS)
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            img.save(thumb_path, 'JPEG', quality=85)

    # ─────────────────────────────────────────────────────────────────
    # DenseNet121 disease detection pipeline
    # ─────────────────────────────────────────────────────────────────

    async def analyze_image(
        self,
        image_path: str,
        image_type: str = "general"
    ) -> Dict[str, Any]:
        """
        Analyze image using the trained DenseNet121 veterinary disease
        detection model. Returns ranked disease predictions with
        confidence scores across all 14 classes.
        """
        # Ensure model is loaded
        if not _load_disease_model():
            raise RuntimeError(
                "Disease detection model could not be loaded. "
                f"Ensure '{MODEL_PATH}' and '{LABELS_PATH}' exist."
            )

        # Load and preprocess image for DenseNet121 (224×224)
        img_batch = self._preprocess_for_model(image_path)

        # Run inference
        predictions = _disease_model.predict(img_batch, verbose=0)
        probabilities = predictions[0].copy()  # shape: (num_classes,)

        # Build ranked prediction list
        ranked = self._build_predictions(probabilities)

        top = ranked[0] if ranked else None

        return {
            "image_type": "disease_detection",
            "predictions": ranked,
            "top_prediction": top,
            "model_info": {
                "name": "DenseNet121",
                "input_size": INPUT_SIZE,
                "num_classes": _num_classes,
                "accuracy": "92.5%"
            },
            "analyzed_at": datetime.utcnow().isoformat()
        }

    def _preprocess_for_model(self, image_path: str) -> np.ndarray:
        """
        Preprocess image for DenseNet121 — follows inference.py exactly:
        1. Read with cv2.imread()
        2. Convert BGR → RGB
        3. Resize to 224×224
        4. Scale to float32 / 255.0
        5. Add batch dimension
        """
        img = cv2.imread(image_path)
        if img is None:
            raise ValueError(f"Cannot read image: {image_path}")

        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (INPUT_SIZE, INPUT_SIZE))
        img = np.array(img, dtype=np.float32) / 255.0
        img_batch = np.expand_dims(img, axis=0)
        return img_batch

    def _build_predictions(
        self,
        probabilities: np.ndarray,
        top_n: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Convert model output probabilities into a ranked list of
        disease predictions with confidence scores.
        """
        # Get indices sorted by probability descending
        sorted_indices = np.argsort(probabilities)[::-1]

        ranked = []
        for rank, idx in enumerate(sorted_indices[:top_n], start=1):
            confidence = float(probabilities[idx])
            disease_name = _idx_to_class.get(idx, f"class_{idx}")
            ranked.append({
                "disease": disease_name,
                "confidence": round(confidence, 4),
                "rank": rank
            })

        return ranked

    # ─────────────────────────────────────────────────────────────────
    # Database helpers (unchanged)
    # ─────────────────────────────────────────────────────────────────

    async def get_image(self, image_id: str) -> Optional[Dict[str, Any]]:
        from ..database import Database
        images = Database.get_collection("images")
        image = await images.find_one({"image_id": image_id})
        if image:
            image["_id"] = str(image["_id"])
            return image
        return None

    async def delete_image(self, image_id: str) -> bool:
        from ..database import Database
        images = Database.get_collection("images")
        image = await images.find_one({"image_id": image_id})
        if not image:
            return False
        for k in ['original_path', 'thumbnail_path']:
            try:
                os.remove(image[k])
            except Exception:
                pass
        await images.delete_one({"image_id": image_id})
        return True


# Singleton instance
image_analyzer = ImageAnalyzer()
