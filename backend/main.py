import os
from datetime import datetime
from string import ascii_lowercase

import jwt

from jwt import PyJWTError
import requests


from fastapi import FastAPI,HTTPException,Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer,OAuth2PasswordRequestForm

from sqlalchemy import create_engine
from sqlalchemy.orm import Session,sessionmaker

from models import Base,User,Asset,Portfolio,Transaction
from schemas import UserCreate,AddMoney,TradeAsset

app = FastAPI()
oauth2_scheme=OAuth2PasswordBearer(tokenUrl='token')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

engine=create_engine('sqlite:///./crypto_portfolio.db', connect_args={'check_same_thread': False})
SessionLocal=sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base.metadata.create_all(bind=engine)

SECRET_KEY = 'some-key-but-not-this-one'

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        if db.is_active:
            db.rollback()
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme),db: Session = Depends(get_db)):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=['HS256'])
        user=db.query(User).filter(User.username == payload['username']).first()
        return user
    except:
        raise HTTPException(status_code=401)

def get_crypto_price(symbol:str):
    try:
        response=requests.get(f'https://api.binance.com/api/v3/ticker/price?symbol={symbol}USDT')
        return float(response.json()['price'])
    except:
        return 0.0
@app.post('/register')
def register(user: UserCreate,db: Session = Depends(get_db)):
    db_user=User(username=user.username,password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    portfolio=Portfolio(user_id=db_user.id)
    db.add(portfolio)
    db.commit()

    return {'message':'Successfully registered'}

@app.post('/login')
def login(form_data: OAuth2PasswordRequestForm = Depends(),db: Session = Depends(get_db)):
    user=db.query(User).filter(User.username == form_data.username).first()
    if not user or user.password != form_data.password:
        raise HTTPException(status_code=400, detail='Information invalid')

    token=jwt.encode({'username':user.username},SECRET_KEY,algorithm='HS256')
    return {'access_token':token,'token_type':'bearer'}

@app.post('/add_money')
def add_money(money:AddMoney,user: User=Depends(get_current_user),db: Session = Depends(get_db)):
    portfolio=user.portfolio                  #user has portfolio as relationship
    portfolio.total_added_money+=money.amount
    portfolio.available_money+=money.amount

    db.commit()
    return {'message':'Successfully added money'}

@app.post('/buy')
def buy_asset(trade:TradeAsset,user:User=Depends(get_current_user),db: Session = Depends(get_db)):
    portfolio=user.portfolio
    price=get_crypto_price(trade.symbol)
    total_cost=price*trade.quantity

    if total_cost>portfolio.available_money:
        raise HTTPException(status_code=400, detail='Insufficient funds')

    asset=db.query(Asset).filter(Asset.portfolio_id==portfolio.id,Asset.symbol==trade.symbol).first()

    if asset:
        asset.quantity+=trade.quantity
    else:
        asset=Asset(portfolio_id=portfolio.id,symbol=trade.symbol,quantity=trade.quantity)

        db.add(asset)
    transaction=Transaction(portfolio_id=portfolio.id,symbol=trade.symbol,quantity=trade.quantity,price=price,timestamp=datetime.utcnow())
    db.add(transaction)

    portfolio.available_money-=total_cost
    db.commit()
    return {'message':'Successfully bought asset'}

@app.post('/sell')
def sell_asset(trade:TradeAsset,user:User=Depends(get_current_user),db: Session = Depends(get_db)):
    portfolio=user.portfolio
    asset=db.query(Asset).filter(Asset.portfolio_id==portfolio.id,Asset.symbol==trade.symbol).first()


    if not asset or asset.quantity<trade.quantity:
        raise HTTPException(status_code=400, detail='Insufficient Assets')
    price=get_crypto_price(trade.symbol)
    total_value=price*trade.quantity

    asset.quantity-=trade.quantity
    if asset.quantity==0:
        db.delete(asset)
    transaction=Transaction(portfolio_id=portfolio.id,symbol=trade.symbol,quantity=trade.quantity,price=price,timestamp=datetime.utcnow())
    db.add(transaction)

    portfolio.available_money += total_value
    db.commit()
    return {'message':'Successfully sold asset'}

@app.get('/portfolio')
def get_portfolio(user:User = Depends(get_current_user),db: Session = Depends(get_db)):
    portfolio=user.portfolio

    asset_response=[]
    total_value=portfolio.available_money

    for asset in portfolio.assets:
        current_price=get_crypto_price(asset.symbol)
        net_quantity=asset.quantity
        asset_value=current_price*net_quantity
        total_value+=asset_value
        transactions=db.query(Transaction).filter(Transaction.portfolio_id==portfolio.id,Transaction.symbol==asset.symbol).all()
        net_cost=sum(t.price*t.quantity for t in transactions)
        asset_response.append({
            'symbol':asset.symbol,
            'quantity':asset.quantity,
            'current_price':current_price,
            'total_value':asset_value,
            'performance_abs':asset_value-net_cost,
            'performance_rel':(asset_value -net_cost)/net_cost * 100 if net_cost!=0 else 0


        })
    return{
        'total_added_money':portfolio.total_added_money,
        'available_money':portfolio.available_money,
        'total_value':total_value,
        'performance_abs':total_value - portfolio.total_added_money,
        'performance_rel':(total_value - portfolio.total_added_money)/portfolio.total_added_money * 100 if portfolio.total_added_money!=0 else 0,
        'assets':asset_response
    }

