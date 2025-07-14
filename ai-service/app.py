
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
# Add this GET endpoint for testing
@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'AI Service is running',
        'endpoints': {
            'POST /recommend': 'For task recommendations',
            'GET /test': 'For service testing'
        }
    })

# Add this test endpoint
@app.route('/test', methods=['GET'])
def test():
    return jsonify({
        'status': 'success',
        'message': 'AI Service is working!'
    })
@app.route('/recommend', methods=['POST'])
def recommend_assignees():
    data = request.json
    task_description = data.get('task_description', '')
    potential_assignees = data.get('potential_assignees', [])
    
    if not task_description or not potential_assignees:
        return jsonify({'error': 'Missing required data'}), 400
    
    # Extract skills from users
    user_skills = [' '.join(user['skills']) for user in potential_assignees]
    
    # Combine task description with skills for TF-IDF
    all_texts = [task_description] + user_skills
    
    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform(all_texts)
    
    # Calculate similarity between task and each user's skills
    task_vector = tfidf_matrix[0]
    user_vectors = tfidf_matrix[1:]
    
    similarity_scores = cosine_similarity(task_vector, user_vectors)[0]
    
    # Prepare recommendations
    recommendations = []
    for i, user in enumerate(potential_assignees):
        recommendations.append({
            'user': {
                'id': user['id'],
                'name': user['name']
            },
            'score': float(similarity_scores[i]),
            'skills': user['skills']
        })
    
    # Sort by recommendation score
    recommendations.sort(key=lambda x: x['score'], reverse=True)
    
    return jsonify({
        'task': task_description,
        'recommendations': recommendations
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True)