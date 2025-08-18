from flask import Flask, jsonify
import random

app = Flask(__name__)
counter = 0

@app.route('/health')
def health():
    return jsonify(status="ok"), 200


@app.route('/metrics')
def metrics():
    """Return random metrics and an incrementing request counter."""
    global counter
    counter += 1
    response = {
        "cpu_usage": round(random.uniform(10, 90), 2),
        "latency": round(random.uniform(100, 300), 2),
        "memory_usage": round(random.uniform(1000, 8000), 2),
        "requests_count": counter,
    }
    return jsonify(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)