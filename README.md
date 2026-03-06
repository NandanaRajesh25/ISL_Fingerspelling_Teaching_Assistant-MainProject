# 🤟 SignSync - Indian Sign Language Fingerspelling Teaching Assistant for Deaf Students

> A child-friendly, interactive sign language learning tool that uses a **MobileViT deep learning model** and a real-time **WebSocket pipeline** to detect Indian Sign Language (ISL) hand signs via webcam, build words letter-by-letter, and check spelling — all in the browser.


## Project Overview

**SignSync** is a full-stack web application designed for young deaf students and sign language learners. It bridges the gap between sign language hand gestures and literacy by:

- 🎥 Capturing **live webcam frames** in the browser
- 🧠 Running inference on a **MobileViT** model (via a Python backend)
- 📡 Communicating in **real time** over WebSocket
- 🔤 Building words **letter by letter** from detected hand signs
- ✅ Checking spelling and offering **corrected word suggestions**
- 🎞️ Playing **ISL sign videos** for each letter or full word

The application is built specifically with children in mind — featuring clear visual feedback, celebratory animations, and a forgiving detection pipeline that prevents accidental letter inputs.

---

## Key Features

| Feature | Description |
|---|---|
| 🎥 Real-time webcam detection | Live video captured at 5 fps (every 200 ms), streamed to backend |
| 🧠 MobileViT-S model | Lightweight vision transformer trained on 28 ISL classes |
| 📡 WebSocket communication | Low-latency bidirectional channel between browser and Python server |
| 🔒 Stability filter | Letter is only accepted after **8 consecutive matching frames** |
| ⏱️ Cooldown timer | **10-second cooldown** between accepted letters to pace the user |
| 🗑️ Delete gesture | `del` sign removes the last typed letter |
| ✅ Spell checker | Built-in dictionary of 50+ child-friendly words |
| 💡 Fuzzy suggestions | Levenshtein distance finds the closest matching dictionary word |
| 🎞️ Sign video viewer | Watch ISL videos for each letter or the whole word |
| ⌨️ Test keyboard | Use the on-screen keyboard when backend is not running |
| 📱 Responsive layout | Works on desktop and tablet-sized screens |

---



## Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.x | UI framework |
| TypeScript | 5.8.x | Type-safe JavaScript |
| Vite | 5.4.x | Build tool & dev server |
| Tailwind CSS | 3.4.x | Utility-first styling |
| shadcn/ui + Radix UI | Latest | Accessible component primitives |
| Lucide React | 0.462.x | Icon set |
| React Router DOM | 6.30.x | Client-side routing |
| react-helmet-async | 2.0.x | Document head management (SEO) |
| TanStack Query | 5.83.x | Async state management |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Python | 3.8+ | Runtime |
| FastAPI | 0.115.x | Async web framework |
| Uvicorn | 0.34.x | ASGI web server |
| PyTorch | 2.5.1 | Deep learning framework |
| timm | 1.0.11 | Model zoo (MobileViT) |
| torchvision | 0.20.1 | Image transforms |
| Pillow | 11.1.x | Image decoding |
| OpenCV | 4.10.x | Camera utilities (standalone script) |
| NumPy | 2.2.x | Numerical operations |
| websockets | 13.1 | WebSocket protocol support |

---


## Prerequisites

### Backend
- **Python 3.8 or higher** (3.9 / 3.10 recommended)
- **pip** package manager
- **CUDA-compatible GPU** *(optional — CPU fallback is automatic)*
- Required files in the project root:
  - `mobilevit_epoch_5.pth` — model weights
  - `class_order.txt` — 28 class label names

