"""
Treatment knowledge base service.
Loads treatment_knowledge.json once at startup and provides
exact-match disease name lookup returning medicines, duration, and notes.
"""

import os
import json

# Path to treatment_knowledge.json (in trained_model/ at project root)
_TREATMENT_PATH = os.path.join(
    os.path.dirname(__file__), '..', '..', '..', 'trained_model', 'treatment_knowledge.json'
)

# Lazy-loaded treatment knowledge base
_treatment_kb = None


def _load_treatment_kb():
    """Load treatment_knowledge.json once into memory."""
    global _treatment_kb
    if _treatment_kb is not None:
        return

    try:
        with open(_TREATMENT_PATH, 'r') as f:
            _treatment_kb = json.load(f)
        print(f"SUCCESS: Loaded {len(_treatment_kb)} disease treatments from treatment_knowledge.json")
    except Exception as e:
        print(f"ERROR: Failed to load treatment_knowledge.json: {e}")
        _treatment_kb = {}


def get_treatment(predicted_disease: str) -> dict:
    """
    Look up treatment by exact disease name string.
    Returns dict with medicines (list), treatment_duration (str), notes (str).
    """
    _load_treatment_kb()

    if predicted_disease in _treatment_kb:
        treatment = _treatment_kb[predicted_disease]
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
