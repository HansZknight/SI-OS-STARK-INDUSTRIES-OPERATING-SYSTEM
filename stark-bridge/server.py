from flask import Flask, request, jsonify
from flask_cors import CORS
import webbrowser
import os
import threading

app = Flask(__name__)
CORS(app)

COMMANDS = {
    "OPEN_SPOTIFY": "start spotify:",
    "OPEN_WHATSAPP": "start whatsapp://",
    "OPEN_YOUTUBE": "https://youtube.com",
    "OPEN_VSCODE": "code .",
    "OPEN_TASKMGR": "taskmgr",
    "OPEN_TRADINGVIEW": "https://www.tradingview.com/markets/cryptocurrencies/",
    "OPEN_SECURITY_CAMS": "https://www.earthcam.com/network/index.php",
    "LOCK_PC": "rundll32.exe user32.dll,LockWorkStation",
    "OPEN_DOWNLOADS": "explorer shell:Downloads",
    "OPEN_DOCUMENTS": "explorer shell:Personal",
    "OPEN_WEATHER_RADAR": "https://earth.nullschool.net/",
    "OPEN_CALCULATOR": "calc",
    "OPEN_NOTEPAD": "notepad",
    "OPEN_SETTINGS": "start ms-settings:"
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
        
    elif action == "CLOSE_WINDOW":
        import pyautogui
        print(f"[STARK BRIDGE] Closing current window")
        threading.Thread(target=lambda: pyautogui.hotkey('alt', 'f4')).start()
        return jsonify({"status": "success", "executed": action})
        
    elif action == "TAKE_SCREENSHOT":
        import pyautogui
        import time
        pictures_dir = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Pictures')
        if not os.path.exists(pictures_dir):
            os.makedirs(pictures_dir)
            
        timestamp = int(time.time())
        filepath = os.path.join(pictures_dir, f"JARVIS_Screenshot_{timestamp}.png")
        
        print(f"[STARK BRIDGE] Taking screenshot: {filepath}")
        def capture():
            time.sleep(1)
            pyautogui.screenshot(filepath)
            print(f"[STARK BRIDGE] Screenshot saved to {filepath}")
            
        threading.Thread(target=capture).start()
        return jsonify({"status": "success", "executed": action, "filepath": filepath})
    elif action == "SHOW_DESKTOP":
        import pyautogui
        print(f"[STARK BRIDGE] Showing desktop")
        threading.Thread(target=lambda: pyautogui.hotkey('win', 'd')).start()
        return jsonify({"status": "success", "executed": action})
        
    elif action in ["VOLUME_UP", "VOLUME_DOWN", "VOLUME_MUTE"]:
        import pyautogui
        print(f"[STARK BRIDGE] Adjusting volume: {action}")
        if action == "VOLUME_UP":
            threading.Thread(target=lambda: pyautogui.press('volumeup', presses=10)).start()
        elif action == "VOLUME_DOWN":
            threading.Thread(target=lambda: pyautogui.press('volumedown', presses=10)).start()
        else:
            threading.Thread(target=lambda: pyautogui.press('volumemute')).start()
        return jsonify({"status": "success", "executed": action})
        
    elif action in ["SCROLL_DOWN", "SCROLL_UP"]:
        import pyautogui
        print(f"[STARK BRIDGE] Scrolling: {action}")
        if action == "SCROLL_DOWN":
            threading.Thread(target=lambda: pyautogui.scroll(-500)).start()
        else:
            threading.Thread(target=lambda: pyautogui.scroll(500)).start()
        return jsonify({"status": "success", "executed": action})
        
    elif action == "EMPTY_TRASH":
        print(f"[STARK BRIDGE] Emptying Recycle Bin")
        threading.Thread(target=lambda: os.system("powershell.exe -NoProfile -Command Clear-RecycleBin -Confirm:$false")).start()
        return jsonify({"status": "success", "executed": action})
        
    elif action == "SET_TIMER":
        import time
        minutes_str = data.get('query', '5')
        try:
            minutes = int(minutes_str)
        except ValueError:
            minutes = 5
        print(f"[STARK BRIDGE] Setting timer for {minutes} minutes")
        def timer_thread():
            time.sleep(minutes * 60)
            print(f"[STARK BRIDGE] Timer finished! Ringing alarm.")
            # Search YouTube for generic alarm sound
            webbrowser.open("https://www.youtube.com/watch?v=4yOjnEvzYjM")
        threading.Thread(target=timer_thread).start()
        return jsonify({"status": "success", "executed": action, "minutes": minutes})
        
    elif action == "TYPE_TEXT":
        import pyautogui
        text_to_type = data.get('query', '')
        print(f"[STARK BRIDGE] Typing text: {text_to_type}")
        threading.Thread(target=lambda: pyautogui.write(text_to_type, interval=0.01)).start()
        return jsonify({"status": "success", "executed": action, "text": text_to_type})
        
    elif action == "READ_TEXT":
        import pyautogui
        import pyperclip
        import pyttsx3
        import time
        
        print(f"[STARK BRIDGE] Reading highlighted text...")
        def read_highlighted():
            # Copy text
            pyautogui.hotkey('ctrl', 'c')
            time.sleep(0.5)
            text = pyperclip.paste()
            if text:
                print(f"[STARK BRIDGE] Text to read: {text[:50]}...")
                engine = pyttsx3.init()
                engine.say(text)
                engine.runAndWait()
            else:
                print("[STARK BRIDGE] No text found in clipboard.")
        threading.Thread(target=read_highlighted).start()
        return jsonify({"status": "success", "executed": action})
        
    elif action == "TAKE_SELFIE":
        import cv2
        import time
        pictures_dir = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Pictures')
        if not os.path.exists(pictures_dir):
            os.makedirs(pictures_dir)
            
        timestamp = int(time.time())
        filepath = os.path.join(pictures_dir, f"JARVIS_Selfie_{timestamp}.jpg")
        
        print(f"[STARK BRIDGE] Taking selfie: {filepath}")
        def capture_selfie():
            cap = cv2.VideoCapture(0)
            # Beri waktu kamera untuk fokus
            time.sleep(1)
            ret, frame = cap.read()
            if ret:
                cv2.imwrite(filepath, frame)
                print(f"[STARK BRIDGE] Selfie saved to {filepath}")
            cap.release()
            
        threading.Thread(target=capture_selfie).start()
        return jsonify({"status": "success", "executed": action, "filepath": filepath})
        
    elif action == "CHECK_BATTERY":
        import psutil
        import pyttsx3
        print(f"[STARK BRIDGE] Checking battery status...")
        def report_battery():
            battery = psutil.sensors_battery()
            engine = pyttsx3.init()
            if battery:
                plugged = "and currently charging" if battery.power_plugged else "and not charging"
                engine.say(f"Sir, power is at {battery.percent} percent {plugged}.")
            else:
                engine.say("Sir, I am unable to detect a battery. You might be on a desktop computer.")
            engine.runAndWait()
        threading.Thread(target=report_battery).start()
        return jsonify({"status": "success", "executed": action})
        
    elif action == "SET_BRIGHTNESS":
        import screen_brightness_control as sbc
        level_str = data.get('query', '100')
        try:
            level = int(level_str)
        except ValueError:
            level = 100
        print(f"[STARK BRIDGE] Setting brightness to {level}%")
        threading.Thread(target=lambda: sbc.set_brightness(level)).start()
        return jsonify({"status": "success", "executed": action, "level": level})
        
    elif action == "TRANSLATE_TEXT":
        import pyautogui
        import pyperclip
        import time
        import urllib.parse
        print(f"[STARK BRIDGE] Translating highlighted text...")
        def translate():
            pyautogui.hotkey('ctrl', 'c')
            time.sleep(0.5)
            text = pyperclip.paste()
            if text:
                query = urllib.parse.quote(text)
                target = f"https://translate.google.com/?sl=auto&tl=id&text={query}&op=translate"
                webbrowser.open(target)
            else:
                print("[STARK BRIDGE] No text found in clipboard.")
        threading.Thread(target=translate).start()
        return jsonify({"status": "success", "executed": action})
        
    elif action == "SEARCH_HIGHLIGHTED":
        import pyautogui
        import pyperclip
        import time
        import urllib.parse
        print(f"[STARK BRIDGE] Searching highlighted text...")
        def search_high():
            pyautogui.hotkey('ctrl', 'c')
            time.sleep(0.5)
            text = pyperclip.paste()
            if text:
                query = urllib.parse.quote(text)
                target = f"https://www.google.com/search?q={query}"
                webbrowser.open(target)
            else:
                print("[STARK BRIDGE] No text found in clipboard.")
        threading.Thread(target=search_high).start()
        return jsonify({"status": "success", "executed": action})
        
    elif action == "FIND_CURSOR":
        import pyautogui
        import math
        import time
        print(f"[STARK BRIDGE] Finding cursor...")
        def wiggle_mouse():
            x, y = pyautogui.position()
            radius = 100
            for i in range(10):
                angle = i * (2 * math.pi / 10)
                pyautogui.moveTo(x + radius * math.cos(angle), y + radius * math.sin(angle), 0.05)
            pyautogui.moveTo(x, y, 0.1)
        threading.Thread(target=wiggle_mouse).start()
        return jsonify({"status": "success", "executed": action})
        
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