### Frontend
- **Node.js 16 or higher** (18+ recommended) **OR** [Bun](https://bun.sh/)
- **npm** (bundled with Node.js) or **bun**
- A modern web browser with **webcam access** (Chrome or Firefox recommended)

---

## Installation & Setup

### Step 1 — Clone the repository

```bash
git clone <YOUR_GIT_URL>
cd remix-of-remix-of-sign-spell-fun
```

### Step 2 — Backend: Install Python dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `fastapi`, `uvicorn[standard]`, `websockets`
- `torch`, `torchvision`, `timm`
- `opencv-python`, `Pillow`, `numpy`
- `python-multipart`

> 💡 **GPU acceleration**: If you have an NVIDIA GPU with CUDA, PyTorch will automatically use it. No extra configuration required.

### Step 3 — Verify model files exist

Confirm these two files are present in the project root:

```
✅ mobilevit_epoch_5.pth   (~19 MB — model weights)
✅ class_order.txt         (28 class labels: a-z, del, nothing)
```

### Step 4 — Frontend: Install Node dependencies

```bash
npm install
# or if using bun:
bun install
```

---

## Running the Application

The application requires **two terminal sessions** running simultaneously.

### Option A — PowerShell Scripts (Windows, recommended)

**Terminal 1 — Backend:**
```powershell
.\start_backend.ps1
```
The script auto-checks for missing Python packages and installs them if needed.

**Terminal 2 — Frontend:**
```powershell
.\start_frontend.ps1
```

### Option B — Bash Scripts (macOS / Linux)

**Terminal 1 — Backend:**
```bash
bash start_backend.sh
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

### Option C — Manual Commands

**Terminal 1 — Backend:**
```bash
python backend_server.py
```
Wait until you see:
```
✅ Model loaded successfully!
🚀 Starting server on http://localhost:8000
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```
Open your browser to the URL shown (usually `http://localhost:5173`).

### Ports

| Service | Default Port | URL |
|---|---|---|
| Python Backend (FastAPI) | `8000` | `http://localhost:8000` |
| Frontend (Vite dev server) | `5173` | `http://localhost:5173` |
| WebSocket endpoint | `8000` | `ws://localhost:8000/ws/detect` |

---

## How to Use

### Step-by-Step Walkthrough

1. **Open the app** in your browser at `http://localhost:5173`

2. **Start Camera Detection**
   - Click the **"🎥 Start Camera Detection"** button in the header
   - Grant camera permissions when the browser prompts you
   - You'll see your live webcam feed on the **left panel**
   - The status indicator will turn **green ("Live")**

3. **Sign a letter**
   - Position your hand clearly in front of the camera
   - The model reads your sign continuously at 5 fps
   - Watch the **"Detecting: X (n/8)"** overlay at the bottom of the video
   - Hold your sign steady until the count reaches **8/8**

4. **Wait for the cooldown**
   - After each accepted letter, a **10-second cooldown** starts
   - The countdown is displayed in real time: **"Next letter in: Ns"**
   - This prevents accidental double-entry

5. **Build your word**
   - Letters appear one by one in the **"Building Your Word"** area on the right
   - Use the **`del` hand sign** to remove the last letter
   - Or click the **"Undo"** button for the same effect
   - Click **"Clear"** to start a new word

6. **Check your spelling**
   - Click the **"Done ✅"** button when your word is complete
   - If correct: 🎉 **"Amazing Job!"** with a green celebration animation
   - If incorrect: 🤔 **"Almost There!"** with the closest dictionary suggestion

7. **View sign videos**
   - After a correct word: click **"Show Sign"** to watch the full word ISL video
   - After a suggestion: click **"Show Signs"** to watch each letter's ISL video one by one, with forward/back navigation

8. **Try again**
   - Click **"Try Another"** or **"Try Again"** to reset and build a new word

---


## Model Details

| Property | Value |
|---|---|
| Architecture | MobileViT-S |
| Framework | PyTorch + timm |
| Weights file | `mobilevit_epoch_5.pth` |
| Training epochs | 5 |
| Input resolution | 224 × 224 RGB |
| Number of classes | 28 |
| Classes | a–z (26 letters) + `del` + `nothing` |
| Normalization | ImageNet mean/std (`[0.485, 0.456, 0.406]` / `[0.229, 0.224, 0.225]`) |
| Inference device | CUDA (if available) or CPU |
| Confidence output | Softmax probabilities |


## Supported Hand Signs & Dictionary

### Detectable Signs (28 classes)

```
a  b  c  d  del  e  f  g  h  i  j  k  l  m
n  nothing  o  p  q  r  s  t  u  v  w  x  y  z
```

- **a–z**: Spell any letter
- **del**: Remove the last letter from the word being built
- **nothing**: No active sign (hand at rest) — ignored by the system

### Built-in Word Dictionary

The spell checker includes 50 child-friendly words:

```
BAG, CAT, DOG, BIRD, FISH, BEAR, LION, TREE, BOOK, BALL, STAR,
SUN, MOON, RAIN, SNOW, HAND, FOOT, HEAD, EYE, EAR, NOSE,
APPLE, BANANA, ORANGE, GRAPE, WATER, MILK, BREAD, CAKE,
HELLO, GOODBYE, PLEASE, THANKS, SORRY, HAPPY, SAD, LOVE,
MOM, DAD, BABY, FRIEND, SCHOOL, HOME, PLAY, EAT, DRINK, SLEEP
```




## Test Mode (No Backend Required)

If the Python backend is not running, you can still test the word-building and spell-check features using the **on-screen test keyboard**:

1. In the camera panel, find and click **"Show Test Keyboard"**
2. A 26-letter keyboard grid appears
3. Click any letter to simulate a detection event
4. Letters are added directly to the word builder
5. Spell check, viewing suggestions, and playing videos all work normally

This is also useful for:
- UI development without running the model
- Debugging the frontend word-building logic
- Demonstrating the app without camera hardware

---

## Troubleshooting

### Backend Issues

| Problem | Solution |
|---|---|
| `ModuleNotFoundError` | Run `pip install -r requirements.txt` |
| `FileNotFoundError: mobilevit_epoch_5.pth` | Ensure the model file is in the project root |
| `Class count mismatch` | Verify `class_order.txt` has exactly 28 lines |
| `CUDA out of memory` | The model will auto-fall back to CPU; or reduce input resolution |
| Port 8000 already in use | Change port: `uvicorn.run(app, host="0.0.0.0", port=8001)` and update `WS_URL` in the frontend hook |

### Frontend Issues

| Problem | Solution |
|---|---|
| `npm install` fails | Check Node.js version is ≥16; try `npm cache clean --force` |
| `Failed to connect to WebSocket` | Start the backend server first; verify it's on port 8000 |
| Camera not showing | Allow camera permissions in browser settings; ensure no other app is using the camera |
| No letters being detected | Check lighting; make clear hand signs; hold sign steady for 8 frames; wait for cooldown |
| Wrong port shown | Frontend typically uses 5173; check Vite output for actual URL |

### Detection Quality Tips

- 📦 **Good lighting** — avoid strong backlight; face a light source
- ✋ **Clear signs** — keep only one hand in frame
- 🖼️ **Fill the frame** — your hand should be large enough to see
- 🧘 **Hold steady** — the model needs 8 matching frames (about 1.6 seconds at 5 fps)
- ⏳ **Patience** — wait for the cooldown countdown before the next letter

---

## Security Notes

> The default configuration is for **local development only**.

For production deployment, update the following:

```python
# backend_server.py

# ❌ Development (allow all origins)
allow_origins=["*"]

# ✅ Production (restrict to your domain)
allow_origins=["https://yourdomain.com"]
```

Additional production hardening:
- Use **HTTPS** and **WSS** (secure WebSocket) via a reverse proxy (nginx/Caddy)
- Add **authentication middleware** to the FastAPI app
- Implement **rate limiting** to prevent abuse
- Validate and sanitize all incoming WebSocket messages
- Store model weights securely; do not expose them in the public directory

---

## Dependencies

### Python (`requirements.txt`)

```
fastapi==0.115.12
uvicorn[standard]==0.34.0
websockets==13.1
torch==2.5.1
torchvision==0.20.1
timm==1.0.11
opencv-python==4.10.0.84
Pillow==11.1.0
numpy==2.2.3
python-multipart==0.0.20
```

### Node.js (key dependencies from `package.json`)

```
react@18.3.x
react-router-dom@6.30.x
@tanstack/react-query@5.83.x
tailwindcss@3.4.x
vite@5.4.x
typescript@5.8.x
shadcn/ui (via @radix-ui/*)
lucide-react@0.462.x
```

---

## License

This project uses the following open-source software:

| Library | License |
|---|---|
| FastAPI | MIT |
| React | MIT |
| PyTorch | BSD-3-Clause |
| timm (MobileViT) | Apache 2.0 |
| OpenCV | Apache 2.0 |
| Radix UI / shadcn | MIT |
| Tailwind CSS | MIT |
| Vite | MIT |

---

<div align="center">

**Happy Signing!** 🤟✨


</div>
