import os
import pickle
import streamlit as st

# Set page configuration
st.set_page_config(page_title = "Diabetes detection",
                   layout = "wide",
                   page_icon = "🧑‍⚕️🔍")

    
# getting the working directory of the main.py
working_dir = os.path.dirname(os.path.abspath(__file__))

# loading the saved model

diabetes_model = pickle.load(open('./diabetes_model.sav', 'rb'))




# Diabetes Prediction Page


    # page title
st.title('Diabetes Prediction')

    # getting the input data from the user
col1, col2, col3, col4 = st.columns(4)

with col1:
    Pregnancies = st.text_input('Number of Pregnancies', placeholder = 'Enter number of pregnancies')

with col2:
    Glucose = st.text_input('Glucose Level', placeholder = 'Enter glucose level')

with col3:
    BloodPressure = st.text_input('Blood Pressure value', placeholder = 'Enter blood pressure value < 100')

with col4:
    SkinThickness = st.text_input('Skin Thickness value', placeholder = 'Enter skin thickness value < 50')

with col1:
    Insulin = st.text_input('Insulin Level', placeholder = 'Enter insulin level')

with col2:
    BMI = st.text_input('BMI value', placeholder = 'Enter BMI value')

with col3:
    DiabetesPedigreeFunction = st.text_input('Diabetes Pedigree Function value', placeholder = 'Enter DPF value')

with col4:
    Age = st.text_input('Age of the Person', placeholder = 'Enter patient age')


    # code for Prediction
diab_diagnosis = ''

    # creating a button for Prediction

if st.button('Diabetes Test Result'):

    user_input = [Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin,
                  BMI, DiabetesPedigreeFunction, Age]

    user_input = [float(x) for x in user_input]

    diab_prediction = diabetes_model.predict([user_input])

    if diab_prediction[0] == 1:
        diab_diagnosis = 'The person is Diabetic'
    else:
        diab_diagnosis = 'The person is NOT Diabetic'

st.success(diab_diagnosis)