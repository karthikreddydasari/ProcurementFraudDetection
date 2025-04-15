from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
import pandas as pd
import joblib
from utils.predict import detect_fraud_proba  # Updated function to get probabilities

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

# Load model
model = joblib.load("model/procurement_fraud.pkl")

# Custom threshold for classification
THRESHOLD = 0.71

# Features used during training
feature_columns = [
    "vendor_location", "vendor_authenticity_score", "vendor_risk_rating",
    "vendor_payment_history", "contract_value", "contract_type",
    "contract_start_date", "contract_end_date", "unit_price",
    "quantity", "total_cost", "delivery_date", "quality_rating",
    "payment_method", "payment_status", "overpricing_flag",
    "fake_vendor_flag", "contract_violation_flag"
]

@app.route("/predict", methods=['POST', 'OPTIONS'])
def predict():
    if request.method == 'OPTIONS':
        response = make_response()
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        return response, 200

    try:
        # Handle file upload or JSON payload
        if "file" in request.files:
            file = request.files["file"]
            df = pd.read_csv(file)
        else:
            data = request.get_json()
            df = pd.DataFrame([data])

        # Check for missing required columns
        missing_cols = list(set(feature_columns) - set(df.columns))
        if missing_cols:
            return jsonify({"error": f"Missing required columns: {missing_cols}"}), 400

        # Select only required features
        features_df = df[feature_columns]

        # Get fraud probabilities
        probas = detect_fraud_proba(features_df, model, use_mock=True)

        # Apply threshold
        df['Prediction'] = [1 if p >= THRESHOLD else 0 for p in probas]
        df['Probability'] = probas

        # Enrich response
        enriched = []
        for _, row in df.iterrows():
            enriched.append({
                "Vendor": row.get("vendor_location", "N/A"),
                "ContractID": row.get("contract_type", "N/A"),
                "RiskScore": round(row['Probability'] * 100, 2),
                "RiskLevel": get_risk_level(row['Probability']),
                "FlaggedReason": get_flag_reason(row) if row['Prediction'] == 1 else "-"
            })

        response = make_response(jsonify({'predictions': enriched}))
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
        return response

    except Exception as e:
        return jsonify({"error": str(e)}), 500

def get_flag_reason(row):
    reasons = []
    if row.get('overpricing_flag') == 1:
        reasons.append("Overpricing")
    if row.get('fake_vendor_flag') == 1:
        reasons.append("Fake Vendor")
    if row.get('contract_violation_flag') == 1:
        reasons.append("Contract Violation")
    return ', '.join(reasons) if reasons else "Suspicious Pattern"

def get_risk_level(prob):
    if prob >= 0.85:
        return "High"
    elif prob >= 0.60:
        return "Medium"
    else:
        return "Low"

if __name__ == "__main__":
    app.run(debug=True, port=5001)
