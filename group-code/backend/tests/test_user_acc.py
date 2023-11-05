import unittest
from tests.database import SessionLocal, engine
from app import helper, models, schemas
from app.auth import JWTBearer
from sqlalchemy.orm import Session
import os
import re
import os
"""
Run tests with "python3 -m tests.test_user_acc" from the backend dir 
or "pytest".
"""
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
        helper.create_user(self.db, "kai1", "kai12345", "kai@gmail.com", "kai")
        helper.create_user(self.db, "kai2", "kai12345", "kai2@gmail.com", "kai2")
        helper.create_user(self.db, "joe", "kai12345", "joe@gmail.com", "joe")

    def test_vEmail_valid(self):
        user1 = helper.get_user_by_username(self.db,"kai1")
        rtnMsg = helper.getVerifyEmail(self.db, user1, False)
        self.assertEqual(rtnMsg["recipient"], "kai@gmail.com")
        expRtn = f"""Subject: Meta LMS verification code

Hi kai,
Your code is {rtnMsg["otp"]}. Please enter this code in the prompt on Meta LMS."""
        self.assertEqual(rtnMsg["text"], expRtn)
        self.assertEqual(len(rtnMsg["otp"]), 6)
        self.assertTrue(rtnMsg["otp"].isdigit())

    def test_vEmail_None(self):
        self.assertEqual(helper.getVerifyEmail(self.db, None, False)["message"], "Username doesn't exist")
    
    def test_putOtp_invalid(self):
        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertEqual(helper.putOtp(self.db, user1, "12321")["message"],"false")
    
    def test_putOtp_None(self):
       self.assertEqual(helper.putOtp(self.db, None, "12321")["message"], "Username doesn't exist")
    
    def test_putOtp_valid(self):
        user1 = helper.get_user_by_username(self.db,"kai1")
        helper.getVerifyEmail(self.db, user1, False)
        rtnMsg = helper.putOtp(self.db, user1, user1.lastOtp)
        self.assertEqual(rtnMsg["message"],"true")
        self.assertEqual(rtnMsg["vEmail"],"kai@gmail.com")
        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertEqual(user1.lastOtp, None)

    def test_recovery_Acc_invalid(self):
        rtnMsg = helper.recoveryAcc(self.db, None, "12345", "kai12345")
        self.assertEqual(rtnMsg["message"], "Username doesn't exist")

        user1 = helper.get_user_by_username(self.db,"kai1")
        rtnMsg = helper.recoveryAcc(self.db, user1, "12345", "kai12345")
        self.assertEqual(rtnMsg["message"], "false")

        user1 = helper.get_user_by_username(self.db,"kai1")
        rtnMsg = helper.getVerifyEmail(self.db, user1, False)
        self.assertEqual(rtnMsg["recipient"], "kai@gmail.com")
        
        rtnMsg = helper.recoveryAcc(self.db, user1, "12345", "kai12345")
        self.assertEqual(rtnMsg["message"], "false")

        rtnMsg = helper.recoveryAcc(self.db, user1, "", "kai12345")
        self.assertEqual(rtnMsg["message"], "false")

        rtnMsg = helper.recoveryAcc(self.db, user1, "", "")
        self.assertEqual(rtnMsg["message"], "false")

        rtnMsg = helper.recoveryAcc(self.db, None, user1.lastOtp, "12345")
        self.assertEqual(rtnMsg["message"], "Username doesn't exist")

    def test_recovery_Acc_valid(self):
        user1 = helper.get_user_by_username(self.db,"kai1")
        rtnMsg = helper.getVerifyEmail(self.db, user1, False)
        self.assertEqual(rtnMsg["recipient"], "kai@gmail.com")
        self.assertTrue(helper.verify_password("kai12345", user1.password))
        rtnMsg = helper.recoveryAcc(self.db, user1, user1.lastOtp, "kai123456")
        self.assertEqual(rtnMsg["message"], "true")

        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertEqual(user1.lastOtp, None)
        self.assertTrue(helper.verify_password("kai123456", user1.password))

    def test_setMFA_invalid(self):
        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertEqual(user1.mfa, None)
        rtnMsg = helper.setMFA(self.db, None, "")
        self.assertEqual(rtnMsg["message"], "false")
        rtnMsg = helper.setMFA(self.db, user1, "123")
        self.assertEqual(rtnMsg["message"], "false")

    def test_setMFA_valid(self):
        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertEqual(user1.mfa, None)
        rtnMsg = helper.setMFA(self.db, user1, "email")
        self.assertEqual(rtnMsg["message"], "true")
        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertEqual(user1.mfa, "email")

        rtnMsg = helper.setMFA(self.db, user1, "")
        self.assertEqual(rtnMsg["message"], "true")
        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertEqual(user1.mfa, "")

    def test_verifyMFA_invalid(self):
        user1 = helper.get_user_by_username(self.db,"kai2")
        self.assertEqual(user1.lastOtp, None)
        rtnMsg = helper.verifyMFA(self.db, None, None)
        self.assertEqual(rtnMsg["message"], "Username doesn't exist")

        rtnMsg = helper.verifyMFA(self.db, user1, None)
        self.assertEqual(rtnMsg["message"], "false")

        rtnMsg = helper.verifyMFA(self.db, user1, "123456")
        self.assertEqual(rtnMsg["message"], "false")

    def test_verifyMFA_valid(self):
        user1 = helper.get_user_by_username(self.db,"kai1")
        rtnMsg = helper.getVerifyEmail(self.db, user1, False)
        self.assertEqual(rtnMsg["recipient"], "kai@gmail.com")

        user1 = helper.get_user_by_username(self.db,"kai1")
        rtnMsg = helper.verifyMFA(self.db, user1, user1.lastOtp)
        self.assertEqual(rtnMsg["message"], "true")
        self.assertEqual(rtnMsg["user_name"], "kai1")

    def test_useOtp_invalid(self):
        self.assertEqual(helper.useOtp(self.db, None, None), False)
        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertEqual(user1.lastOtp, None)
        self.assertEqual(helper.useOtp(self.db, user1, None), False)
        self.assertEqual(helper.useOtp(self.db, user1, ""), False)
        self.assertEqual(helper.useOtp(self.db, user1, "12345"), False)

        helper.getVerifyEmail(self.db, user1, False)

        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertNotEqual(user1.lastOtp, None)
        self.assertEqual(helper.useOtp(self.db, user1, None), False)
        self.assertEqual(helper.useOtp(self.db, user1, ""), False)
        self.assertEqual(helper.useOtp(self.db, user1, "12345"), False)

    def test_useOtp_valid(self):
        user1 = helper.get_user_by_username(self.db,"kai1")
        helper.getVerifyEmail(self.db, user1, False)
        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertNotEqual(user1.lastOtp, None)
        self.assertEqual(helper.useOtp(self.db, user1, user1.lastOtp), True)
        user1 = helper.get_user_by_username(self.db,"kai1")
        self.assertEqual(user1.lastOtp, None)

    def test_db_search(self):
        rtn = helper.get_users_search(self.db, "ka", True)
        self.assertEqual(rtn[0].username, "kai1")
        self.assertEqual(rtn[1].username, "kai2")

        rtn = helper.get_users_search(self.db, "jo", True)
        self.assertEqual(rtn[0].username, "joe")


if __name__ == '__main__':
    unittest.main()