import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

def get_stock_recommendation(ticker_symbol):
    """
    Fetches stock data using yfinance and provides a basic recommendation
    based on simple technical indicators (Moving Averages and RSI).
    """
    try:
        ticker = yf.Ticker(ticker_symbol)
        # Fetching 1 year of data for technical analysis
        df = ticker.history(period="1y")
        
        if df.empty:
            return {"error": f"No data found for symbol {ticker_symbol}"}

        # Current Price
        current_price = df['Close'].iloc[-1]
        
        # Technical Indicators
        # 1. Simple Moving Averages
        df['SMA_50'] = df['Close'].rolling(window=50).mean()
        df['SMA_200'] = df['Close'].rolling(window=200).mean()
        
        latest_sma_50 = df['SMA_50'].iloc[-1]
        latest_sma_200 = df['SMA_200'].iloc[-1]
        
        # 2. RSI (Relative Strength Index)
        delta = df['Close'].diff()
        gain = (delta.where(delta > 0, 0)).rolling(window=14).mean()
        loss = (-delta.where(delta < 0, 0)).rolling(window=14).mean()
        rs = gain / loss
        df['RSI'] = 100 - (100 / (1 + rs))
        latest_rsi = df['RSI'].iloc[-1]
        
        # Recommendation Logic
        recommendation = "Hold"
        reasons = []
        score = 50 # Base score out of 100
        
        # SMA Crossover / Positioning
        if current_price > latest_sma_50 > latest_sma_200:
            recommendation = "Strong Buy"
            reasons.append("Bullish trend: Price is above both 50-day and 200-day Moving Averages.")
            score += 30
        elif current_price > latest_sma_50:
            recommendation = "Buy"
            reasons.append("Positive momentum: Price is above the 50-day Moving Average.")
            score += 15
        elif current_price < latest_sma_50 < latest_sma_200:
            recommendation = "Strong Sell"
            reasons.append("Bearish trend: Price is below both 50-day and 200-day Moving Averages.")
            score -= 30
        elif current_price < latest_sma_50:
            recommendation = "Sell"
            reasons.append("Negative momentum: Price is below the 50-day Moving Average.")
            score -= 15
            
        # RSI Analysis
        if latest_rsi > 70:
            reasons.append(f"Overbought: RSI is {latest_rsi:.2f}, suggesting a potential pullback.")
            score -= 10
        elif latest_rsi < 30:
            reasons.append(f"Oversold: RSI is {latest_rsi:.2f}, suggesting a potential buying opportunity.")
            score += 10
        else:
            reasons.append(f"Neutral RSI: RSI is {latest_rsi:.2f}, indicating no extreme conditions.")

        # Final Recommendation adjustment based on score
        if score >= 75: recommendation = "Strong Buy"
        elif score >= 60: recommendation = "Buy"
        elif score <= 25: recommendation = "Strong Sell"
        elif score <= 40: recommendation = "Sell"
        else: recommendation = "Hold"

        # Information for display
        info = ticker.info
        stock_info = {
            "symbol": ticker_symbol,
            "name": info.get("longName", ticker_symbol),
            "current_price": f"{current_price:.2f}",
            "currency": info.get("currency", "USD"),
            "recommendation": recommendation,
            "reasons": reasons,
            "score": score,
            "rsi": f"{latest_rsi:.2f}",
            "sma_50": f"{latest_sma_50:.2f}",
            "sma_200": f"{latest_sma_200:.2f}",
            "market_cap": info.get("marketCap", "N/A"),
            "pe_ratio": info.get("trailingPE", "N/A"),
            "history": df[['Close']].tail(30).reset_index().to_dict(orient='records') # Last 30 days for chart
        }
        
        return stock_info
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Test
    print(get_stock_recommendation("AAPL"))
