import unittest
from tests.database import SessionLocal, engine
from app import helper, models, schemas
from app.auth import JWTBearer
from sqlalchemy.orm import Session
import os
import re

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class TestUserAcc(unittest.TestCase):
    def test_vEmail_db1(self):
        models.Base.metadata.create_all(bind=engine)
        db = get_db()
        self.assertIsNot(db, None)
        helper.create_user(db, "kai1", "kai12345", "kai@gmail.com", "kai")

        self.assertEqual(helper.usernameNotexists(db, "kai"), False)

if __name__ == '__main__':
    unittest.main()