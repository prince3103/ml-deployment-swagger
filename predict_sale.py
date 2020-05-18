"""
This is the predict_sale module and supports all the ReST actions for the
predict_sale
"""

# 3rd party modules
from flask import make_response, abort
import pickle
import numpy as np



def predictSaleFunc(rate, sale1, sale2):
	"""
     This function responds to request for /api/predict_sale
     to predict sale for third month
     return: json string for sale of third month
	"""
	model = pickle.load(open('model.pickle', 'rb'))
	int_features = [rate, sale1, sale2]
	final_features = [np.array(int_features)]
	prediction = model.predict(final_features)
	output = round(prediction[0], 2)
	predicted_data = {
	"predicted_sale": output
	}
	return predicted_data, 200