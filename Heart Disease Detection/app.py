import os
import pickle
import streamlit as st

# Set page configuration
st.set_page_config(page_title = "Heart disease",
                   layout = "wide",
                   page_icon = "🧑‍⚕️🔍")

    
# getting the working directory of the main.py
working_dir = os.path.dirname(os.path.abspath(__file__))

# loading the saved models

heart_disease_model = pickle.load(open('./heart_disease_model.sav', 'rb'))

# Heart Disease Prediction Page

# page title
st.title('Heart Disease Prediction')

col1, col2, col3 = st.columns(3)

with col1:
    age = st.text_input('Age', placeholder = 'Enter patient age')

with col2:
    sex = st.text_input('Sex', placeholder = 'Enter 0 for Male or 1 for Female')

with col3:
    cp = st.text_input('Chest Pain types', placeholder = 'Enter chest pain intensity (0 to 3)')

with col1:
    trestbps = st.text_input('Resting Blood Pressure', placeholder = 'Enter resting blood pressure (< 200)')

with col2:
    chol = st.text_input('Serum Cholestoral', placeholder = 'Enter serum cholestrol in mg/dl')

with col3:
    fbs = st.text_input('Fasting Blood Sugar', placeholder = 'Enter fasting blood sugar > 120 mg/dl')

with col1:
    restecg = st.text_input('Resting Electrocardiographic results', placeholder = 'Enter resting electrocardiographic result (0 or 1)')

with col2:
    thalach = st.text_input('Maximum Heart Rate achieved', placeholder = 'Enter maximum heart rate')

with col3:
    exang = st.text_input('Exercise Induced Angina', placeholder = 'Enter exercise induced angina')

with col1:
    oldpeak = st.text_input('ST depression induced by exercise', placeholder = 'Enter depression induces by execise')

with col2:
    slope = st.text_input('Slope of the peak exercise ST segment', placeholder = 'Enter slope of peak exercise')

with col3:
    ca = st.text_input('Major vessels colored by flourosopy', placeholder = 'Enter major vessels colored by flourosopy')

with col1:
    thal = st.text_input('thal', placeholder = '0 = normal; 1 = fixed defect; 2 = reversable defect')

# code for Prediction
heart_diagnosis = ''

# creating a button for Prediction

if st.button('Heart Disease Test Result'):

    user_input = [age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal]

    user_input = [float(x) for x in user_input]

    heart_prediction = heart_disease_model.predict([user_input])

    if heart_prediction[0] == 1:
        heart_diagnosis = 'The person is having heart disease'
    else:
        heart_diagnosis = 'The person does NOT have any heart disease'

st.success(heart_diagnosis)