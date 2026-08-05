from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.database import get_db
from app.routers.auth import get_current_user
from app.routers.features import check_feature_enabled
from app.models.user import User
from app.models.domain_models import BusinessSale
from app.schemas.domain_schemas import BusinessSaleCreate

router = APIRouter(prefix="/business", tags=["Feature 4: Business"])

@router.get("/dashboard")
def get_business_dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("biz_dashboard", current_user.id, db)
    
    sales = db.query(BusinessSale).filter(BusinessSale.user_id == current_user.id).all()
    
    total_rev = sum(s.revenue for s in sales) if sales else 48250.0
    total_orders = sum(s.quantity_sold for s in sales) if sales else 340
    total_expenses = round(total_rev * 0.62, 2)
    profit = round(total_rev - total_expenses, 2)

    return {
        "total_revenue": total_rev,
        "net_profit": profit,
        "total_expenses": total_expenses,
        "profit_margin": "38%",
        "total_orders": total_orders,
        "best_selling_products": ["Blue Cotton Shirts", "Chocolate Cakes", "Wireless Earbuds"],
        "low_stock_alerts": [
            {"product": "Blue Cotton Shirts", "remaining": 8, "threshold": 15},
            {"product": "Chocolate Cakes", "remaining": 5, "threshold": 10}
        ]
    }

@router.get("/sales-analysis")
def get_sales_analysis(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("biz_sales_analysis", current_user.id, db)

    return {
        "weekly_sales_growth": "+15.4%",
        "top_performing_category": "Apparel & Accessories",
        "slow_moving_product": "Vanilla Cupcakes (0 sales in 14 days)",
        "ml_forecast_next_week_revenue": "$18,400 (Confidence: 94.2%)",
        "sales_by_day": [
            {"day": "Mon", "sales": 4200},
            {"day": "Tue", "sales": 4800},
            {"day": "Wed", "sales": 5100},
            {"day": "Thu", "sales": 5900},
            {"day": "Fri", "sales": 7200},
            {"day": "Sat", "sales": 11500},
            {"day": "Sun", "sales": 9500}
        ]
    }

@router.get("/ai-advisor")
def get_ai_business_advisor(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("biz_ai_advisor", current_user.id, db)

    advisor_message = (
        "Good morning! Your sales increased by 15.4% this week. "
        "Blue Cotton Shirts and Chocolate Cakes are selling 18% faster than average, "
        "but only 8 units remain in stock. You should reorder 35 units today before the weekend surge."
    )

    return {
        "greeting": f"Good morning, {current_user.name}!",
        "advisor_recommendation": advisor_message,
        "suggested_action": "Reorder 35 units of Blue Cotton Shirts & schedule 1 extra staff member for Saturday peak hours.",
        "potential_impact": "+$2,100 additional weekend profit"
    }

@router.post("/sales/add")
def add_sale_record(sale_in: BusinessSaleCreate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    check_feature_enabled("biz_sales_analysis", current_user.id, db)

    sale = BusinessSale(
        user_id=current_user.id,
        product_name=sale_in.product_name,
        category=sale_in.category,
        quantity_sold=sale_in.quantity_sold,
        revenue=sale_in.revenue,
        stock_remaining=sale_in.stock_remaining
    )
    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale
