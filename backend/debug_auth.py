import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.models.role import Role

load_dotenv()
engine = create_engine(os.getenv("DATABASE_URL"))
Session = sessionmaker(bind=engine)

with Session() as s:
    print('DB URL=', os.getenv('DATABASE_URL'))
    roles = s.query(Role).all()
    print('Roles=', [(r.id, r.name) for r in roles])
    users = s.query(User).all()
    print('Users=', [(u.email, u.role.name if u.role else None) for u in users])

    try:
        import json
        from urllib.request import Request, urlopen
        from urllib.error import HTTPError, URLError

        url = 'http://localhost:8000/api/auth/login'
        data = json.dumps({'email': 'admin@test.com', 'password': 'password'}).encode('utf-8')
        req = Request(url, data=data, headers={'Content-Type': 'application/json'})
        with urlopen(req, timeout=5) as resp:
            print('LOGIN status', resp.status)
            text = resp.read().decode('utf-8')
            print('LOGIN text', text)
    except HTTPError as e:
        print('LOGIN HTTPError', e.code, e.read().decode('utf-8'))
    except URLError as e:
        print('LOGIN URLError', e)
    except Exception as e:
        print('REQUEST ERROR', e)
