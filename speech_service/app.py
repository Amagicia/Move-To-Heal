import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY", "sk_a0mgxxsq_iAN4rc9If8LHqSGCpKl6vSPK")
SARVAM_DEFAULT_SPEAKER = os.getenv("SARVAM_SPEAKER", "tanya")

SARVAM_STT_URL = "https://api.sarvam.ai/speech-to-text"
SARVAM_TTS_URL = "https://api.sarvam.ai/text-to-speech"


# ─────────────────────────────────────────────────────
# STT — Speech to Text (saaras:v3, auto-detects language)
# ─────────────────────────────────────────────────────
@app.route('/api/stt', methods=['POST'])
def stt():
    print("[STT] Request received")

    if 'file' not in request.files:
        return jsonify({"error": "No audio file uploaded"}), 400

    audio = request.files['file']
    audio_bytes = audio.read()

    if not audio_bytes or len(audio_bytes) < 100:
        return jsonify({"error": "Audio file is empty or too short"}), 400

    # Language from frontend dropdown — 'auto' means let model detect
    language_code = request.form.get('language_code', 'auto')

    headers = {
        "api-subscription-key": SARVAM_API_KEY
    }

    # Saaras v3 auto-detects language when mode=transcribe
    # Force mimetype to audio/wav if browser sent None
    mime = audio.mimetype if audio.mimetype else "audio/wav"
    fname = audio.filename if audio.filename else "recording.wav"

    files = {
        "file": (fname, audio_bytes, mime)
    }

    data = {
        "model": "saaras:v3",
        "with_timestamps": "false"
    }

    # 'unknown' triggers Sarvam's built-in language auto-detection
    if language_code and language_code != 'auto':
        data["language_code"] = language_code
    else:
        data["language_code"] = "unknown"

    try:
        print(f"[STT] Sending to Sarvam — model=saaras:v3, lang={language_code}, size={len(audio_bytes)} bytes, mime={mime}")
        resp = requests.post(SARVAM_STT_URL, headers=headers, files=files, data=data, timeout=30)
        print(f"[STT] Sarvam responded: {resp.status_code}")

        if not resp.ok:
            error_text = resp.text
            print(f"[STT] Sarvam ERROR: {error_text}")
            return jsonify({"error": "Sarvam STT failed", "details": error_text}), resp.status_code

        result = resp.json()
        detected_lang = result.get("language_code", language_code)
        lang_prob = result.get("language_probability", None)
        print(f"[STT] Success — lang={detected_lang} (prob={lang_prob}), transcript: {result.get('transcript', '')[:80]}...")

        return jsonify({
            "transcript": result.get("transcript", ""),
            "language_code": detected_lang,
            "language_probability": lang_prob
        })

    except requests.exceptions.Timeout:
        return jsonify({"error": "Sarvam API timed out. Please try again."}), 504
    except Exception as e:
        print(f"[STT] Server error: {e}")
        return jsonify({"error": "Server error", "details": str(e)}), 500


# ─────────────────────────────────────────────────────
# TTS — Text to Speech (bulbul:v3)
# ─────────────────────────────────────────────────────
@app.route('/api/tts', methods=['POST'])
def tts():
    print("[TTS] Request received")

    body = request.get_json()
    if not body or 'text' not in body:
        return jsonify({"error": "No text provided"}), 400

    text = body['text']
    language = body.get('target_language_code', 'en-IN')
    speaker = SARVAM_DEFAULT_SPEAKER

    # Truncate text to avoid Sarvam limits (max ~500 chars per chunk)
    if len(text) > 500:
        text = text[:497] + "..."

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
        print(f"[TTS] Sending to Sarvam — lang={language}, speaker={speaker}, text_len={len(text)}")
        resp = requests.post(SARVAM_TTS_URL, headers=headers, json=payload, timeout=30)
        print(f"[TTS] Sarvam responded: {resp.status_code}")

        if not resp.ok:
            error_text = resp.text
            print(f"[TTS] Sarvam ERROR: {error_text}")
            return jsonify({"error": "Sarvam TTS failed", "details": error_text}), resp.status_code

        audios = resp.json().get('audios', [])
        if not audios or not audios[0]:
            return jsonify({"error": "No audio returned from Sarvam"}), 500

        return jsonify({"audio": audios[0]})

    except requests.exceptions.Timeout:
        return jsonify({"error": "Sarvam API timed out. Please try again."}), 504
    except Exception as e:
        print(f"[TTS] Server error: {e}")
        return jsonify({"error": "Server error", "details": str(e)}), 500


# ─────────────────────────────────────────────────────
# TRANSLATE — English → Detected Language (mayura:v1)
# ─────────────────────────────────────────────────────
SARVAM_TRANSLATE_URL = "https://api.sarvam.ai/translate"

@app.route('/api/translate', methods=['POST'])
def translate():
    print("[TRANSLATE] Request received")

    body = request.get_json()
    if not body or 'text' not in body:
        return jsonify({"error": "No text provided"}), 400

    text = body['text']
    target_lang = body.get('target_language_code', 'hi-IN')
    source_lang = body.get('source_language_code', 'en-IN')

    # Skip translation if target is English
    if target_lang == 'en-IN':
        return jsonify({"translated_text": text})

    headers = {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json"
    }

    # Sarvam translate has a 1000 char limit — chunk if needed
    chunks = []
    remaining = text
    while remaining:
        chunks.append(remaining[:950])
        remaining = remaining[950:]

    translated_parts = []
    for i, chunk in enumerate(chunks):
        payload = {
            "input": chunk,
            "source_language_code": source_lang,
            "target_language_code": target_lang,
            "model": "mayura:v1",
            "enable_preprocessing": True
        }

        try:
            print(f"[TRANSLATE] Chunk {i+1}/{len(chunks)} — {source_lang} → {target_lang}, len={len(chunk)}")
            resp = requests.post(SARVAM_TRANSLATE_URL, headers=headers, json=payload, timeout=30)
            print(f"[TRANSLATE] Sarvam responded: {resp.status_code}")

            if not resp.ok:
                error_text = resp.text
                print(f"[TRANSLATE] Sarvam ERROR: {error_text}")
                return jsonify({"error": "Translation failed", "details": error_text}), resp.status_code

            result = resp.json()
            translated_parts.append(result.get("translated_text", chunk))

        except requests.exceptions.Timeout:
            return jsonify({"error": "Translation timed out. Please try again."}), 504
        except Exception as e:
            print(f"[TRANSLATE] Server error: {e}")
            return jsonify({"error": "Server error", "details": str(e)}), 500

    full_translation = " ".join(translated_parts)
    print(f"[TRANSLATE] Done — {len(full_translation)} chars")
    return jsonify({"translated_text": full_translation})


if __name__ == '__main__':
    print(f"Starting Speech Service on Port 5001...")
    print(f"Speaker: {SARVAM_DEFAULT_SPEAKER}")
    print(f"API Key loaded: {'Yes' if SARVAM_API_KEY else 'No'}")
    app.run(host='0.0.0.0', port=5001, debug=True)