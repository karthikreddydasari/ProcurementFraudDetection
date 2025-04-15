from sklearn.preprocessing import LabelEncoder

def detect_fraud_proba(df, model, use_mock=False):
    df_cleaned = df.copy()

    # Label encode all object-type columns
    for col in df_cleaned.select_dtypes(include=['object']).columns:
        df_cleaned[col] = df_cleaned[col].astype(str)
        le = LabelEncoder()
        df_cleaned[col] = le.fit_transform(df_cleaned[col])

    if use_mock:
        # Simulated probabilities for testing different risk levels
        mock_probs = [0.30, 0.55, 0.75, 0.85, 0.65, 0.95]
        probas = [mock_probs[i % len(mock_probs)] for i in range(len(df_cleaned))]
    else:
        # Use the actual model to get probabilities
        probas = model.predict_proba(df_cleaned)[:, 1].tolist()

    # Debug log
    print(f"Input rows: {len(df_cleaned)}, Probabilities: {len(probas)}")
    return probas
