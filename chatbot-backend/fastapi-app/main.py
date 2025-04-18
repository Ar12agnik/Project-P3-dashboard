from typing import Union

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import faiss
import numpy as np
import re
from sentence_transformers import SentenceTransformer
print("Starting basic Setup!!")

# Load embedding model
embed_model = SentenceTransformer("all-MiniLM-L6-v2")

# Example stored procedures with expected parameters
stored_procedures = {
    "PRC_P3Dash_GetAllLocations": {
        "description": "Returns all the locations where the stock can be present",
        "params": []
    },
    "PRC_P3Dash_low_quantity_stock_top_N": {
        "description": "Fetches top N products that have low quantity where N is a number if n is not provided it is 0 retreves stocks that have low quantity",
        "params": ["N"]
    },
    "PRC_P3Dash_getTopNProdsAccexpiry_overall": {
        "description": "Retreves top N products According to Expiry",
        "params": ["N"]
    },
    "PRC_P3Dash_getTop10ProdsAccexpiry": {
        "description": "Retreves all the products that are expiring",
        "params": []
    }
}



# Create FAISS index
dimension = 384  # Size of the embedding model output
index = faiss.IndexFlatL2(dimension)

# Store SP embeddings
sp_keys = list(stored_procedures.keys())
sp_embeddings = np.array([embed_model.encode(stored_procedures[key]["description"]) for key in sp_keys], dtype=np.float32)
index.add(sp_embeddings)
print("Basic Setuo Complete!!")

# Function to retrieve relevant stored procedure

# Example query



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)




@app.get("/get_sp_recomendation/{user_query}")
async def get_relevant_sp(user_query):
    print(user_query)
    query_embedding = np.array([embed_model.encode(user_query)], dtype=np.float32)
    
    distances, indices = index.search(query_embedding, 1)  # Retrieve the best match
    best_match = sp_keys[indices[0][0]]

    # Extract numeric values from the query
    numbers = [int(num) for num in re.findall(r'\d+', user_query)]

    # Assign extracted values to SP parameters
    params = stored_procedures[best_match]["params"]
    assigned_params = {params[i]: numbers[i] for i in range(min(len(params), len(numbers)))}

    # Compute confidence as similarity score
    distance = distances[0][0]  # FAISS gives L2 distance (lower is better)
    confidence = 1 / (1 + distance)  # Converts distance into similarity

    return {
        "sp_name": best_match,
        "params": assigned_params,
        "confidence": float(confidence)  # Convert numpy float32 to Python float
    }
