from textblob import TextBlob

CAREER_TEXT = {
    'tech': "Coding, logic, and problem-solving are your strengths.",
    'business': "Leadership, finance, and management skills suit you.",
    'medical': "Empathy, care, and precision define your path.",
    'arts': "Creativity and expression are your assets."
}

CAREER_TEXT_UR = {
    'tech': "کوڈنگ، منطق، اور مسئلہ حل کرنے کی صلاحیتیں آپ کی قوت ہیں۔",
    'business': "قیادت، مالیات اور انتظامی صلاحیتیں آپ کے لیے موزوں ہیں۔",
    'medical': "ہمدردی، دیکھ بھال، اور درستگی آپ کے راستے کی نشاندہی کرتی ہیں۔",
    'arts': "تخلیقی صلاحیت اور اظہار آپ کی قوت ہیں۔"
}

# Minimal stopwords for English keyword extraction
EN_STOPWORDS = {
    "and", "or", "the", "are", "your", "for", "of", "a", "in", "on", "with"
}
def get_career_insight(career_tag: str, language: str = 'en') -> dict:
    text = CAREER_TEXT_UR.get(career_tag) if language == 'ur' else CAREER_TEXT.get(career_tag)

    # Sentiment analysis
    blob = TextBlob(text)
    sentiment_score = round(blob.sentiment.polarity, 2)

    # Tokenization & keywords
    if language == 'en':
        tokens = [word.strip(".,!") for word in text.split()]
        keywords = [w for w in tokens if w.lower() not in EN_STOPWORDS]
    else:
        tokens = text.split()
        keywords = [w for w in tokens if w.isalpha()]

    return {
        "text": text,                  # The plain, user-facing text
        "keywords": keywords,           # NLP analysis hidden from user
        "sentiment": sentiment_score    # NLP analysis hidden from user
    }