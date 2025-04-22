import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLayerGroup,
  faCartShopping,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../hooks/useCart";
export default function Header() {
  const {
    state: {products, showCart},
    actions: { toggleCartView },
  } = useCart();
  return (
    <div className="text-yellow-500 h-[5%] flex justify-between px-4">
      <h1 className="font-bold flex gap-2 items-center text-xl">
        <FontAwesomeIcon icon={faLayerGroup} />
        Stack
      </h1>
      <div
        className="relative flex gap-2 items-center justify-between color-zinc-600"
        onClick={toggleCartView}
      >
        <FontAwesomeIcon icon={showCart ? faXmark : faCartShopping} color= "#808080" />
      </div>
    </div>
  );
}
