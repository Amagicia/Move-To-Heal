import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow React frontend to connect

# API Key and defaults from .env
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "sk_a0mgxxsq_iAN4rc9If8LHqSGCpKl6vSPK")
SARVAM_DEFAULT_SPEAKER = os.getenv("SARVAM_SPEAKER", "tanya")

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text-translate"
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"

@app.route('/api/stt', methods=['POST'])
def stt():
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    
    headers = {
        "api-subscription-key": SARVAM_API_KEY
    }
    
    files = {
        "file": (file.filename, file.read(), file.mimetype)
    }
    
    data = {
        "model": "saaras:v2.5",
        "prompt": ""
    }

    try:
        response = requests.post(SARVAM_STT_URL, headers=headers, files=files, data=data)
        
        if not response.ok:
            return jsonify({"error": "Sarvam API Error", "details": response.text}), response.status_code
            
        return jsonify(response.json())
        
    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500

@app.route('/api/tts', methods=['POST'])
def tts():
    body = request.get_json()
    if not body or 'text' not in body:
        return jsonify({"error": "No text provided"}), 400

    text = body['text']
    language = body.get('target_language_code', 'en-IN')
    
    # Priority: .env variables > React frontend requests > 'tanya' default
    speaker = SARVAM_DEFAULT_SPEAKER

    headers = {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "inputs": [text],
        "target_language_code": language,
        "speaker": speaker,
        "speech_sample_rate": 8000,
        "enable_preprocessing": True,
        "model": "bulbul:v3"
    }

    try:
        tts_response = requests.post(SARVAM_TTS_URL, headers=headers, json=payload)
        
        if not tts_response.ok:
            return jsonify({"error": "Sarvam API Error", "details": tts_response.text}), tts_response.status_code
            
        return jsonify({"audio": tts_response.json().get('audios', [''])[0]})
        
    except Exception as e:
        return jsonify({"error": "Server error", "details": str(e)}), 500

if __name__ == '__main__':
    print(f"Starting Speech Service on Port 5001...")
    print(f"Sarvam Voice Speaker Loaded: {SARVAM_DEFAULT_SPEAKER}")
    app.run(host='0.0.0.0', port=5001, debug=True)