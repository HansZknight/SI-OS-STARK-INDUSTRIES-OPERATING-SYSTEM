from flask import Flask, request, jsonify
from flask_cors import CORS
import webbrowser
import os
import threading

app = Flask(__name__)
CORS(app)

COMMANDS = {
    "OPEN_SPOTIFY": "https://open.spotify.com/intl-id/",
    "OPEN_WHATSAPP": "https://web.whatsapp.com",
    "OPEN_YOUTUBE": "https://youtube.com",
    "OPEN_VSCODE": "code ."
}

@app.route('/execute', methods=['POST'])
def execute():
    data = request.json
    if not data or 'action' not in data:
        return jsonify({"status": "error", "message": "No action provided"}), 400
        
    action = data.get('action').upper()
    
    if action in COMMANDS:
        target = COMMANDS[action]
        print(f"[STARK BRIDGE] Executing command: {action} -> {target}")
        
        # Eksekusi di thread terpisah agar API merespons dengan cepat tanpa terblokir
        if target.startswith("http"):
            threading.Thread(target=lambda: webbrowser.open(target)).start()
        else:
            threading.Thread(target=lambda: os.system(target)).start()
            
        return jsonify({"status": "success", "executed": action})
    
    print(f"[STARK BRIDGE] Unknown command: {action}")
    return jsonify({"status": "error", "message": "Unknown command"}), 400

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "online", "message": "Stark Bridge is active"})

if __name__ == '__main__':
    print("========================================")
    print("      STARK LOCAL BRIDGE INITIATED      ")
    print("========================================")
    print("J.A.R.V.I.S is now connected to your OS.")
    print("Listening on port 5000...")
    app.run(port=5000, host='127.0.0.1')
