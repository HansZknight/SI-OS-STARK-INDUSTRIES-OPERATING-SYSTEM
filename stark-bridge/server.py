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
        
    elif action in ["MEDIA_PLAY_PAUSE", "MEDIA_NEXT", "MEDIA_PREV"]:
        import pyautogui
        print(f"[STARK BRIDGE] Media control: {action}")
        if action == "MEDIA_PLAY_PAUSE":
            threading.Thread(target=lambda: pyautogui.press('playpause')).start()
        elif action == "MEDIA_NEXT":
            threading.Thread(target=lambda: pyautogui.press('nexttrack')).start()
        elif action == "MEDIA_PREV":
            threading.Thread(target=lambda: pyautogui.press('prevtrack')).start()
        return jsonify({"status": "success", "executed": action})
        
    elif action == "OPEN_APP":
        app_name = data.get('query', '')
        if app_name:
            print(f"[STARK BRIDGE] Opening generic app: {app_name}")
            threading.Thread(target=lambda: os.system(f"start {app_name}")).start()
        return jsonify({"status": "success", "executed": action, "query": app_name})
        
    elif action == "OPEN_WEB":
        url = data.get('query', '')
        if url:
            if not url.startswith('http'):
                url = 'https://' + url
            print(f"[STARK BRIDGE] Opening generic web: {url}")
            threading.Thread(target=lambda: webbrowser.open(url)).start()
        return jsonify({"status": "success", "executed": action, "query": url})
        
    elif action == "KILL_APP":
        app_name = data.get('query', '')
        if app_name:
            if not app_name.endswith('.exe'):
                app_name += '.exe'
            print(f"[STARK BRIDGE] Killing app: {app_name}")
            threading.Thread(target=lambda: os.system(f"taskkill /F /IM {app_name}")).start()
        return jsonify({"status": "success", "executed": action, "query": app_name})
        
    elif action == "TOGGLE_DARK_MODE":
        import winreg
        print(f"[STARK BRIDGE] Toggling Dark Mode")
        def toggle_dark_mode():
            try:
                registry = winreg.ConnectRegistry(None, winreg.HKEY_CURRENT_USER)
                key = winreg.OpenKey(registry, r"SOFTWARE\Microsoft\Windows\CurrentVersion\Themes\Personalize", 0, winreg.KEY_ALL_ACCESS)
                value, _ = winreg.QueryValueEx(key, "AppsUseLightTheme")
                new_value = 0 if value == 1 else 1
                winreg.SetValueEx(key, "AppsUseLightTheme", 0, winreg.REG_DWORD, new_value)
                winreg.SetValueEx(key, "SystemUsesLightTheme", 0, winreg.REG_DWORD, new_value)
                winreg.CloseKey(key)
                print(f"[STARK BRIDGE] Dark mode toggled to {'Light' if new_value == 1 else 'Dark'}")
            except Exception as e:
                print(f"[STARK BRIDGE] Failed to toggle dark mode: {e}")
        threading.Thread(target=toggle_dark_mode).start()
        return jsonify({"status": "success", "executed": action})

    elif action == "LOCKDOWN_PROTOCOL":
        import pyautogui
        print(f"[STARK BRIDGE] INITIATING LOCKDOWN PROTOCOL")
        def lockdown():
            # Mute Volume
            pyautogui.press('volumemute')
            # Minimize all windows
            pyautogui.hotkey('win', 'd')
            # Lock PC
            os.system("rundll32.exe user32.dll,LockWorkStation")
        threading.Thread(target=lockdown).start()
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
        
    elif action == "KILL_APP":
        app_name = data.get('query', '').strip()
        print(f"[STARK BRIDGE] Force killing app: {app_name}")
        if app_name:
            # Menggunakan taskkill paksa di Windows
            threading.Thread(target=lambda: os.system(f'taskkill /f /im "{app_name}.exe"')).start()
            return jsonify({"status": "success", "executed": action, "app": app_name})
        return jsonify({"status": "error", "message": "No app name provided"}), 400
        
    return jsonify({"status": "error", "message": "Unknown command"}), 400

