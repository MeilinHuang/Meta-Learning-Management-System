# type: ignore

from fastapi import Request, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from typing import Generator
from sqlalchemy.orm import Session

from .models import User

from .helper import verify_user


class JWTBearer(HTTPBearer):
    def __init__(self, db_generator: Generator[Session, None, None], auto_error: bool = True):
        self.db_generator = db_generator
        self.db = next(db_generator)
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):

        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if not credentials.scheme == "Bearer":
                raise HTTPException(
                    status_code=403, detail="Invalid authentication scheme.")
            if not self.verify_jwt(credentials.credentials):
                raise HTTPException(
                    status_code=403, detail="Invalid token or expired token.")
            return credentials.credentials
        else:
            raise HTTPException(
                status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> bool:
        isTokenValid: bool = False
        try:
            payload, user = verify_user(self.db, jwtoken)
            self.db.close()
        except Exception as e:
            payload = None
        if payload:
            isTokenValid = True
        return isTokenValid
