import React, { useEffect, useMemo, useState } from "react";
import { useCart } from "../../hooks/useCart";
import { forEach, isEmpty, map, reduce, startCase } from "lodash";
import useProducts from "../../hooks/useProducts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";

const EmptyCart = () => {
  const {
    state: { wishlist },
    actions: { toggleCartView },
  } = useCart();
  return (
    <div
      className={`flex justify-center items-center ${
        isEmpty(wishlist) ? "h-[80%]" : "h-[60%]"
      }`}
    >
      <div className="text-center text-slate-500">
        <img
          src="/images/hanger.png"
          alt="hanger icon"
          className="object-cover m-auto"
        />
        <span>
          Nothing in your cart yet. Explore our products and add something you
          love.
        </span>
        <br />
        <button className="border rounded px-2 mt-2" onClick={toggleCartView}>
          Shop Now
        </button>
      </div>
    </div>
  );
};

const Checkout = () => {
  const {
    state: { wishlist },
    actions: { toggleCartView },
  } = useCart();
  return (
    <div
      className={`flex justify-center items-center ${
        isEmpty(wishlist) ? "h-[80%]" : "h-[60%]"
      }`}
    >
      <div className="text-center text-slate-500">
        <img
          src="/images/glassCheers.png"
          alt="cheers icon"
          className="object-cover m-auto"
        />
        <span>
          Your order has been placed successfully! Ready to find something else
          you'll love?
        </span>
        <br />
        <button className="border rounded px-2 mt-2" onClick={toggleCartView}>
          Shop More
        </button>
      </div>
    </div>
  );
};

export default function Cart() {
  const {
    state: { products, wishlist },
    actions: {
      removeProduct,
      clearCart,
      // removeFromWishlist,
      moveFromWishlistToCart,
    },
  } = useCart();
  const [openCheckout, setOpenCheckout] = useState(false);
  const [productDetailsMap, setProductDetailsMap] = useState({});
  const { data } = useProducts();

  useEffect(() => {
    const newProductMap = {};
    forEach(data, (product) => {
      newProductMap[product.id] = { ...product };
    });
    setProductDetailsMap(newProductMap);
  }, []);

  const totalAmont = useMemo(() => {
    // if(isEmpty(productDetailsMap) || isEmpty(products)){
    //   return '...'
    // }
    return reduce(
      products,
      (sum, productId) => {
        return sum + productDetailsMap[productId]?.price;
      },
      0
    );
  }, [productDetailsMap, products]);

  const handleCheckout = () => {
    clearCart();
    setOpenCheckout(true);
  };

  return (
    <div className="text-black px-4 pt-4 overflow-scroll h-[95%]">
      {isEmpty(products) ? (
        openCheckout ? (
          <Checkout />
        ) : (
          <EmptyCart />
        )
      ) : (
        <>
          <h2 className="font-bold text-xl">Cart</h2>
          <div className="flex flex-col gap-2 py-4">
            {/* List products */}
            {map(products, (id) => {
              const product = productDetailsMap[id];
              return (
                <div key={id} className="flex justify-between text-slate-600">
                  <span className="w-3/5 text-start vertical-start flex gap-2">
                    <div className="relative">
                      <img
                        src={product?.imageUrl || "default-image.png"}
                        alt={product?.name || "Product image"}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                      <FontAwesomeIcon
                        icon={faCircleXmark}
                        className="absolute -top-1 -left-1 font-bold text-red-200"
                        onClick={() => removeProduct(id)}
                      />
                    </div>
                    {startCase(product?.name)}
                  </span>
                  <button onClick={() => {}}></button>
                  <div className="w-1/5 text-end">
                    <del>{product?.originalPrice}</del> {product?.price}
                  </div>
                </div>
              );
            })}
            {/* Total & Ceheckout */}
            <div className="w-full flex justify-end w-1/5">
              <div className="border-t-1 mt-2 py-2 pr-0 text-right">
                ${totalAmont}
                <br />
                <button
                  className="border-1 rounded-md mt-2 p-2 cursor-pointer hover:text-yellow-500"
                  onClick={handleCheckout}
                >
                  Checkout{" "}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      <br />
      {/* Whishlist */}
      {isEmpty(wishlist) ? null : (
        <>
          <h2 className="font-bold text-xl">Wishlist</h2>
          <div className="flex flex-col gap-2 py-4">
            {map(wishlist, (id) => {
              const product = productDetailsMap[id];
              return (
                <div key={id} className="flex justify-between text-slate-600">
                  <span className="w-3/5 text-start vertical-start flex gap-2">
                    <div className="w-1/5 relative">
                      <img
                        src={product?.imageUrl || "default-image.png"}
                        alt={product?.name || "Product image"}
                        width={40}
                        height={40}
                        className="object-cover"
                      />
                    </div>
                    <div className="w-4/5">
                      {startCase(product?.name)} <br />
                      <button
                        className="border-1 rounded-md px-1 text-sm"
                        onClick={() => moveFromWishlistToCart(id)}
                      >
                        Add{" "}
                        {product?.discountPercentage ? (
                          <span className="text-green-700">
                            - {product?.discountPercentage}% OFF{" "}
                          </span>
                        ) : null}
                      </button>
                    </div>
                  </span>

                  <div className="w-2/5 text-end">
                    <del>$ {product?.originalPrice}</del> <br /> ${" "}
                    {product?.price}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
