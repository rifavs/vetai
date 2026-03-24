"""
Image disease treatment knowledge base service.
Loads image_disease_treatment.json once at startup and provides
exact-match disease name lookup returning medicines, duration, and notes
for image-based (DenseNet121) disease predictions.
"""

import os
import json

# Path to image_disease_treatment.json (in trained_model/ at project root)
_IMAGE_TREATMENT_PATH = os.path.join(
    os.path.dirname(__file__), '..', '..', '..', 'trained_model', 'image_disease_treatment.json'
)

# Lazy-loaded treatment knowledge base
_image_treatment_kb = None


def _load_image_treatment_kb():
    """Load image_disease_treatment.json once into memory."""
    global _image_treatment_kb
    if _image_treatment_kb is not None:
        return

    try:
        with open(_IMAGE_TREATMENT_PATH, 'r') as f:
            _image_treatment_kb = json.load(f)
        print(f"SUCCESS: Loaded {len(_image_treatment_kb)} image disease treatments from image_disease_treatment.json")
    except Exception as e:
        print(f"ERROR: Failed to load image_disease_treatment.json: {e}")
        _image_treatment_kb = {}


def get_image_treatment(predicted_disease: str) -> dict:
    """
    Look up treatment by exact disease name string from image predictions.
    Returns dict with medicines (list), treatment_duration (str), notes (str).
    """
    _load_image_treatment_kb()

    if predicted_disease in _image_treatment_kb:
        treatment = _image_treatment_kb[predicted_disease]
        return {
            "found": True,
            "disease": predicted_disease,
            "medicines": treatment["medicines"],
            "treatment_duration": treatment["treatment_duration"],
            "notes": treatment["notes"]
        }
    else:
        return {
            "found": False,
            "disease": predicted_disease,
            "medicines": ["No treatment data available"],
            "treatment_duration": "Not available",
            "notes": "No treatment data available for this condition"
        }
