from flask import Flask, request, jsonify
from langchain.prompts import PromptTemplate
from langchain_community.document_loaders import WebBaseLoader
from langchain.schema import StrOutputParser
from langchain.schema.prompt_template import format_document
from flask_cors import CORS
import os   
app = Flask(__name__)
CORS(app) 
os.environ["GOOGLE_API_KEY"] = "GEMINI-API-KEY"

from langchain_google_genai import ChatGoogleGenerativeAI
@app.route('/api', methods=['POST'])
def generate_summary():
    data = request.get_json()
    site = data['site']
    loader = WebBaseLoader(site)
    docs = loader.load()
    
    doc_prompt = PromptTemplate.from_template("{page_content}")
    llm_prompt_template = """Write a concise summary of the following:
"{text}"
CONCISE SUMMARY:"""
    llm_prompt = PromptTemplate.from_template(llm_prompt_template)
    
    llm = ChatGoogleGenerativeAI(model="gemini-pro",
                                 temperature=0.7, top_p=0.85)
    
    stuff_chain = (
        {
            "text": lambda docs: "\n\n".join(
                format_document(doc, doc_prompt) for doc in docs
            )
        }
        | llm_prompt         # Prompt for Gemini
        | llm                # Gemini function
        | StrOutputParser()  # output parser
    )
    
    response = stuff_chain.invoke(docs)
    
    return jsonify({"summary": response})

if __name__ == '__main__':
    app.run(debug=True)
