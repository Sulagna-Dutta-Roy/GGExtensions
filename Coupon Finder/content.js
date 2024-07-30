async function findAndApplyCoupons() {
    const coupons = ['SAVE10', 'DISCOUNT20', 'FREESHIP'];
  
    let appliedCoupon = null;
    for (let coupon of coupons) {
      if (await applyCoupon(coupon)) {
        appliedCoupon = coupon;
        break;
      }
    }
  
    if (appliedCoupon) {
      alert(`Coupon applied: ${appliedCoupon}`);
    } else {
      alert('No valid coupons found');
    }
  }
  
  async function applyCoupon(coupon) {
    console.log(`Trying coupon: ${coupon}`);
    
    await simulateNetworkRequest();
  
    const success = Math.random() > 0.5;
  
    console.log(success ? `Coupon ${coupon} applied successfully` : `Coupon ${coupon} failed`);
    return success;
  }
  
  function simulateNetworkRequest() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
  }
  
  findAndApplyCoupons();
  