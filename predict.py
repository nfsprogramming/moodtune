from transformers import pipeline

def load_model():
    """
    Loads the emotion classification model.
    """
    print("Loading model... this may take a moment.")
    return pipeline(task="text-classification", model="SamLowe/roberta-base-go_emotions", top_k=None)

def preprocess_text(text):
    """
    Basic text preprocessing:
    - Lowercase
    - Strip whitespace
    """
    if not text:
        return ""
    # RoBERTa is robust, but user requested preprocessing.
    # We'll keep it simple to avoid destroying semantic meaning for the transformer.
    return text.lower().strip()

def predict_emotion_simple(text):
    """
    Simple keyword-based detection for instant results (fallback).
    """
    text = text.lower()
    keywords = {
        "happy": ["happy", "good", "great", "awesome", "excited", "joy", "love", "wonderful", "cool"],
        "sad": ["sad", "bad", "depressed", "unhappy", "cry", "grief", "lonely", "exhausted", "tired"],
        "angry": ["angry", "mad", "furious", "irate", "hate", "rage"],
        "fear": ["scared", "fear", "afraid", "terrified", "nervous", "anxious", "worried"],
        "love": ["love", "crush", "heart", "romantic", "adore"],
        "calm": ["calm", "relax", "peace", "chill", "sleepy", "quiet"],
        "surprise": ["wow", "omg", "shock", "surprise", "amazing"]
    }
    
    detected_emotion = "neutral"
    max_count = 0
    
    for emotion, words in keywords.items():
        count = sum(1 for word in words if word in text)
        if count > max_count:
            max_count = count
            detected_emotion = emotion
            
    return detected_emotion, 0.8  # Dummy confidence

def predict_emotion(text, classifier=None):
    """
    Predicts the emotion from the input text.
    Returns the top detected emotion and its score.
    """
    text = preprocess_text(text)
    if not text:
        return None, 0.0
    
    if classifier == "simple" or classifier is None:
         return predict_emotion_simple(text)
    
    results = classifier(text)
    scores = results[0]
    scores.sort(key=lambda x: x['score'], reverse=True)
    
    top_emotion = scores[0]['label']
    confidence = scores[0]['score']
    
    return top_emotion, confidence

def predict_top_k_emotions(text, k=3, classifier=None):
    """
    Returns the top k emotions.
    """
    text = preprocess_text(text)
    if not text:
        return []

    if classifier == "simple" or classifier is None:
        top, conf = predict_emotion_simple(text)
        # Returns dummy list for simple mode
        return [{'label': top, 'score': conf}, {'label': 'neutral', 'score': 0.1}, {'label': 'calm', 'score': 0.1}]

    results = classifier(text)
    scores = results[0]
    scores.sort(key=lambda x: x['score'], reverse=True)
    
    return scores[:k]

if __name__ == "__main__":
    # Test
    text = "I am feeling a bit overwhelmed but excited about the new project!"
    emotion, conf = predict_emotion(text)
    print(f"Text: {text}")
    print(f"Emotion: {emotion} ({conf:.2f})")
