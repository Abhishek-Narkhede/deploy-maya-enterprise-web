import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { apiPOST, apiPUT } from '../../utilities/apiHelpers';
import { BiErrorCircle } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { FaEdit } from 'react-icons/fa';
import { useSelector } from 'react-redux';

const OrderSummeryComp = (props) => {
	const { getMyCart, myCartData, subTotal, selectedOption, deliveryCharg, totalPrice, selectedCountry, updateTotalAmountToPay, setDeliveryCharg, setFreeCouponSucess,
		freeCouponSucess, setOriginalDelliveryCharg, originalDelliveryCharg, handleCouponDetailChange, handleCouponDiscountChange,
		handleCartWithCouponChange, setVatCharge, defaultAddress, getMyAllAddress, couponDetail, couponDiscount } = props;

	const [promoCodeVisible, setPromoCodeVisible] = useState(false);
	const [couponCodeInput, setCouponCodeInput] = useState('');
	const [couponError, setCouponError] = useState('')
	const { userData } = useSelector((state) => state.user);

	const [couponSuccess, setCouponSuccess] = useState(false);
	const [discountedTotalPrice, setDiscountedTotalPrice] = useState(0);
	const [originalPrice, setOriginalPrice] = useState(0);
	const [couponId, setCouponId] = useState();
	const [cartData, setCartData] = useState(myCartData);
	const [autoDiscount, setAutoDiscount] = useState(false)
	const [deliveryFee, setDeliveryFee] = useState(deliveryCharg)
	const [subTotalFinal, setSubTotalFinal] = useState()
	const [finalTotal, setFinalTotal] = useState()
	const [isAutoDiscount, setIsAutoDiscount] = useState(false)
	const [finalOneTotal, setFinalOneTotal] = useState()
	const [freeCouponSuccess, setFreeCouponSuccess] = useState(false)
	const [editMode, setEditMode] = useState(false);
	const [newOrderNotes, setNewOrderNotes] = useState(props?.defaultAddress?.orderNotes || '');

	const handleEditClick = () => {
		setEditMode(true);
	};

	const handleInputChange = (event) => {
		setNewOrderNotes(event.target.value);
	};

	const updateOrdernotes = async () => {
		const payload = {
			orderNotes: newOrderNotes,
		}
		try {
			const response = await apiPUT(`/v1/address/update-ordernotes/${props.defaultAddress?.id}`, payload)
			if (response?.status === 200) {
				getMyAllAddress()
			} else {
				toast.error(response?.data?.message)
			}
		} catch (error) {
			toast.error(error.message)
		}
		setEditMode(false);
	}

	const togglePromoCodeInput = () => {
		if (cartData?.length == 0) {
			toast.error("Your cart is empty")
			return
		}
		setPromoCodeVisible(!promoCodeVisible);
	};
	const vatCharges = cartData && cartData?.map(item => item.productDetails[0].vatCharge);

	// Finding the maximum vatCharge using the reduce function
	const maxVatCharge = vatCharges && vatCharges?.reduce((max, current) => Math.max(max, current), 0);

	setVatCharge(maxVatCharge)
	const applyCouponToCartItem = (cartItem, coupon) => {


		if (cartItem.productDetails && cartItem.productDetails[0]) {
			const productId = cartItem.productDetails[0]._id;
			const originalPrice = cartItem?.sale_price ? cartItem?.sale_price : cartItem.productDetails[0].price
			if (
				(coupon.apply_to === 'all_products' ||
					(coupon.apply_to === 'specific_products' &&
						coupon.specific_products?.includes(productId)
					) || (coupon.apply_to === 'specific_brand' &&
						cartItem?.productDetails[0]?.categoryArray.includes(coupon?.specific_brand)

					)) &&
				coupon.type === 'percentage'
			) {
				// Calculate the discounted price without multiplying by quantity
				const discountPercentage = coupon.discount_percentage;
				const discountedPrice = originalPrice - (originalPrice * (discountPercentage / 100));
				// Add the couponName key to the cartItem

				cartItem.couponName = coupon.name;

				// Add the sale_price key to the cartItem
				cartItem.sale_price = Number(discountedPrice.toFixed(2));


			} else if (
				(coupon.apply_to === 'all_products' ||
					(coupon.apply_to === 'specific_products' &&
						coupon.specific_products?.includes(productId)
					) || (coupon.apply_to === 'specific_brand' &&
						cartItem?.productDetails[0]?.categoryArray.includes(coupon?.specific_brand)
					)) &&
				coupon.type === 'price'
			) {
				// Subtract the discount_price from the original price
				const discountedPrice = originalPrice - coupon.discount_price;

				// Ensure the discounted price is not negative
				const sale_price = Math.max(0, discountedPrice);

				// Add the sale_price key to the cartItem
				cartItem.sale_price = Number(sale_price.toFixed(2));

				// Add the couponName key to the cartItem
				cartItem.couponName = coupon.name;
			}
		}

		return cartItem;
	};



	const handleCouponCodeApply = async () => {
		if (cartData?.length == 0) {
			toast.error("Your cart is empty")
			return
		}
		if (couponCodeInput === "" || couponCodeInput === undefined) {
			setCouponError('Enter Coupon Code');
		} else {
			try {
				const requestData = {
					cartData: cartData,
					couponCode: couponCodeInput
				};

				const response = await apiPOST('v1/coupon/apply-coupon', requestData);

				if (response?.data?.code === 200) {
					let cp = response?.data?.data
					if (response?.data?.data?.coupon?.type == "free_shipping") {
						setDeliveryFee(0)
						setDeliveryCharg(0)
						setFreeCouponSucess(true)
						handleCouponDetailChange(response?.data?.data?.coupon)
						handleCouponDiscountChange(originalDelliveryCharg)
						setFreeCouponSuccess(true)
					} else {
						handleCouponDetailChange(cp?.coupon)
						setCouponId(response?.data?.data?.coupon?.id);
						setDiscountedTotalPrice(response?.data?.data?.discountedTotalPrice)
						setOriginalPrice(response?.data?.data?.originalPrice)
						setCouponSuccess(true)
						let cartDataWithDiscount = cartData;
						if (cp?.coupon?.apply_to == 'all_products') {
							if (cp?.coupon?.type == 'percentage') {
								cartDataWithDiscount = cartData.map(cartItem => applyCouponToCartItem(cartItem, cp?.coupon));
							} else if (cp?.coupon?.type == 'price') {
								cartDataWithDiscount = cartData.map(cartItem => applyCouponToCartItem(cartItem, cp?.coupon));
							}
						} else if (cp?.coupon?.apply_to == "specific_products") {
							if (cp?.coupon?.type == 'percentage') {
								cartDataWithDiscount = cartData.map(cartItem => applyCouponToCartItem(cartItem, cp?.coupon));
							} else if (cp?.coupon?.type == 'price') {
								cartDataWithDiscount = cartData.map(cartItem => applyCouponToCartItem(cartItem, cp?.coupon));
							}
						} else if (cp?.coupon?.apply_to == "specific_brand") {
							if (cp?.coupon?.type == 'percentage') {
								cartDataWithDiscount = cartData.map(cartItem => applyCouponToCartItem(cartItem, cp?.coupon));
							} else if (cp?.coupon?.type == 'price') {
								cartDataWithDiscount = cartData.map(cartItem => applyCouponToCartItem(cartItem, cp?.coupon));
							}
						} else if (cp.coupon?.apply_to == "minimum_order_subtotal") {

						}
						let discountedPrice = Number((cp?.originalPrice - cp?.discountedTotalPrice).toFixed(2));
						handleCouponDiscountChange(discountedPrice);
						handleCartWithCouponChange(cartDataWithDiscount)

					}
				} else if (response?.data?.code === 400) {
					setCouponSuccess(false)
					setCouponError(response?.data?.data)
				} else {
					setCouponSuccess(false)
					setCouponError("Something went wrong !!")
					toast.error(response?.data?.data?.data);
				}
			} catch (error) {
				Toast.error('Error applying coupon', error);
			}
		}
	};


	if (couponSuccess) {

		updateTotalAmountToPay(((Number(discountedTotalPrice) + Number(deliveryCharg)).toFixed(2)), couponId);
	} else if (isAutoDiscount && finalOneTotal) {

		updateTotalAmountToPay(Number(finalOneTotal).toFixed(2))
	}
	else {
		updateTotalAmountToPay(totalPrice)
	}

	// GiftCard 
	const [isGiftCardVisible, setIsGiftCardVisible] = useState(false);
	const [giftCardCode, setGiftCardCode] = useState('');

	// GiftCard Function
	const handleGiftCardClick = () => {
		setIsGiftCardVisible(!isGiftCardVisible);
	};
	const handleRemoveCoupon = () => {
		getMyCart()
		setCouponCodeInput('');
		setCouponError('');
		setCouponSuccess(false);
		setDiscountedTotalPrice(0);
		setOriginalPrice(0);
		handleCouponDetailChange({})
		setFreeCouponSuccess(false)

		setDeliveryFee(originalDelliveryCharg);
		setFreeCouponSucess(false);
		setDeliveryCharg(originalDelliveryCharg)
		updateTotalAmountToPay(((Number(subTotal) + Number(deliveryCharg)).toFixed(2)), couponId);
	};


	// GiftCard apply function
	const handleGiftCardApply = () => {


	};
	useEffect(() => {
		const requestData = {
			cartData: myCartData ? myCartData : [],
		};

		const fetchData = async () => {
			try {
				const response = await apiPOST('v1/coupon/apply-auto-discount', requestData);
				if (response.status === 200) {
					setCartData(response?.data?.data?.cartData)
					setAutoDiscount(response?.data?.data?.auto_discount)
					let carts = response?.data?.data?.cartData;
					let totalprice = 0;
					let tempPrice = 0;
					if (carts?.length) {
						for (let i = 0; i < carts.length; i++) {
							tempPrice += Number(carts[i]?.productDetails[0]?.price) * Number(carts[i]?.quantity);
							totalprice += Number(carts[i]?.sale_price || carts[i]?.productDetails[0]?.price) * Number(carts[i]?.quantity);
						}
					}
					let subtotal = Number(totalprice.toFixed(2))
					let TotalPrice = (subtotal + deliveryCharg).toFixed(2)

					setSubTotalFinal(subtotal)
					setFinalTotal(TotalPrice)
					setFinalOneTotal(TotalPrice)
					setIsAutoDiscount(true)
					handleCartWithCouponChange(response?.data?.data?.cartData)
					handleCouponDiscountChange(Number(((tempPrice + deliveryCharg) - (subtotal + deliveryCharg)).toFixed(2)))
				} else {

				}
			} catch (error) {
				Toast.error('Error applying auto discount', error?.message);
			}
		};
		setDeliveryFee(deliveryCharg)

		fetchData();
	}, [myCartData, deliveryCharg]);

	useEffect(() => {
		if (Object.keys(couponDetail).length == 0 && couponSuccess) {
			setCouponSuccess(false)
		}
	}, [couponDetail])
	return (


		<div className="" style={{ marginBottom: "30px" }}>
			<div style={{ padding: "15px", marginBottom: "20px", backgroundColor: "#0000000f", border: "none" }}>
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<h5>Order Summary  ({cartData?.length || 0})</h5>
					<Link to="/cart"><span style={{ textDecoration: "underline", color: "black" }}><h5>Edit Cart</h5></span></Link>
				</div>
				<hr />
				{cartData?.length ? <>
					{cartData.map((item, i) => (
						<div key={i}>
							{item?.hasOwnProperty("productDetail") ?

								<div style={{ background: "" }}>
									<p style={{ marginLeft: 10, marginTop: 10, fontWeight: "bold", color: "black" }}>Product :</p>
								</div> : null
							}
							<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>

								<div className='d-flex  '>
									<div className=''>
										<LazyLoadImage
											src={item?.productDetails[0]?.productImageUrl}
											alt={item?.productDetails[0]?.imageAltText || item?.productDetails[0]?.name}
											style={{ width: "60px", height: "60px", marginRight: "20px" }}
										/>
									</div>

									<div className='  '>

										<div style={{ wordBreak: "normal" }}>{item?.productDetails[0]?.name}  </div>
										<div style={{ color: '#7f7f7f', fontSize: '14px' }}>
											{item?.variants?.pots ?
												`(${item?.variants?.pots} Pots)` :
												item?.variants?.size ?
													`(${item?.variants?.size} size) ` :
													""
											}
										</div>
										{item?.couponName ? <div className='' style={{ fontSize: '13px', color: '#0396ff' }}>{item?.couponName} </div> : ''}

										<p className='mt-1' style={{}}>Qty : {item?.quantity} </p>

									</div>

								</div>

								<div className='d-flex justify-content-end'>  <p>{item?.sale_price ? <span><span className='line-through-text'>£{(item?.productDetails[0]?.price * item?.quantity).toFixed(2)}</span> £{(item?.sale_price * item?.quantity).toFixed(2)}</span> : <span>£{(item?.productDetails[0]?.price * item?.quantity).toFixed(2)} </span>}</p></div>

							</div>




							{item?.productDetail[0]?.subProduct.map((myitem, index) => (
								<div className="row   mb-2" style={{ marginLeft: 15 }}>
									<div className=" col-4 col-lg-3 col-sm-4 d-flex justify-content-center ">
										<div className=" ">
											<LazyLoadImage
												src={myitem?.productDetailsObj?.productImageUrl}
												alt=""
												width={80}
											/>
										</div>
									</div>
									<div className="col-6 col-sm-6 col-lg-6 fs-6 opacity-75">
										<div>{myitem?.productDetailsObj?.name}</div>

										<div className="mt-2">Quantity {myitem?.quantity}</div>
										<div className="mt-2">£{myitem?.productDetailsObj?.price}</div>
									</div>
								</div>
							))}


						</div>))}</> : 'No items in your cart'}
				<hr />
				<div style={{ padding: '0 10px  0 0' }}>
					<p onClick={togglePromoCodeInput} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
						<p>
							<Gift style={{ marginRight: '5px', verticalAlign: 'middle' }} />Enter a promo code
						</p>
					</p>

					{promoCodeVisible && (
						<div>
							{autoDiscount ?
								(
									<Form.Group controlId="promoCode">
										<FormControl
											style={{
												marginBottom: '5px',
												height: '3rem',
												border: couponError
													? '1px solid red'
													: couponSuccess || freeCouponSucess
														? '2px solid green'
														: '1px solid #ced4da',
											}}
											type="text"
											placeholder="Enter your promo code"
											value={couponCodeInput}
											onChange={(e) => setCouponCodeInput(e.target.value)}
											onFocus={() => setCouponError("")}
											disabled={couponSuccess || freeCouponSucess}
										/>
									</Form.Group>)
								:
								(
									<Form.Group controlId="promoCode">
										<FormControl
											style={{
												marginBottom: '5px',
												height: '3rem',
												border: couponError
													? '1px solid red'
													: couponSuccess || freeCouponSucess
														? '2px solid green'
														: '1px solid #ced4da',
											}}
											type="text"
											placeholder="Enter your promo code"
											value={couponCodeInput}
											onChange={(e) => setCouponCodeInput(e.target.value)}
											onFocus={() => setCouponError("")}
											disabled={couponSuccess || freeCouponSucess}
										/>
									</Form.Group>
								)}

							{couponError && (
								<div style={{ color: 'red', paddingTop: '2px', display: 'flex', alignItems: 'center' }}>
									<span className="d-flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
										<BiErrorCircle />
									</span>
									<span style={{ fontSize: '14px', paddingLeft: '5px' }}>{couponError}</span>
								</div>
							)}
							{couponSuccess && (
								<div style={{ color: 'green', paddingTop: '2px', display: 'flex', alignItems: 'center' }}>
									<span className="d-flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
										{` You saved total of £ ${(originalPrice - discountedTotalPrice).toFixed(2)}`}
									</span>
								</div>
							)
							}
							{
								freeCouponSucess && (
									<div style={{ color: 'green', paddingTop: '2px', display: 'flex', alignItems: 'center' }}>
										<span className="d-flex" style={{ justifyContent: 'center', alignItems: 'center' }}>
											{`Free shipping coupon applied!`}
										</span>
									</div>
								)
							}
							{!autoDiscount ?
								<Button
									variant="primary"
									style={{
										backgroundColor: 'black',
										marginTop: '15px',
										width: '100%',
										height: '45px',
										marginBottom: '10px',
									}}
									onClick={couponSuccess || freeCouponSucess ? handleRemoveCoupon : handleCouponCodeApply}
								>
									{couponSuccess || freeCouponSucess ? "Remove" : "Apply"}
								</Button>
								:
								<Button
									variant="primary"
									style={{
										backgroundColor: 'black',
										marginTop: '15px',
										width: '100%',
										height: '45px',
										marginBottom: '10px',
									}}
									onClick={couponSuccess || freeCouponSucess ? handleRemoveCoupon : handleCouponCodeApply}
								>
									{couponSuccess || freeCouponSucess ? "Remove" : "Apply"}
								</Button>
							}

						</div>
					)}
				</div>
				{defaultAddress

					? <div> <hr />
						{`OrderNotes : ${props?.defaultAddress?.orderNotes ? props?.defaultAddress?.orderNotes : ''}`}
						<div>
							{editMode ? (
								<div>
									{/* <input
                        type="text"
                        value={newOrderNotes}
                        onChange={handleInputChange}
                    /> */}
									<FormControl
										style={{
											marginBottom: '5px',
											height: '3rem',
											border: '2px solid rgb(206, 212, 218)'

										}}
										type="text"
										placeholder="Enter order note here"
										value={newOrderNotes}
										onChange={handleInputChange}
									/>
									<Button
										variant="primary"
										style={{
											backgroundColor: 'black',
											marginTop: '15px',
											width: '100%',
											height: '45px',
											marginBottom: '10px',
										}}
										onClick={updateOrdernotes}							>
										Save
									</Button>
									{/* <button onClick={updateOrdernotes}>Save</button> */}
								</div>
							) : (
								<div>
									<span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={handleEditClick}>
										<FaEdit style={{ fontSize: '1.3em', margin: '3px' }} />
										Edit
									</span>
								</div>
							)}
						</div>
					</div> : ''
				}
				{/* Do not Remove This Comment - Note : If you want to remove, First Ask "Gaffar Shaikh Abdul Siddique Shaikh" */}
				{/* <div >
                    <p onClick={handleGiftCardClick} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                        <p>
                            <Gift style={{ marginRight: '5px', verticalAlign: 'middle' }} />
                            Redeem a gift card
                        </p>
                    </p>
                    {isGiftCardVisible && (
                        <div>
                            <Form.Group controlId="giftCard">
                                <FormControl
                                    type="text"
                                    placeholder="Enter gift card code"
                                    style={{ height: '3rem' }}
                                    value={giftCardCode}
                                    onChange={(e) => setGiftCardCode(e.target.value)}
                                />
                            </Form.Group>
                            <Button
                                variant="primary"
                                style={{ backgroundColor: 'black', marginTop: '15px', width: '100%', height: '45px' }}
                                onClick={handleGiftCardApply}
                            >
                                Apply
                            </Button>
                        </div>
                    )}
                </div> */}
				<hr />
				<div>
					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px" }}>
						<div>Subtotal</div>
						<div>
							<span className={couponSuccess ? `line-through-text` : ''}>
								£ {subTotalFinal}
							</span>
							<span style={{ marginLeft: "4px" }}>
								{couponSuccess ? `£ ${discountedTotalPrice}` : ''}
							</span>
						</div>
					</div>
					{couponSuccess ? <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px" }}>
						<div>Promo Code: {couponCodeInput}</div>
						{couponDetail?.apply_to !== "minimum_order_subtotal" ?
							<div>- £ {(subTotalFinal - discountedTotalPrice).toFixed(2)}</div>
							: <div>- £ {(couponDiscount).toFixed(2)}</div>
						}
					</div> : ""}


					<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px" }}>
						<div>Delivery</div>
						<div>
							{(!selectedOption || selectedOption === "free") ? "- -" :
								<span>
									{freeCouponSuccess ? <span>
										<span className='line-through-text' style={{ margin: '0 5px' }}>
											{`£ ${originalDelliveryCharg}`}
										</span>
										{`£ ${deliveryFee}`}
									</span> :
										`£ ${deliveryFee}`
									}
								</span>
							}
						</div>
					</div>

					{selectedCountry == "United Kingdom" ? <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px" }}>
						<div>VAT</div>
						<div>
							{/* {`£${((Number(discountedTotalPrice) + Number(deliveryCharg)) * 0.2).toFixed(2)}`} */}
							{maxVatCharge}%
						</div>
					</div> : ""}
				</div>
				<hr />
				<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "15px" }}>
					<div><h4>Total</h4></div>
					<div>
						{couponSuccess ?
							`£ ${((Number(discountedTotalPrice) + Number(deliveryCharg))).toFixed(2)}`
							:
							(`£ ${Number(finalTotal).toFixed(2)}`)
						}
					</div>
				</div>
			</div>
			<div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
				<LockFill style={{ fontSize: "2rem", marginRight: "10px", height: "18px" }} /> Secure Checkout
			</div>
		</div>

	);
}

export default OrderSummeryComp;