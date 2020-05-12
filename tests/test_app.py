import os,sys
import unittest
sys.path.append(os.path.abspath('..'))
from server import app

class BasicTests(unittest.TestCase):

    ############################
    #### setup and teardown ####
    ############################
 
    # executed prior to each test
    def setUp(self):
        self.app = app.test_client()
        
 
    # executed after each test
    def tearDown(self):
        pass
 

###############
#### tests ####
###############
 
    def test_main_page(self):
        response = self.app.get('/', follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Sales Forecasting', response.data)


if __name__ == "__main__":
    unittest.main()
