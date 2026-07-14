from flask import Flask, request, jsonify
from flask_cors import CORS
import webbrowser
import os
import threading

app = Flask(__name__)
CORS(app)

COMMANDS = {
    "OPEN_SPOTIFY": "https://open.spotify.com/intl-id/",
    "OPEN_WHATSAPP": "start whatsapp://",
    "OPEN_YOUTUBE": "https://youtube.com",
    "OPEN_VSCODE": "code .",
    "OPEN_TASKMGR": "taskmgr",
    "OPEN_TRADINGVIEW": "https://www.tradingview.com/markets/cryptocurrencies/",
    "OPEN_SECURITY_CAMS": "https://www.earthcam.com/network/index.php"
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
        
        if target.startswith("http"):
            threading.Thread(target=lambda: webbrowser.open(target)).start()
        else:
            threading.Thread(target=lambda: os.system(target)).start()
            
    elif action == "SEARCH_SPOTIFY":
        import urllib.parse
        import time
        import pyautogui
        
        query = urllib.parse.quote(data.get('query', ''))
        target = f"spotify:search:{query}"
        print(f"[STARK BRIDGE] Searching Spotify Desktop for: {query}")
        
        def spotify_autoplay():
            os.system(f"start {target}")
            time.sleep(3) # Tunggu Spotify terbuka
            pyautogui.press('tab', presses=2, interval=0.3)
            pyautogui.press('enter')
            
        threading.Thread(target=spotify_autoplay).start()
        return jsonify({"status": "success", "executed": action, "query": query})
        
    elif action == "SEARCH_YOUTUBE":
        import urllib.parse
        import time
        import pyautogui
        
        query = urllib.parse.quote(data.get('query', ''))
        target = f"https://www.youtube.com/results?search_query={query}"
        print(f"[STARK BRIDGE] Searching YouTube for: {query}")
        
        def youtube_autoplay():
            webbrowser.open(target)
            time.sleep(4) # Tunggu browser terbuka
            # Beralih ke video pertama
            pyautogui.press('tab', presses=4, interval=0.3)
            pyautogui.press('enter')
            
        threading.Thread(target=youtube_autoplay).start()
        return jsonify({"status": "success", "executed": action, "query": query})
        
    elif action == "SEARCH_GOOGLE":
        import urllib.parse
        query = urllib.parse.quote(data.get('query', ''))
        target = f"https://www.google.com/search?q={query}"
        print(f"[STARK BRIDGE] Searching Google for: {query}")
        threading.Thread(target=lambda: webbrowser.open(target)).start()
        return jsonify({"status": "success", "executed": action, "query": query})
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
