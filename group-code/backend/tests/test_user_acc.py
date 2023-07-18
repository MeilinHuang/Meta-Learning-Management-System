import unittest
from tests.database import SessionLocal, engine
from app import helper, models, schemas
from app.auth import JWTBearer
from sqlalchemy.orm import Session
import os
import re
import os
def getNewdb():
    """
    Caution, this deletes exisiting test_local_db.db.
    Use next() on this generator to get the db session.
    """
    if os.path.exists("tests/test_local_db.db"):
        os.remove("tests/test_local_db.db")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TestUserAcc(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        self.db = next(getNewdb())

    def test_vEmail_valid(self):
        db = self.db
        helper.create_user(db, "kai1", "kai12345", "kai@gmail.com", "kai")
        user1 = helper.get_user_by_username(db,"kai1")
        rtnMsg = helper.getVerifyEmail(db, user1, False)
        self.assertEqual(rtnMsg["recipient"], "kai@gmail.com")
        expRtn = f"""Subject: Meta LMS verification code

Hi kai,
Your code is {rtnMsg["otp"]}. Please enter this code in the prompt on Meta LMS."""
        self.assertEqual(rtnMsg["text"], expRtn)
        self.assertEqual(len(rtnMsg["otp"]), 6)
        self.assertTrue(rtnMsg["otp"].isdigit())

    def test_vEmail_None(self):
        self.assertEqual(helper.getVerifyEmail(self.db, None, False)["message"], "Username doesn't exist")
  
        
if __name__ == '__main__':
    unittest.main()