@app.route('/listen', methods=['GET', 'POST'])
def listen_microphone():
    try:
        import speech_recognition as sr
        import sounddevice as sd
        import scipy.io.wavfile as wav
        
        print("[STARK BRIDGE] Adjusting for ambient noise and preparing to listen...")
        fs = 16000  # Sample rate
        seconds = 5  # Duration of recording
        
        print("[STARK BRIDGE] Listening for voice commands (5 seconds)...")
        # Record audio
        myrecording = sd.rec(int(seconds * fs), samplerate=fs, channels=1, dtype='int16')
        sd.wait()  # Wait until recording is finished
        
        # Save as WAV file temporarily
        wav.write('temp_audio.wav', fs, myrecording)
        
        r = sr.Recognizer()
        with sr.AudioFile('temp_audio.wav') as source:
            audio = r.record(source)
            
        print("[STARK BRIDGE] Processing speech via Google Speech-to-Text...")
        lang = request.args.get('lang', 'id-ID')
        text = r.recognize_google(audio, language=lang)
        
        print(f"[STARK BRIDGE] Recognized: {text}")
        
        # Cleanup
        try:
            os.remove('temp_audio.wav')
        except:
            pass
            
        return jsonify({"status": "success", "text": text})
    except sr.WaitTimeoutError:
        print("[STARK BRIDGE] Listening timeout. No speech detected.")
        return jsonify({"status": "error", "message": "No speech detected"}), 408
    except sr.UnknownValueError:
        print("[STARK BRIDGE] Speech not understood.")
        return jsonify({"status": "error", "message": "Could not understand audio"}), 400
    except Exception as e:
        print(f"[STARK BRIDGE] Voice error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/speak', methods=['GET'])
def speak_text():
    text = request.args.get('text', '')
    voice = request.args.get('voice', 'en-GB-ThomasNeural') # Default to UK Male
    
    if not text:
        return jsonify({"status": "error", "message": "No text provided"}), 400
        
    try:
        import edge_tts
        import asyncio
        from flask import send_file
        import time
        import glob
        
        # Cleanup old mp3 files to prevent piling up
        for old_file in glob.glob("temp_speech_*.mp3"):
            try:
                os.remove(old_file)
            except:
                pass
                
        filename = f"temp_speech_{int(time.time())}.mp3"
        filepath = os.path.join(os.path.dirname(os.path.abspath(__file__)), filename)
        
        async def generate_speech():
            communicate = edge_tts.Communicate(text, voice)
            await communicate.save(filepath)
            
        print(f"[STARK BRIDGE] Generating Neural Speech for: {text[:30]}...")
        asyncio.run(generate_speech())
        
        return send_file(filepath, mimetype="audio/mpeg")
    except Exception as e:
        print(f"[STARK BRIDGE] Speech synthesis error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/context', methods=['GET'])
def get_context():
    try:
        import psutil
        battery = psutil.sensors_battery()
        batt_percent = battery.percent if battery else "N/A"
        batt_plugged = battery.power_plugged if battery else False
        
        cpu_usage = psutil.cpu_percent(interval=0.5)
        ram = psutil.virtual_memory()
        ram_usage = ram.percent
        
        return jsonify({
            "status": "success",
            "cpu": cpu_usage,
            "ram": ram_usage,
            "battery": batt_percent,
            "plugged": batt_plugged
        })
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"status": "online", "message": "Stark Bridge is active"})

if __name__ == '__main__':
    print("========================================")
    print("      STARK LOCAL BRIDGE INITIATED      ")
    print("========================================")
    print("J.A.R.V.I.S is now connected to your OS.")
    print("Listening on port 5000 (0.0.0.0)...")
    app.run(port=5000, host='0.0.0.0')
