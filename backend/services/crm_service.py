from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import models

def update_customer_service_dates(db: Session, customer_id: int, enterprise_id: int = 1):
    """
    Updates the last and next service dates for a customer based on the enterprise's interval.
    """
    customer = db.query(models.Customer).filter(models.Customer.id == customer_id).first()
    enterprise = db.query(models.Enterprise).filter(models.Enterprise.id == enterprise_id).first()
    
    if customer and enterprise:
        customer.last_service_date = datetime.utcnow()
        interval = enterprise.service_interval_days or 90
        customer.next_service_date = customer.last_service_date + timedelta(days=interval)
        return True
    return False
